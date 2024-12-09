// este archivo esta en Biblioteca/src/Entidades/Estudiantes.ts
export class Estudiante {
    cedula: string;
    nombre: string;
    apellido: string;
    sexo: string;
    fecha_nacimiento: Date;
    sancion_hasta: Date|null;
    estado: boolean;
    estadoActual: string;


    constructor(cedula: string, nombre: string, apellido: string, sexo: string, fecha_nacimiento: Date, sancion_hasta: Date|null, estado: boolean,estadoActual:string) {
        this.cedula = cedula;
        this.nombre = nombre;
        this.apellido = apellido;
        this.sexo = sexo;
        this.fecha_nacimiento = fecha_nacimiento;
        this.sancion_hasta = sancion_hasta;
        this.estado = estado;
        this.estadoActual=estadoActual;
    }
}