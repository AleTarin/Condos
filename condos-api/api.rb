require 'sinatra'
require 'json'
require 'mail'
require './database.rb'

set(:port, 5000)

#Valida un intento de login
#params: username, password
post '/validar_login' do
	#todo crear sesion despues de validar login
	data = Database.validar_login(params[:username], params[:password])
	if data == 'super_admin'
		return {:status => 'ok', :data => 'super_admin'}.to_json()
	end

	if !data
		return {:status => 'error', :data => 'Login invalido'}.to_json()
	end

	return {:status => 'ok', :data => data}.to_json()
end

#Regresa la lista de todos los usuarios del condominio (inquilinos, propietarios y admins)
#Solo accesible para admins
#params: admin_username, nombre_condo
post '/lista_manejar_usuarios' do
	#todo validar sesion antes de regresar lista
	data = Database.lista_manejar_usuarios(params[:admin_username], params[:nombre_condo])

	if data == 'no_es_admin'
		return {:status => 'error', :data => 'Este usuario no es administrador'}.to_json()
	end

	if data == 'no_administra'
		return {:status => 'error', :data => 'Este usuario no administra este condominio'}.to_json()
	end

	return {:status => 'ok', :data => data}.to_json()
end

#Envia un correo a un usuario que haya olvidad su password
#params: username
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

#-----------

post '/info_inquilino' do
	return Database.info_inquilino(params[:username]).to_json()
end

post '/info_propietario' do
	return Database.info_propietario(params[:username]).to_json()
end

post '/info_admin' do
	return Database.info_admin(params[:username]).to_json()
end

#-----------

get '/usuarios' do
	#todo omitir password de resultados
	return Database.usuarios().to_json()
end

#Cambia la password de un usuario
#params: username, password_actual, password_nueva
post '/cambiar_password' do
	#todo validar que haya sesion
	if Database.obtener_usuario(params[:username])[:password] != params[:password_actual] 
		return {:status => 'error', :data => 'Password incorrecto'}
	end

	Database.cambiar_password(params[:username], params[:password_nueva])
	return {:status => 'ok', :data => 'Se cambio passwor exitosamente'}.to_json()
end
