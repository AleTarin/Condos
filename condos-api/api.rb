require 'sinatra'
require 'json'
require 'mail'
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

post '/correo_olvide_password' do
	password = Database.obtener_usuario(params[:username])[:password]

	username = params[:username]
	Mail.defaults do
		delivery_method :smtp, {
			:address => "smtp.gmail.com",
			:port => 587,
			:user_name => 'sbacdev@gmail.com',
			:password => 'sbacdevgmail',
			:authentication => :plain,
			:enable_starttls_auto => true
		}
	end

	mail = Mail.new do
	from	'sbacdev@gmail.com'
	to	username
	subject	'SBAC: Tu solicitudad de olvide contraseña'
	body	"Tu password para ingresar es: #{password}"
	end

	mail.deliver
	return {:status => 'ok', :data => 'Correo enviado exitosamente'}.to_json()
end

get '/usuarios' do
	return Database.usuarios().to_json()
end
