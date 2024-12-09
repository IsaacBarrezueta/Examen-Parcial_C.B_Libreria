// src/Entidades/Libros.ts
export class Libro {
    codigo: string;
    categoria: string;
    editorial: string;
    nombre: string;
    autor: string;
    anioPublicacion: number;
    tipo: string;
    disponible: boolean;
    estado: boolean;

    constructor(
        codigo: string,
        categoria: string,
        editorial: string,
        nombre: string,
        autor: string,
        anioPublicacion: number,
        tipo: string,
        disponible: boolean = true,
        estado: boolean = true
    ) {
        this.codigo = codigo;
        this.categoria = categoria;
        this.editorial = editorial;
        this.nombre = nombre;
        this.autor = autor;
        this.anioPublicacion = anioPublicacion;
        this.tipo = tipo;
        this.disponible = disponible;
        this.estado = estado;
    }
}
