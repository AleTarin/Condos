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
		return mongo[:administra_condominios].find({:username => username}, projection: {username: 1, condominio: 1, _id:0}).to_a()
	end

	def self.datos_login_inquilino(username)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		mongo.close()
		return mongo[:vive_en].find({:username => username}, projection: {username:1, condominio: 1, propiedad: 1, _id:0}).to_a()
	end

	def self.datos_login_propietario(username)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		mongo.close()
		return mongo[:propietario_de].find({:username => username}, projection: {username:1, condominio: 1, _id:0}).to_a()
	end

	def self.lista_manejar_usuarios(username_admin, nombre_condo)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')

		data = {}
		data[:admins] = []
		data[:propietarios_condo] = []
		data[:propietarios_propiedad] = []
		data[:responsables] = []

		mongo[:administra_condominios].find({:condominio => nombre_condo},projection: {_id: 0}).to_a().each do |elem|
			usuario = mongo[:usuarios].find({:username => elem[:username]},projection: {_id: 0}).first()
			data[:admins].push(usuario)
		end
		mongo[:propietario_de].find({:condominio => nombre_condo},projection: {_id: 0}).to_a().each do |elem|
			usuario = mongo[:usuarios].find({:username => elem[:username]},projection: {_id: 0}).first()
			data[:propietarios_condo].push(usuario)
		end
		mongo[:propiedades].find({:condominio => nombre_condo},projection: {_id: 0}).to_a().each do |elem|
			usuario = mongo[:usuarios].find({:propietario => elem[:username]},projection: {_id: 0}).first()
			data[:propietarios_propiedad].push(usuario)
		end
		mongo[:propiedades].find({:condominio => nombre_condo},projection: {_id: 0}).to_a().each do |elem|
			usuario = mongo[:usuarios].find({:responsable => elem[:username]},projection: {_id: 0}).first()
			data[:responsables].push(usuario)
		end
		
		data[:admins] = data[:admins].uniq
		data[:propietarios_condo] = data[:propietarios_condo].uniq
		data[:propietarios_propiedad] = data[:propietarios_propiedad].uniq
		data[:responsables] = data[:responsables].uniq
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
		return mongo[:usuarios].find({}).to_a()
	end

	def self.todoUsuarios()
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		return mongo[:usuarios].aggregate([mongo[:usuarios], mongo[:condominios]]).find({}).to_a()
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

	def self.actualizar_usuario(username, datos_nuevos)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		mongo[:usuarios].update_one({:username => username}, {'$set' => datos_nuevos})
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

	def self.agregar_admin(nombre_admin, nombre_condo)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		mongo[:administra_condominios].insert_one({:username => nombre_admin, :condominio => nombre_condo})
	end

	def self.actualizar_condominio(condo)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		if mongo[:condominios].find({:nombre => condo[:nombre]}).count() == 0
			return 'no_existe'
		end
		mongo[:condominios].update_one({:nombre => condo[:nombre]}, {'$set' => condo})
	end

	#Propiedades

	def self.existe_propiedad(id_propiedad)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		if mongo[:propiedades].find({:identificador => id_propiedad}).count() >= 1
			return true
		end
		return false
	end

	def self.propiedades(nombre_condo)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')

		listaPropiedades = mongo[:propiedades].find({condominio: nombre_condo}).to_a()
		if listaPropiedades.count() == 0
			return 'No tiene propiedades'
		end

		return listaPropiedades
	end

	def self.agregar_propiedades(nombre_condo, propiedades, usuario)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		if mongo[:condominios].find({:condominio => nombre_condo}).count() == 0
			if mongo[:propiedades].find({:condominio => nombre_condo, :identificador => propiedades}).count() == 0
				mongo[:propiedades].insert_one({
					:condominio => nombre_condo, 
					:identificador => propiedades, 
					:propietario => usuario,
					:responsable => usuario,
					:estatus => 'ocupado',
				})
				mongo[:vive_en].insert_one({
					:condominio => nombre_condo, 
					:propiedad => propiedades, 
					:username => usuario,
				})
				return "Propiedad creada"
			end
			return "La propiedad ya esta registrada"
		end 
		return "Condominio no existe"
	end

	def self.borrar_propiedades(id_propiedad)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		borrado = {}

		borrado[:vive_en] = mongo[:vive_en].find({:propiedad => id_propiedad}).to_a
		mongo[:vive_en].delete_many({:propiedad => id_propiedad})

		borrado[:propiedades] = mongo[:propiedades].find({:identificador => id_propiedad}).to_a
		mongo[:propiedades].delete_many({:identificador => id_propiedad})

		mongo[:borrados].insert_one(borrado)
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

	def self.borrar_condominio(nombre_condo)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		borrado = {}
		borrado[:condominio] = mongo[:condominios].find({:nombre => nombre_condo}).first()

		borrado[:administra_condominios] = mongo[:administra_condominios].find({:condominio => nombre_condo}).to_a
		mongo[:administra_condominios].delete_many({:condominio => nombre_condo})

		borrado[:propiedades] = mongo[:propiedades].find({:condominio => nombre_condo}).to_a
		mongo[:propiedades].delete_many({:condominio => nombre_condo})

		mongo[:borrados].insert_one(borrado)
		mongo[:condominios].delete_one({:nombre => nombre_condo})
	end

	def self.condominios()
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		return mongo[:condominios].find({}).to_a()
	end

	def self.todoCondominios()
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		return mongo[:condominios].aggregate([mongo[:condominios], mongo[:usuarios]]).find({}).to_a()
	end

	def self.obtener_condominios(username)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		condos = {}
		condos[:condominios] = []
		condos[:administra_condominios] = mongo[:administra_condominios].find({:username => username}, projection: {_id:0}).to_a()
		#condos[:propiedades_propietario] = mongo[:propiedades].find({:propietario => username}, projection: {_id:0}).to_a()
		#condos[:propiedades_responsable] = mongo[:propiedades].find({:responsable => username}, projection: {_id:0}).to_a()
		#condos[:condominios_propietario] = mongo[:propietario_de].find({:username => username}, projection: {_id:0}).to_a()
		condos[:administra_condominios].each do |elem|
			condos[:condominios].push(mongo[:condominios].find({:nombre => elem[:condominio]}, projection:{_id:0}).first())
		end
		#condos[:propiedades_propietario].each do |elem|
			#condos[:condominios].push(mongo[:condominios].find({:nombre => elem[:condominio]}, projection:{_id:0}).first())
		#end
		#condos[:propiedades_responsable].each do |elem|
			#condos[:condominios].push(mongo[:condominios].find({:nombre => elem[:condominio]}, projection:{_id:0}).first())
		#end
		#condos[:condominios_propietario].each do |elem|
			#condos[:condominios].push(mongo[:condominios].find({:nombre => elem[:condominio]}, projection:{_id:0}).first())
		#end
		#condos[:administra_condominios].each do |elem|
			#condos[:condominios].push(mongo[:condominios].find({:nombre => elem[:condominio]}, projection:{_id:0}).first())
		#end
		condos[:condominios] = condos[:condominios].uniq()
		return condos[:condominios]
	end

	def self.condominio_existe(nombre_condo)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		if mongo[:condominios].find({:nombre => nombre_condo}).count() >= 1
			return true
		end
		return false
	end


end
