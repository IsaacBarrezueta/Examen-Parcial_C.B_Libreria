import { getEstudiantes, addEstudiante, updateEstudiante, deleteEstudiante } from '../Controlador/EstudianteLista';
import { Estudiante } from '../Entidades/Estudiantes';

export const initPage = () => {
    // Elementos del DOM
    const estudiantesTable = document.getElementById('estudiantes-table') as HTMLTableElement;
    const crearEstudianteForm = document.getElementById('crearForm') as HTMLFormElement;
    const btnAdd = document.getElementById('btn-add') as HTMLButtonElement;
    const btnCancel = document.getElementById('btn-cancel') as HTMLButtonElement;
    const btnSave = document.getElementById('btn') as HTMLButtonElement;
    const modal = document.getElementById('modal') as HTMLDivElement;
    const btnClose = document.getElementById('btn-close') as HTMLButtonElement;
    
    // Elementos para filtros
    const inputFiltro = document.getElementById('filtro') as HTMLInputElement;
    const selectFiltroTipo = document.getElementById('filtroTipo') as HTMLSelectElement;
    const btnFiltro = document.getElementById('btn-filtro') as HTMLButtonElement;
    const btnLimpiarFiltro = document.getElementById('btn-limpiar-filtro') as HTMLButtonElement;

    // Campos del formulario
    const inputCedula = document.getElementById('cedula') as HTMLInputElement;
    const inputNombre = document.getElementById('nombre') as HTMLInputElement;
    const inputApellido = document.getElementById('apellido') as HTMLInputElement;
    const selectSexo = document.getElementById('sexo') as HTMLSelectElement;
    const inputFechaNacimiento = document.getElementById('fecha_nacimiento') as HTMLInputElement;

    let modoEdicion = false;
    let cedulaEdicion = '';
    let estudiantesCache: any[] = []; // Cache para filtrado en cliente

    async function displayEstudiantes(estudiantes?: any[]) {
        const tbody = estudiantesTable.querySelector('tbody')!;
        
        if (!estudiantes) {
            try {
                const response = await getEstudiantes();
                if (!response) {
                    console.error('No se pudieron obtener los estudiantes');
                    tbody.innerHTML = '<tr><td colspan="8">No hay estudiantes disponibles</td></tr>';
                    return;
                }
                estudiantesCache = response; // Guardar en cache
                estudiantes = response.filter((estudiante: any) => estudiante.estado === true);
            } catch (error) {
                console.error('Error al obtener estudiantes:', error);
                tbody.innerHTML = '<tr><td colspan="8">Error al cargar estudiantes</td></tr>';
                return;
            }
        }
    
        // Verificación adicional para asegurar que estudiantes no es undefined
        if (!estudiantes || estudiantes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8">No hay estudiantes disponibles</td></tr>';
            return;
        }
    
        tbody.innerHTML = '';
        estudiantes.forEach((estudiante: any) => {
            const row = document.createElement('tr');
            const fechaNacimiento = new Date(estudiante.fechanacimiento);
            const sancionHasta = estudiante.sancionadohasta ? new Date(estudiante.sancionadohasta) : null;
            
            row.innerHTML = `
                <td>${estudiante.cedula}</td>
                <td>${estudiante.nombre}</td>
                <td>${estudiante.apellido}</td>
                <td>${estudiante.sexo}</td>
                <td>${fechaNacimiento.toLocaleDateString('es-ES')}</td>
                <td>${sancionHasta ? `Sancionado hasta: ${sancionHasta.toLocaleDateString('es-ES')}` : 'Sin sanción'}</td>
                <td>${estudiante.estadoactual || 'Libre'}</td>
                <td>
                    <button class="editar">Editar</button>
                    <button class="eliminar">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Función para filtrar estudiantes mejorada
    function filtrarEstudiantes() {
        const filtroValor = inputFiltro.value.trim().toLowerCase();
        const filtroTipo = selectFiltroTipo.value;

        if (!filtroValor) {
            displayEstudiantes(estudiantesCache);
            return;
        }

        const estudiantesFiltrados = estudiantesCache.filter(estudiante => {
            // Normalización de valores para comparación
            const valorCedula = estudiante.cedula?.toString().toLowerCase();
            const valorNombre = estudiante.nombre?.toLowerCase();
            const valorApellido = estudiante.apellido?.toLowerCase();
            const valorSexo = estudiante.sexo?.toLowerCase();
            const valorEstado = estudiante.estadoactual?.toLowerCase();

            // Manejo seguro de valores nulos o indefinidos
            switch (filtroTipo) {
                case 'cedula':
                    return valorCedula ? valorCedula.includes(filtroValor) : false;
                case 'nombre':
                    return valorNombre ? valorNombre.includes(filtroValor) : false;
                case 'apellido':
                    return valorApellido ? valorApellido.includes(filtroValor) : false;
                case 'sexo':
                    // Añadido soporte para variaciones de escritura de sexo
                    const sexoNormalizado = filtroValor === 'femenino' ? 'f' : 
                                            filtroValor === 'masculino' ? 'm' : 
                                            filtroValor;
                    return valorSexo ? valorSexo.includes(sexoNormalizado) : false;
                case 'estado':
                    return valorEstado ? valorEstado.includes(filtroValor) : false;
                case 'todos':
                    return (
                        (valorCedula && valorCedula.includes(filtroValor)) ||
                        (valorNombre && valorNombre.includes(filtroValor)) ||
                        (valorApellido && valorApellido.includes(filtroValor)) ||
                        (valorSexo && valorSexo.includes(filtroValor)) ||
                        (valorEstado && valorEstado.includes(filtroValor))
                    );
                default:
                    return false;
            }
        });

        displayEstudiantes(estudiantesFiltrados);
    }

    // Inicializar select de tipo de filtro
    function inicializarFiltros() {
        selectFiltroTipo.innerHTML = `
            <option value="todos">Todos los campos</option>
            <option value="cedula">Cédula</option>
            <option value="nombre">Nombre</option>
            <option value="apellido">Apellido</option>
            <option value="sexo">Sexo</option>
            <option value="estado">Estado</option>
        `;
    }
    // Limpiar filtros
    function limpiarFiltros() {
        inputFiltro.value = '';
        selectFiltroTipo.value = 'todos';
        displayEstudiantes(estudiantesCache);
    }

    // Event Listeners para filtros
    btnFiltro.addEventListener('click', filtrarEstudiantes);
    btnLimpiarFiltro.addEventListener('click', limpiarFiltros);
    
    // Filtrado en tiempo real (opcional)
    inputFiltro.addEventListener('input', () => {
        // Añadir un pequeño delay para evitar muchas actualizaciones
        clearTimeout(inputFiltro.dataset.timeoutId as any);
        inputFiltro.dataset.timeoutId = setTimeout(filtrarEstudiantes, 300).toString();
    });

    // Inicializar componentes
    inicializarFiltros();


    function resetForm() {
        crearEstudianteForm.reset();
        modoEdicion = false;
        cedulaEdicion = '';
        btnSave.textContent = 'Registrar Estudiante';
        inputCedula.disabled = false;
    }

    function mostrarModal() {
        modal.style.display = 'flex';
        resetForm();
    }

    function ocultarModal() {
        modal.style.display = 'none';
        resetForm();
    }

    // Event Listeners
    btnAdd.addEventListener('click', mostrarModal);
    btnCancel.addEventListener('click', ocultarModal);
    btnClose.addEventListener('click', ocultarModal);

    crearEstudianteForm.addEventListener('submit', async (e: Event) => {
        e.preventDefault();
    
        try {
            const fechaNacimiento = new Date(inputFechaNacimiento.value);
            if (isNaN(fechaNacimiento.getTime())) {
                throw new Error('Fecha de nacimiento inválida');
            }
    
            const estudiante = {
                cedula: inputCedula.value,
                nombre: inputNombre.value,
                apellido: inputApellido.value,
                sexo: selectSexo.value,
                fechaNacimiento: fechaNacimiento.toISOString().split('T')[0],
                estado: true,
                estadoActual: 'Libre'
            };
    
            if (modoEdicion) {
                await updateEstudiante(cedulaEdicion, estudiante);
            } else {
                await addEstudiante(estudiante);
            }
            ocultarModal();
            await displayEstudiantes();
        } catch (error) {
            console.error('Error al procesar el estudiante:', error);
            alert('Error al procesar el estudiante. Por favor, verifique los datos.');
        }
    });

    estudiantesTable.addEventListener('click', async (event) => {
        const target = event.target as HTMLElement;
        if (!target.matches('button')) return;

        const row = target.closest('tr');
        if (!row) return;

        const cedula = row.cells[0].textContent!;

        if (target.classList.contains('editar')) {
            const estudiantes = await getEstudiantes();
            const estudiante = estudiantes.find((e: any) => e.cedula === cedula);
            
            if (estudiante) {
                inputCedula.value = estudiante.cedula;
                inputNombre.value = estudiante.nombre;
                inputApellido.value = estudiante.apellido;
                selectSexo.value = estudiante.sexo;
                
                const fecha = new Date(estudiante.fechanacimiento);
                if (!isNaN(fecha.getTime())) {
                    inputFechaNacimiento.value = fecha.toISOString().split('T')[0];
                }
        
                modoEdicion = true;
                cedulaEdicion = estudiante.cedula;
                inputCedula.disabled = true;
                btnSave.textContent = 'Actualizar Estudiante';
                modal.style.display = 'flex';
            }
        } else if (target.classList.contains('eliminar')) {
            if (confirm('¿Está seguro de eliminar este estudiante?')) {
                await deleteEstudiante(cedula);
                await displayEstudiantes();
            }
        }
    });

    // Cargar estudiantes al iniciar
    displayEstudiantes();
};