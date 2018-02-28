require 'sinatra'
require 'json'
require './database.rb'

set(:port, 5000)

post '/validar_login' do
	#todo crear sesion despues de validar login
	return Database.validar_login(params[:username], params[:password]).to_json()
end

post '/lista_manejar_usuarios' do
	#todo validar sesion antes de regresar lista
	return Database.lista_manejar_usuarios(params[:admin_username], params[:condominio]).to_json()
end
