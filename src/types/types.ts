export interface Models {
    Persona: {
      idPersona: string;
      identificacion: string;
      nombre: string;
      apellido: string;
      telefono?: string;
      correo: string;
      contrasena: string;
      edad: number;
      Ficha?: string;
      Rol?: string;
      activo: boolean;
      fechaCreacion: Date;
      fechaActualización?: Date;
      rol?: Partial<Models["Rol"]>;
      ficha?: Partial<Models["Ficha"]>;
      encargos?: Partial<Models["Detalles"]>[];
      solicitudes?: Partial<Models["Detalles"]>[];
      aprobaciones?: Partial<Models["Detalles"]>[];
      movimiento?: Partial<Models["Movimiento"]>[];
    };
  
    Ficha: {
      idFicha: string;
      numFicha: number;
      cantidadAprendices?: number;
      activo: boolean;
      fechaCreacion: Date;
      fechaActualización?: Date;
      persona?: Partial<Models["Persona"]>[];
      titulado?: Partial<Models["Titulado"]>[];
    };
  
    Rol: {
      idRol: string;
      nombreRol: string;
      activo: boolean;
      fechaCreacion: Date;
      fechaActualización?: Date;
      persona?: Partial<Models["Persona"]>[];
    };
  
    Detalles: {
      idDetalle: string;
      Material?: string;
      cantidaSolicitada: number;
      descripcion?: string;
      PersonaEncargada?: string;
      PersonaSolicita?: string;
      PersonaAprueba?: string;
      activo: boolean;
      fechaCreacion: Date;
      fechaActualización?: Date;
      personaencargada?: Partial<Models["Persona"]>;
      personasolicita?: Partial<Models["Persona"]>;
      personaaprueba?: Partial<Models["Persona"]>;
    };
  
    Material: {
      idMaterial: string;
      TipoMaterial?: string;
      nombreMaterial: string;
      descripcion: string;
      stock: number;
      UnidadMedida?: string;
      CategoriaMaterial?: string;
      Caduca: boolean;
      activo: boolean;
      fechaVencimiento?: Date;
      fechaCreacion: Date;
      fechaActualización?: Date;
      tipoMaterial?: Partial<Models["TipoMaterial"]>;
      unidadMedida?: Partial<Models["UnidadMedida"]>;
      categoriaMaterial?: Partial<Models["CategoriaMaterial"]>;
    };
  
    TipoMaterial: {
      idTipoMaterial: string;
      Tipo: string;
      activo: boolean;
      fechaCreacion: Date;
      fechaActualización?: Date;
      material?: Partial<Models["Material"]>[];
    };
  
    UnidadMedida: {
      idUnidadMedida: string;
      unidadMedida: string;
      activo: boolean;
      fechaCreacion: Date;
      fechaActualización?: Date;
      material?: Partial<Models["Material"]>[];
    };
  
    CategoriaMaterial: {
      idCategoriaMaterial: string;
      códigoMaterial: string;
      categoria: string;
      activo: boolean;
      fechaCreacion: Date;
      fechaActualización?: Date;
      material?: Partial<Models["Material"]>[];
    };
  
    Sede: {
      idSede: string;
      sede: string;
      Centro?: string;
      Direccion: string;
      activo: boolean;
      fechaCreacion: Date;
      fechaActualización?: Date;
      centro?: Partial<Models["Centro"]>;
    };
  
    Centro: {
      idCentro: string;
      Centro: string;
      Municipio?: string;
      activo: boolean;
      fechaCreacion: Date;
      fechaActualización?: Date;
      municipio?: Partial<Models["Municipio"]>;
      areatocentro?: Partial<Models["AreaCentro"]>[];
      sede?: Partial<Models["Sede"]>[];
    };
  
    Municipio: {
      idMunicipio: string;
      municipio: string;
      activo: boolean;
      fechaCreacion: Date;
      fechaActualización?: Date;
      centro?: Partial<Models["Centro"]>[];
    };
  
    AreaCentro: {
      idAreaCentro: string;
      Centro?: string;
      Area?: string;
      activo: boolean;
      fechaCreacion: Date;
      fechaActualización?: Date;
      centro?: Partial<Models["Centro"]>;
      area?: Partial<Models["Area"]>;
    };
  
    Area: {
      idArea: string;
      Area: string;
      activo: boolean;
      fechaCreacion: Date;
      fechaActualización?: Date;
      areatocentro?: Partial<Models["AreaCentro"]>[];
      titulado?: Partial<Models["Titulado"]>[];
    };
  
    Titulado: {
      idTitulado: string;
      Titulado: string;
      Area?: string;
      Ficha?: string;
      activo: boolean;
      fechaCreacion: Date;
      fechaActualización?: Date;
      area?: Partial<Models["Area"]>;
      ficha?: Partial<Models["Ficha"]>;
    };
  
    Sitio: {
      idSitio: string;
      sitio: string;
      TipoSitio?: string;
      activo: boolean;
      fechaCreacion: Date;
      fechaActualización?: Date;
      tipositio?: Partial<Models["TipoSitio"]>;
    };
  
    TipoSitio: {
      idTipoSitio: string;
      TipoSitio: string;
      activo: boolean;
      fechaCreacion: Date;
      fechaActualización?: Date;
      sitio?: Partial<Models["Sitio"]>[];
    };
  
    Movimiento: {
      idMovimiento: string;
      TipoMovimiento?: string;
      MovimientoPersona?: string;
      activo: boolean;
      fechaCreacion: Date;
      fechaActualización?: Date;
      tipomovimiento?: Partial<Models["TipoMovimiento"]>;
      movimientopersona?: Partial<Models["Persona"]>;
    };
  
    TipoMovimiento: {
      idTipoMovimiento: string;
      tipoMovimiento: string;
      activo: boolean;
      fechaCreacion: Date;
      fechaActualización?: Date;
      movimiento?: Partial<Models["Movimiento"]>[];
    };
  }
  