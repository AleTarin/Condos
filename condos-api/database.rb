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
		return mongo[:administra_condominios].find({:username => username}).to_a()
		mongo.close()
	end

	def self.datos_login_inquilino(username)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		return mongo[:vive_en].find({:username => username}).to_a()
		mongo.close()
	end

	def self.datos_login_propietario(username)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		return mongo[:propietario_de].find({:username => username}).to_a()
		mongo.close()
	end
end

