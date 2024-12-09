import { getPrestamos, addPrestamo, registrarDevolucion } from '../Controlador/PrestamoLista';
import { getEstudiantes } from '../Controlador/EstudianteLista';
import { getLibros } from '../Controlador/LibroLista';
import { Prestamo } from '../Entidades/Prestamo';
import { Estudiante } from '../Entidades/Estudiantes';
import { Libro } from '../Entidades/Libros';

export const initPage = async () => {
    console.log('Página de Préstamos cargada.');

    const prestamosTable = document.getElementById('prestamos-table') as HTMLTableElement;
    const crearPrestamoForm = document.getElementById('form-prestamo') as HTMLFormElement;
    const devolverPrestamoForm = document.getElementById('form-devolucion') as HTMLFormElement;

    const modalDevolverPrestamo = document.getElementById('modal-devolver-prestamo') as HTMLDivElement;
    const modalCrearPrestamo = document.getElementById('modal-crear-prestamo') as HTMLDivElement;

    const selectEstudiantes = document.getElementById('cedulaEstudiante') as HTMLSelectElement;
    const selectLibros = document.getElementById('codigoLibro') as HTMLSelectElement;

    const btnAbrirModal = document.getElementById('btn-agregar-prestamo') as HTMLButtonElement;
    const btnCerrarModal = document.getElementById('btn-cerrar-modal-crear') as HTMLButtonElement;

    const btnCerrarModalDevolver = document.getElementById('btn-cerrar-modal-devolver') as HTMLButtonElement;

    // **Eventos para abrir y cerrar el modal de registrar préstamo**
    btnAbrirModal.addEventListener('click', () => {
        console.log('Abrir modal de registrar préstamo');
        modalCrearPrestamo.style.display = 'flex'; // Mostrar modal
    });

    btnCerrarModal.addEventListener('click', () => {
        console.log('Cerrar modal de registrar préstamo');
        modalCrearPrestamo.style.display = 'none'; // Ocultar modal
        crearPrestamoForm.reset(); // Limpiar el formulario
    });

    btnCerrarModalDevolver.addEventListener('click', () => {
        console.log('Cerrar modal de devolución');
        modalDevolverPrestamo.style.display = 'none'; // Ocultar modal
        devolverPrestamoForm.reset(); // Limpiar el formulario
    });

    // **Mostrar lista de préstamos**
    async function mostrarPrestamos() {
        try {
            const prestamosApi = await getPrestamos();
            console.log('Datos originales de la API:', prestamosApi);
    
            const prestamos = prestamosApi.map((p: any) => new Prestamo(
                p.id, // Confirma que el atributo devuelto por la API es `id`
                p.cedula_estudiante,
                p.codigo_libro,
                new Date(p.fecha_prestamo),
                new Date(p.fecha_entrega),
                p.devuelto,
                p.fecha_devolucion ? new Date(p.fecha_devolucion) : null
            ));
    
            const tbody = prestamosTable.querySelector('tbody')!;
            tbody.innerHTML = ''; // Limpiar tabla
    
            prestamos.forEach((prestamo) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${prestamo.id}</td>
                    <td>${prestamo.cedula_estudiante}</td>
                    <td>${prestamo.codigo_libro}</td>
                    <td>${prestamo.fecha_prestamo.toLocaleDateString()}</td>
                    <td>${prestamo.fecha_entrega.toLocaleDateString()}</td>
                    <td>${prestamo.devuelto ? 'Sí' : 'No'}</td>
                    <td>${prestamo.fecha_devolucion ? prestamo.fecha_devolucion.toLocaleDateString() : 'Pendiente'}</td>
                    <td>
                        ${
                            !prestamo.devuelto
                                ? `<button class="btn-devolver" data-id="${prestamo.id}">Devolver</button>`
                                : ''
                        }
                    </td>
                `;
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al mostrar préstamos:', error);
        }
    }
    

    // **Cargar selects de estudiantes y libros**
    async function cargarSelects() {
        try {
            const estudiantes = await getEstudiantes();
            estudiantes.forEach((estudiante: Estudiante) => {
                const option = document.createElement('option');
                option.value = estudiante.cedula;
                option.textContent = `${estudiante.nombre} ${estudiante.apellido}`;
                selectEstudiantes.appendChild(option);
            });

            const libros = await getLibros();
            libros.forEach((libro: Libro) => {
                const option = document.createElement('option');
                option.value = libro.codigo;
                option.textContent = libro.nombre;
                selectLibros.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar estudiantes o libros:', error);
        }
    }

    // **Evento para registrar préstamo**
    crearPrestamoForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const prestamo = {
            cedulaEstudiante: selectEstudiantes.value,
            codigoLibro: selectLibros.value,
            fechaPrestamo: (document.getElementById('fechaPrestamo') as HTMLInputElement).value,
            fechaEntrega: (document.getElementById('fechaEntrega') as HTMLInputElement).value,
        };

        console.log('Datos enviados al servidor:', prestamo);

        try {
            await addPrestamo(prestamo);
            alert('Préstamo registrado con éxito.');
            modalCrearPrestamo.style.display = 'none'; // Ocultar modal
            crearPrestamoForm.reset(); // Limpiar formulario
            mostrarPrestamos(); // Refrescar tabla
        } catch (error) {
            console.error('Error al registrar el préstamo:', error);
            alert('Hubo un error al registrar el préstamo.');
        }
    });

    // **Evento para devolver préstamo**
    // Manejar el envío del formulario para devolver préstamos
devolverPrestamoForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const prestamoId = parseInt((document.getElementById('prestamoId') as HTMLInputElement).value);
    const fechaDevolucion = (document.getElementById('fechaDevolucion') as HTMLInputElement).value;

    try {
        console.log('Datos para devolución:', { prestamoId, fechaDevolucion });

        await registrarDevolucion(prestamoId, new Date(fechaDevolucion));
        alert('Devolución registrada con éxito.');
        modalDevolverPrestamo.style.display = 'none'; // Ocultar el modal de devolución
        mostrarPrestamos(); // Actualizar la lista de préstamos
    } catch (error) {
        console.error('Error al registrar la devolución:', error);
        alert('Hubo un error al registrar la devolución.');
    }
});

// Evento para devolver préstamos desde la tabla
prestamosTable.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    if (target.classList.contains('btn-devolver')) {
        const prestamoId = target.getAttribute('data-id'); // Obtenemos el data-id

        if (!prestamoId) {
            console.error('El atributo data-id no está definido para el botón "Devolver".');
            alert('No se pudo identificar el préstamo.');
            return;
        }

        console.log('Abrir modal para devolver el préstamo con ID:', prestamoId);

        // Asignar el ID en el campo del formulario de devolución
        (document.getElementById('prestamoId') as HTMLInputElement).value = prestamoId;

        // Mostrar el modal de devolución
        modalDevolverPrestamo.style.display = 'flex';
    }
});


    // **Inicializar la página**
    await cargarSelects();
    await mostrarPrestamos();
};
