require 'sinatra'
require 'json'
require './database.rb'

set(:port, 5000)

#Valida un intento de login
#params: username, password
post '/validar_login' do
	#todo crear sesion despues de validar login
	return Database.validar_login(params[:username], params[:password]).to_json()
end

#Regresa la lista de todos los usuarios del condominio (inquilinos, propietarios y admins)
#Solo accesible para admins
#params: admin_username, nombre_condo
post '/lista_manejar_usuarios' do
	#todo validar sesion antes de regresar lista
	return Database.lista_manejar_usuarios(params[:admin_username], params[:nombre_condo]).to_json()
end
