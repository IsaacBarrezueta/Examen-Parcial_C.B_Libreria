export async function getEstudiantes() {
    try {
        const response = await fetch('http://localhost:3000/api/estudiantes');
        if (!response.ok) {
            throw new Error('Error al obtener los estudiantes');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los estudiantes:', error);
        return null;
    }
}

export async function addEstudiante(estudiante: any) {
    try {
        const response = await fetch('http://localhost:3000/api/estudiantes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cedula: estudiante.cedula,
                nombre: estudiante.nombre,
                apellido: estudiante.apellido,
                sexo: estudiante.sexo,
                fechaNacimiento: estudiante.fechaNacimiento
            }),
        });

        if (!response.ok) {
            throw new Error('Error al agregar el estudiante');
        }
        return true;
    } catch (error) {
        console.error('Error al agregar el estudiante:', error);
        throw error;
    }
}

export async function updateEstudiante(cedula: string, estudiante: any) {
    try {
        const response = await fetch(`http://localhost:3000/api/estudiantes/${cedula}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: estudiante.nombre,
                apellido: estudiante.apellido,
                sexo: estudiante.sexo,
                fechaNacimiento: estudiante.fechaNacimiento,
                estado: estudiante.estado
            }),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el estudiante');
        }
        return true;
    } catch (error) {
        console.error('Error al actualizar el estudiante:', error);
        throw error;
    }
}

export async function deleteEstudiante(cedula: string) {
    try {
        const response = await fetch(`http://localhost:3000/api/estudiantes/${cedula}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el estudiante');
        }
        return true;
    } catch (error) {
        console.error('Error al eliminar el estudiante:', error);
        throw error;
    }
}