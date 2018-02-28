require 'sinatra'
require 'json'
require './database.rb'

set(:port, 5000)

post '/validar_login' do
	return Database.validar_login(params[:username], params[:password]).to_json()
end
