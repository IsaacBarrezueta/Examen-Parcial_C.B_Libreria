import { Prestamo } from '../Entidades/Prestamo';

export async function getPrestamos(): Promise<Prestamo[]> {
    try {
        const response = await fetch('http://localhost:3000/api/prestamos');
        if (!response.ok) {
            throw new Error('Error al obtener los préstamos');
        }
        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error('Error al obtener los préstamos:', error.message);
        throw new Error(error.message || 'Error al obtener los préstamos');
    }
}

export async function addPrestamo(prestamo: {
    cedulaEstudiante: string;
    codigoLibro: string;
    fechaPrestamo: string;
    fechaEntrega: string;
}): Promise<void> {
    try {
        const response = await fetch('http://localhost:3000/api/prestamos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(prestamo),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    } catch (error: any) {
        console.error('Error al registrar el préstamo:', error.message);
        throw new Error(error.message || 'Error al registrar el préstamo');
    }
}


export async function registrarDevolucion(prestamoId: number, fechaDevolucion: Date): Promise<void> {
    try {
        const response = await fetch('http://localhost:3000/api/devoluciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prestamoId, fechaDevolucion }),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    } catch (error: any) {
        console.error('Error al registrar la devolución:', error.message);
        throw new Error(error.message || 'Error al registrar la devolución');
    }
}
