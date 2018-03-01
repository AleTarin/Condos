require 'mongo'

module Database
	
	def self.validar_login(username, password)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')

		if mongo[:admins].find({:username => username, :password => password}).count() == 1
			return {:status => 'ok', :data => 'super_admin'}
		end

		if mongo[:usuarios].find({:username => username, :password => password}).count() != 1
			return {:status => 'error', :data => 'Login invalido'}
		end
		res = {:status => 'ok', :data => {}}

		if self.es_tipo(username, 'inquilino')
			res[:data][:inquilino] = self.datos_login_inquilino(username)
		end

		if self.es_tipo(username, 'propietario')
			res[:data][:propietario] = self.datos_login_propietario(username)
		end

		if self.es_tipo(username, 'admin')
			res[:data][:admin] = self.datos_login_admin(username)
		end

		return res
		mongo.close()
	end

	def self.es_tipo(username, tipo)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		if mongo[:usuario_tiene_tipos].find({:username => username, :tipo => tipo}).count() >= 1
			return true
		end
		return false
		mongo.close()
	end

	def self.datos_login_admin(username)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		mongo.close()
		return mongo[:administra_condominios].find({:username => username}, projection: {condominio: 1, _id:0}).to_a()
	end

	def self.datos_login_inquilino(username)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		mongo.close()
		return mongo[:vive_en].find({:username => username}, projection: {condominio: 1, cuarto: 1, _id:0}).to_a()
	end

	def self.datos_login_propietario(username)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		mongo.close()
		return mongo[:propietario_de].find({:username => username}, projection: {condominio: 1, _id:0}).to_a()
	end

	def self.lista_manejar_usuarios(username_admin, nombre_condo)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		if !self.es_tipo(username_admin, 'admin')
			return {:status => 'error', :data => 'Este usuario no es administrador'}
		end

		if mongo[:administra_condominios].find({:username => username_admin, :condominio => nombre_condo}).count == 0
			return {:status => 'error', :data => 'Este admin no administra este condominio'}
		end

		res = {:status => 'ok', :data => {:usuarios => []}}

		mongo[:vive_en].find({:condominio => nombre_condo}, projection: {username: 1, _id:0}).to_a().each do |elem|
			res[:data][:usuarios].push(elem)
		end
		mongo[:administra_condominios].find({:condominio => nombre_condo}, projection: {username: 1, _id:0}).to_a().each do |elem|
			res[:data][:usuarios].push(elem)
		end
		mongo[:propietario_de].find({:condominio => nombre_condo}, projection: {username: 1, _id:0}).to_a().each do |elem|
			res[:data][:usuarios].push(elem)
		end

		res[:data][:usuarios] = res[:data][:usuarios].uniq
		mongo.close()
		return res
	end

	def self.obtener_usuario(username)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		usuario = mongo[:usuarios].find({username: username})
		if usuario.count() == 0
			return {:status => 'error', :data => 'Usuario no existe'}
		end

		return usuario.first()
	end

	def self.usuarios()
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		return mongo[:usuarios].find().to_a()
	end

end

