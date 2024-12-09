export class Prestamo {
    id: number; 
    cedula_estudiante: string;
    codigo_libro: string;
    fecha_prestamo: Date;
    fecha_entrega: Date;
    devuelto: boolean; 
    fecha_devolucion: Date | null;

    constructor(
        id: number,
        cedula_estudiante: string,
        codigo_libro: string,
        fecha_prestamo: Date,
        fecha_entrega: Date,
        devuelto: boolean,
        fecha_devolucion: Date | null
    ) {
        this.id = id;
        this.cedula_estudiante = cedula_estudiante;
        this.codigo_libro = codigo_libro;
        this.fecha_prestamo = fecha_prestamo;
        this.fecha_entrega = fecha_entrega;
        this.devuelto = devuelto;
        this.fecha_devolucion = fecha_devolucion;
    }
}
