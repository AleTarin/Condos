export class Condo {
    constructor(
        public nombre?: string,
        public razon_social?: string,
        public tel_movil?: string,
        public tel_directo?: string,
        public calle?: string,
        public num_exterior?: string,
        public num_interior?: string,
        public colonia?: string,
        public localidad?: string,
        public codigo_postal?: string,
        public estado?: string,
        public pais?: string,
        public imagen?: string,
        public estatus?: string,
        public propiedades?: Propiedad[]
    ) {}
}

export class Propiedad {
    constructor (
        public identificador?: string,
        public indiviso?: string,
        public propietario?: string,
        public responsable?: string,
        public estatus?: string
    ) {}
}
