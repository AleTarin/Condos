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

=begin
Crea un usuario
params (json ejemplo):
{
	"username" : correo, es la llave primaria
	"password" : "admin",
	"nombre" : "Usuario",
	"paterno" : apellido paterno
	"materno" : apellido materno
	"rfc" : "XAX010101000",
	"aniversario" : fecha de nacimiento
	"tipo_persona" : persona fisica o moral
	"tel_movil" : "8181818181",
	"tel_directo" : "83838383",
	"calle" : "calle_usuario",
	"num_exterior" : "numext_usuario",
	"num_interior" : "numint_usuario",
	"colonia" : "colonia_usuario",
	"ciudad" : "ciudad_usuario",
	"localidad" : normalmente es lo mismo que ciudad
	"codigo_postal" : "66666",
	"estado" : "Nuevo Leon",
	"pais" : "Mexico",
	"metodo_pago" : "",
	"uso_cfdi" : "",
	"num_cuenta" : "",
	"clabe_cuenta" : "",
	"nombre_banco_cuenta" : "",
	"nombre_sat_cuenta" : "",
	"estatus" : activo, no_activo o bloquedao
	admin: nombre del condo que administra o false
	propietario: nombre del condo que administra o false
	inquilino: false o el siguiente json {
		nombre_condo:nombre del condo donde vive,
		propiedad: identificador de la propiedad donde vive
	}
}
=end
post '/usuarios' do
	params = JSON.parse(request.body.read.to_s, :symbolize_names => true)
	if Database.obtener_usuario(params[:username]) != 'no_existe'
		return {:status => 'error', :data => 'Este usuario ya existe'}.to_json()
	end
	Database.crear_usuario(params)
	return {:status => 'ok', :data => 'Usuario creado exitosamente'}.to_json()
end

#Regresa el usuario que tenga el username ingresado
#params: username
get '/usuarios/:username' do
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

=begin
Crea un condominio
params:
{
	"nombre" : "Residencial Balcones de la Loma",
	"razon_social" : "SA de CV",
	"tel_movil" : "8181818181",
	"tel_directo" : "83838383",
	"calle" : "calle_condo",
	"num_exterior" : "numext",
	"num_interior" : "numint",
	"colonia" : "colonia_condo",
	"ciudad" : "ciudad_condo",
	"localidad" : normalmente es lo mismo que ciudad,
	"codigo_postal" : "66666",
	"estado"
	"pais" : "Mexico",
	"imagen" : path a la imagen
	"estatus" : activo o no activo
	propiedades: [
		{
			"identificador" : "1-1",
			"indiviso" : "",
			"propietario" : "a00811931@gmail.com",
			"responsable" : "a00811931@gmail.com",
			"estatus" : ocupado, desocupado o no activo
		}
	]
}
=end
post '/condominios' do
	params = JSON.parse(request.body.read.to_s, :symbolize_names => true)
	propiedades = params.delete(:propiedades)
	if Database.crear_condominio(params) == 'ya_existe'
		return {:status => 'error', :data => 'Este condominio ya existe'}.to_json()
	end
	Database.agregar_propiedades(params[:nombre], propiedades)
	return {:status => 'ok', :data => 'Condominio creado exitosamente'}.to_json()
end

=begin
actualiza la informacion de un condo (no se tienen que enviar todos los campos ni de condo ni de propiedad)
{
	"nombre" : no se puede modificar el nombre del condo
	"razon_social" : "SA de CV",
	"tel_movil" : "8181818181",
	"tel_directo" : "83838383",
	"calle" : "calle_condo",
	"num_exterior" : "numext",
	"num_interior" : "numint",
	"colonia" : "colonia_condo",
	"ciudad" : "ciudad_condo",
	"localidad" : normalmente es lo mismo que ciudad,
	"codigo_postal" : "66666",
	"estado"
	"pais" : "Mexico",
	"imagen" : path a la imagen
	"estatus" : activo o no activo
	propiedades: [
		{
			"identificador" : no se puede modificar identificador de la propiedad
			"indiviso" : "",
			"propietario" : "a00811931@gmail.com",
			"responsable" : "a00811931@gmail.com",
			"estatus" : ocupado, desocupado o no activo
		}
	]
}
=end
patch '/condominios' do
	params = JSON.parse(request.body.read.to_s, :symbolize_names => true)
	propiedades = params.delete(:propiedades)
	Database.actualizar_condominio(params)
	Database.actualizar_propiedades(params[:nombre], propiedades)
	return {:estatus => 'ok', :data => 'Se actualizo condominio exitosamente'}.to_json()
end

# Borra un condoomio seleccionado.
# El borrado solo puede ser realizado por un Admin
# params: nombre_condo, username, password
#todo no funciona
delete '/condominios/:nombre_condo :username :password' do
	params = JSON.parse(request.body.read.to_s, :symbolize_names => true)
	if Database.obtener_usuario(params[:username]) == 'no_existe'
		return {:status => 'error', :data => 'Usuario no existe'}.to_json()
	end
	Database.borrar_condominio(params[:nombre_condo], params[:username], params[:password])
	return {:status => 'ok', :data => 'Condominio se borro exitosamente'}.to_json()
end

#Regresa una lista de todos los condominios
get '/condominios' do
	return Database.condominios().to_json()
end

#Regresa el condominio que tenga el username como dueno
#params: username
get '/condominios/:username' do
	return Database.obtener_condominios(params[:username]).to_json()
end

patch '/usuarios' do
	params = JSON.parse(request.body.read.to_s, :symbolize_names => true)
	Database.actualizar_usuario(params[:username], params)
	return {:estatus => 'ok', :data => 'Se actualizo el usuario exitosamente'}.to_json()
end
