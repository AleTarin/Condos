require 'mongo'

module Database
	def self.validar_login(username, password)
		Mongo::Logger.logger.level = Logger::FATAL
		mongo = Mongo::Client.new([Socket.ip_address_list[1].inspect_sockaddr + ':27017'], :database => 'condominios')
		if mongo[:admins].find({:username => username, :password => password}).count() == 1
			return {:status => 'ok', :data => 'admin'}
		end
		usuario = mongo[:usuarios].find({:username => username, :password => password})
		if usuario.count() != 1
			return {:status => 'error', :data => 'Login invalido'}
		end
		tipos_de_usuario = mongo[:usuario_tiene_tipos].find({:username => username}).to_a()
		mongo.close()
	end
end
