// src/Controlador/LibrosLista.ts
import { Libro } from '../Entidades/Libros';

export async function getLibros() {
    try {
        const response = await fetch('http://localhost:3000/api/libros');
        if (!response.ok) {
            throw new Error('Error al obtener los libros');
        }
        const data = await response.json();
        console.log('Datos recibidos:', data); // <-- Aquí verificas lo que llega
        return data;
    } catch (error) {
        console.error('Error al obtener los libros:', error);
    }
}


export async function addLibro(libro: Libro) {
    try {
        const response = await fetch('http://localhost:3000/api/libros', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(libro),
        });

        if (!response.ok) {
            throw new Error('Error al agregar el libro');
        }
        alert('Libro agregado con éxito');
    } catch (error) {
        console.error('Error al agregar el libro:', error);
        alert('Error al agregar el libro');
    }
}

export async function updateLibro(codigo: string, libro: Libro) {
    try {
        const response = await fetch(`http://localhost:3000/api/libros/${codigo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(libro),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el libro');
        }

        alert('Libro actualizado con éxito');
    } catch (error) {
        console.error('Error al actualizar el libro:', error);
        alert('Error al actualizar el libro');
    }
}

export async function deleteLibro(codigo: string) {
    try {
        const response = await fetch(`http://localhost:3000/api/libros/${codigo}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el libro');
        }

        alert('Libro eliminado con éxito');
    } catch (error) {
        console.error('Error al eliminar el libro:', error);
        alert('Error al eliminar el libro');
    }
}
