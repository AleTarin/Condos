export class User {
    public confirm?: string;
    constructor(
        public  username?: string,
        public  password?: string,
        public  nombre?: string,
        public  paterno?: string,
        public materno?: string,
        public  rfc?: string,
        public  aniversario?: string,
        public  tipo_persona?: string,
        public  tel_movil?: string,
        public  tel_directo?: string,
        public  calle?: string,
        public   num_exterior?: string,
        public  num_interior?: string,
        public  colonia?: string,
        public  ciudad?: string,
        public   localidad?: string,
        public  codigo_postal?: string,
        public  estado?: string,
        public  pais?: string,
        public  metodo_pago?: string,
        public uso_cfdi?: string,
        public num_cuenta?: string,
        public clabe_cuenta?: string,
        public  nombre_banco_cuenta?: string,
        public nombre_sat_cuenta?: string,
        public estatus?: string,
        public admin?: any,
        public propietario?: any,
        public inquilino?: any
    ) { }
}

