require 'mongo'

module Database
	def self.validar_login(username, password)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')

		if mongo[:admins].find({:username => username, :password => password}).count() == 1
			return 'super_admin'
		end

		if mongo[:usuarios].find({:username => username, :password => password}).count() != 1
			return false
		end

		data = {}

		if self.es_tipo(username, 'inquilino')
			data[:inquilino] = self.datos_login_inquilino(username)
		end

		if self.es_tipo(username, 'propietario')
			data[:propietario] = self.datos_login_propietario(username)
		end

		if self.es_tipo(username, 'admin')
			data[:admin] = self.datos_login_admin(username)
		end

		return data
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
		return mongo[:vive_en].find({:username => username}, projection: {condominio: 1, propiedad: 1, _id:0}).to_a()
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
			return 'no_es_admin'
		end

		if mongo[:administra_condominios].find({:username => username_admin, :condominio => nombre_condo}).count == 0
			return 'no_administra'
		end

		data = {}
		data[:usuarios] = []

		mongo[:vive_en].find({:condominio => nombre_condo}, projection: {username: 1, _id:0}).to_a().each do |elem|
			data[:usuarios].push(elem)
		end
		mongo[:administra_condominios].find({:condominio => nombre_condo}, projection: {username: 1, _id:0}).to_a().each do |elem|
			data[:usuarios].push(elem)
		end
		mongo[:propietario_de].find({:condominio => nombre_condo}, projection: {username: 1, _id:0}).to_a().each do |elem|
			data[:usuarios].push(elem)
		end

		data[:usuarios] = data[:usuarios].uniq
		return data
	end

	def self.obtener_usuario(username)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		usuario = mongo[:usuarios].find({username: username})
		if usuario.count() == 0
			return 'no_existe'
		end

		return usuario.first()
	end

	def self.usuarios()
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		return mongo[:usuarios].find({}, projection: {password: 0}).to_a()
	end

	def self.cambiar_password(username, password_nueva)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		mongo[:usuarios].update_one({:username => username}, {'$set' => {:password => password_nueva}})
	end

	def self.info_inquilino(username)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		# Regresar solamente username y numero de cuarto
		mongo.close()
		return mongo[:vive_en].find({:username => username}).to_a()
	end

	def self.info_propietario(username)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		mongo.close()
		return mongo[:propietario_de].find({:username => username}).to_a()
	end

	def self.info_admin(username)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		mongo.close()
		return mongo[:administra_condominios].find({:username => username}).to_a()
	end

<<<<<<< HEAD
<<<<<<< HEAD
	#---------
=======
	def self.actualizar_usuario(username, user)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		mongo[:usuarios].update_one({:username => username}, {'$set' => {:username => user[:username]}})
		mongo[:usuarios].update_one({:username => username}, {'$set' => {:password => user[:password]}})
	end
>>>>>>> Se agregaron los endpoints para ‘GET /usuarios/ username’ y PUT ’/usuario/ username user’.

=======
	#Recibe el mismo JSON del metodo /usuarios de api.rb
	def self.crear_usuario(usuario)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		if usuario[:admin].to_s != "false" && mongo[:condominios].find({:nombre => usuario[:admin]}).count() >= 1
			mongo[:usuario_tiene_tipos].insert_one({:username => usuario[:username], :tipo => 'admin'})
<<<<<<< HEAD
			mongo[:administra_condominios].insert_one({:username => usuario[:username], :condominio => username[:admin][:nombre_condo]})
=======
			mongo[:administra_condominios].insert_one({:username => usuario[:username], :condominio => usuario[:admin]})
>>>>>>> Cambiar endpoint para crear usuarios POST usuarios para utilizar campos reales, remover script de pruebas crear_usuario y agregar script post-usuario con api de mockaroo
		end
		if usuario[:propietario].to_s != "false" && mongo[:condominios].find({:nombre => usuario[:propietario]}).count() >= 1
			mongo[:usuario_tiene_tipos].insert_one({:username => usuario[:username], :tipo => 'propietario'})
<<<<<<< HEAD
			mongo[:propietario_de].insert_one({:username => usuario[:username], :condominio => username[:propietario][:nombre_condo]})
=======
			mongo[:propietario_de].insert_one({:username => usuario[:username], :condominio => usuario[:propietario]})
>>>>>>> Cambiar endpoint para crear usuarios POST usuarios para utilizar campos reales, remover script de pruebas crear_usuario y agregar script post-usuario con api de mockaroo
		end
		if usuario[:inquilino].to_s != "false" && mongo[:condominios].find({:nombre => usuario[:inquilino][:nombre_condo]}).count() >= 1
			mongo[:usuario_tiene_tipos].insert_one({:username => usuario[:username], :tipo => 'inquilino'})
			mongo[:vive_en].insert_one({:username => usuario[:username], :condominio => usuario[:inquilino][:nombre_condo], :propiedad => usuario[:inquilino][:propiedad]})
		end
		usuario.delete(:admin)
		usuario.delete(:propietario)
		usuario.delete(:inquilino)
		mongo[:usuarios].insert_one(usuario)
	end
<<<<<<< HEAD
>>>>>>> Crear directorio de pruebas para scripts de pruebas; Agregar endpoint para crear usuario POST /usuario user
end
=======

	def self.actualizar_usuario(username, user)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		mongo[:usuarios].update_one({:username => username}, {'$set' => {:username => user[:username]}})
		mongo[:usuarios].update_one({:username => username}, {'$set' => {:password => user[:password]}})
	end
>>>>>>> Marcar bug en endpoint put /usuarios; actualizar base de datos; agregar endpoint para borrar usuarios delete /usuarios/:username

	def self.borrar_usuario(username)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		borrado = {}
		borrado[:username] = username
		borrado[:password] = mongo[:usuarios].find({:username => username}).first()[:password]
		if self.es_tipo(username, 'admin')
			borrado[:administra_condominios] = mongo[:administra_condominios].find({:username => username}, projection: {condominio: 1, _id: 0}).to_a
			mongo[:administra_condominios].delete_one({:username => username})
		end
		if self.es_tipo(username, 'propietario')
			borrado[:propietario_de] = mongo[:propietario_de].find({:username => username}, projection: {condominio: 1, _id: 0}).to_a
			mongo[:propietario_de].delete_one({:username => username})
		end
		if self.es_tipo(username, 'inquilino')
			borrado[:vive_en] = mongo[:vive_en].find({:username => username}, projection: {_id: 0}).to_a
			mongo[:vive_en].delete_one({:username => username})
		end
		mongo[:borrados].insert_one(borrado)
		mongo[:usuarios].delete_one({:username => username})
		mongo[:usuario_tiene_tipos].delete_one({:username => username})
	end

	#Recibe el mismo json que endpoint POST /condominios
	def self.crear_condominio(condo)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		if mongo[:condominios].find({:nombre => condo[:nombre]}).count() >= 1
			return 'ya_existe'
		end
		mongo[:condominios].insert_one(condo)
	end

	def self.actualizar_condominio(condo)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		if mongo[:condominios].find({:nombre => condo[:nombre]}).count() == 0
			return 'no_existe'
		end
		mongo[:condominios].update_one({:nombre => condo[:nombre]}, {'$set' => condo})
	end

	def self.agregar_propiedades(nombre_condo, propiedades)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		propiedades.each do |prop|
			prop[:condominio] = nombre_condo
			if mongo[:propiedades].find({:condominio => nombre_condo, :identificador => prop[:identificador]}).count() == 0
				mongo[:propiedades].insert_one(prop)
			end
		end
	end

	def self.actualizar_propiedades(nombre_condo, propiedades)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		propiedades.each do |prop|
			prop[:condominio] = nombre_condo
			if mongo[:propiedades].find({:condominio => nombre_condo, :identificador => prop[:identificador]}).count() == 0
				next
			end
			mongo[:propiedades].update_one({:condominio => nombre_condo, :identificador => prop[:identificador]}, {'$set' => prop})
		end
	end
end
