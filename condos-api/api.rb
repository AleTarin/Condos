require 'sinatra'
require 'sinatra/cross_origin'
require 'json'
require 'mail'
require './database.rb'

set(:port, 5000)
enable :sessions


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

	session[:username] = params[:username]
	puts session[:username]
	return {:status => 'ok', :data => data}.to_json()
end

#Regresa la lista de todos los usuarios del condominio (inquilinos, propietarios y admins)
#Solo accesible para admins
#params: admin_username, nombre_condo
post '/lista_manejar_usuarios' do
	if session[:username] == nil
		return {:status => 'error', :data => 'No se ha iniciado sesion'}.to_json()
	end

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
	usuario = Database.obtener_usuario(params[:username])
	if usuario == 'no_existe'
		return {:status => 'error', :data => 'Usuario no existe'}.to_json()
	end
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
	body	"Tu password para ingresar es: #{usuario[:password]}"
	end

	mail.deliver
	return {:status => 'ok', :data => 'Correo enviado exitosamente'}.to_json()
end

#Regresa informacion del panel de inquilino
#params: username
post '/info_inquilino' do
	if session[:username] == nil
		return {:status => 'error', :data => 'No se ha iniciado sesion'}.to_json()
	end
	return Database.info_inquilino(params[:username]).to_json()
end

#Regresa informacion del panel de propietario
#params: username
post '/info_propietario' do
	if session[:username] == nil
		return {:status => 'error', :data => 'No se ha iniciado sesion'}.to_json()
	end
	return Database.info_propietario(params[:username]).to_json()
end

#Regresa informacion del panel de admin
#params: username
post '/info_admin' do
	if session[:username] == nil
		return {:status => 'error', :data => 'No se ha iniciado sesion'}.to_json()
	end
	return Database.info_admin(params[:username]).to_json()
end

#-----------

get '/usuarios' do
	puts session[:username]
	if session[:username] == nil
		return {:status => 'error', :data => 'No se ha iniciado sesion'}.to_json()
	end
	return Database.usuarios().to_json()
end

#Cambia la password de un usuario
#params: username, password_actual, password_nueva
post '/cambiar_password' do
	# if session[:username] == nil
	# 	return {:status => 'error', :data => 'No se ha iniciado sesion'}.to_json()
	# end
	if Database.obtener_usuario(params[:username])[:password] != params[:password_actual] 
		return {:status => 'error', :data => 'Password incorrecto'}
	end
	Database.cambiar_password(params[:username], params[:password_nueva])
	return {:status => 'ok', :data => 'Se cambio passwor exitosamente'}.to_json()
end

#Regresa el usuario que tenga el username ingresado
#params: username
get '/usuarios/:username' do
	if session[:username] == nil
		return {:status => 'error', :data => 'No se ha iniciado sesion'}.to_json()
	end
	return Database.obtener_usuario(params[:username]).to_json()
end

delete '/usuarios/:username' do
	#if session[:username] == nil
		#return {:status => 'error', :data => 'No se ha iniciado sesion'}.to_json()
	#end

	if Database.obtener_usuario(params[:username]) == 'no_existe'
		return {:status => 'error', :data => 'Usuario no existe'}.to_json()
	end

	Database.borrar_usuario(params[:username])

	return {:status => 'ok', :data => 'Usuario se borro exitosamente'}.to_json()
end

#Actualiza la informacion de username con la informacion de user
#params: username, user
#todo endpoint no funciona
put'/usuario/:username :user' do
	return params.to_json()
	params = JSON.parse(request.body.read.to_s, :symbolize_names => true)
	Database.actualizar_usuario(params[:username], params[:user])
end
