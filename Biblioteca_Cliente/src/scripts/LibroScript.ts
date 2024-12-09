// src/Scripts/LibroScript.ts
import { getLibros, addLibro, updateLibro, deleteLibro } from '../Controlador/LibroLista';
import { Libro } from '../Entidades/Libros';

export const initPage = () => {
    console.log('Página de Libros cargada.');

    const librosTable = document.getElementById('libros-table') as HTMLTableElement;
    const crearLibroForm = document.getElementById('crearForm') as HTMLFormElement;
    const boton_add = document.getElementById('btn-add') as HTMLButtonElement;
    const boton_close = document.getElementById('btn-cancel') as HTMLButtonElement;
    const boton = document.getElementById('btn') as HTMLButtonElement;
    const boton_filtro = document.getElementById('btn-filtro') as HTMLButtonElement;
    const input_filtro = document.getElementById('filtro') as HTMLInputElement;
    const modal = document.getElementById('modal') as HTMLDivElement;
    const boton_close_2 = document.getElementById('btn-close') as HTMLButtonElement;

    const f_codigo = document.getElementById('codigo') as HTMLInputElement;
    const f_categoria = document.getElementById('categoria') as HTMLSelectElement;
    const f_editorial = document.getElementById('editorial') as HTMLInputElement;
    const f_nombre = document.getElementById('nombre') as HTMLInputElement;
    const f_autor = document.getElementById('autor') as HTMLInputElement;
    const f_anio_publicacion = document.getElementById('anio_publicacion') as HTMLInputElement;
    const f_tipo = document.getElementById('tipo') as HTMLSelectElement;

    let estadoBoton = 'Crear';

    async function displayLibros() {
        const tbody = librosTable.querySelector('tbody');
        const libros = await getLibros();
        tbody!.innerHTML = '';
        
        libros.forEach((libro: any) => { 
            if (libro.estado) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${libro.codigo}</td>
                    <td>${libro.categoria}</td>
                    <td>${libro.editorial}</td>
                    <td>${libro.nombre}</td>
                    <td>${libro.autor}</td>
                    <td>${libro.aniopublicacion || ''}</td> <!-- Nota aquí -->
                    <td>${libro.tipo}</td>
                    <td>${libro.disponible? "Disponible" : "Reservado"}</td>
                    <td>
                        <button class="editar">Editar</button>
                        <button class="eliminar">Eliminar</button>
                    </td>
                `;
                tbody!.appendChild(row);
            }
        });
    }
    

    async function mostrarForm() {
        resetForm();
        modal.style.display = 'flex';
    }

    async function ocultarForm() {
        resetForm();
        modal.style.display = 'none';
    }

    boton_close.addEventListener('click', ocultarForm);
    boton_add.addEventListener('click', mostrarForm);
    boton_close_2.addEventListener('click', ocultarForm);

    boton_filtro.addEventListener('click', async () => {
        const filtro = input_filtro.value.toLowerCase();
        const tbody = librosTable.querySelector('tbody');
        const libros = await getLibros();
        
        tbody!.innerHTML = '';
        libros.forEach((libro: any) => {
            if (libro.estado && 
                (libro.nombre.toLowerCase().includes(filtro) || 
                 libro.autor.toLowerCase().includes(filtro) ||libro.codigo.toLowerCase().includes(filtro))||libro.tipo.toLowerCase().includes(filtro)) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${libro.codigo}</td>
                    <td>${libro.categoria}</td>
                    <td>${libro.editorial}</td>
                    <td>${libro.nombre}</td>
                    <td>${libro.autor}</td>
                    <td>${libro.aniopublicacion || ''}</td> <!-- Nota aquí -->
                    <td>${libro.tipo}</td>
                    <td>${libro.disponible? "Disponible" : "Reservado"}</td>
                        <button class="editar">Editar</button>
                        <button class="eliminar">Eliminar</button>
                    </td>
                `;
                tbody!.appendChild(row);
            }
        });
    });
    crearLibroForm.addEventListener('submit', async (event: Event) => {
        event.preventDefault();
        console.log('Formulario enviado');
        console.log('Estado del botón:', estadoBoton);
    
        // Validaciones adicionales
        if (!f_codigo.value.trim()) {
            alert('El código es obligatorio');
            return;
        }
    
        if (!f_nombre.value.trim()) {
            alert('El nombre es obligatorio');
            return;
        }
    
        const libro = new Libro(
            f_codigo.value.trim(),
            f_categoria.value,
            f_editorial.value.trim(),
            f_nombre.value.trim(),
            f_autor.value.trim(),
            f_anio_publicacion.value ? parseInt(f_anio_publicacion.value) : new Date().getFullYear(),
            f_tipo.value
        );
    
        console.log('Datos del libro a enviar:', libro);
    
        try {
            if (estadoBoton === 'Crear') {
                await addLibro(libro);
            } else if (estadoBoton === 'Editar') {
                console.log('Intentando actualizar libro con código:', libro.codigo);
                await updateLibro(libro.codigo, libro);
            }
            
            await displayLibros();
            ocultarForm();
            
            // Reset form state
            estadoBoton = 'Crear';
            boton.textContent = 'Crear Libro';
        } catch (error) {
            console.error('Error en el submit:', error);
            alert('Hubo un error al guardar el libro');
        }
    });

    librosTable.addEventListener('click', async (event: Event) => {
        const target = event.target as HTMLElement;
        if (!target.closest('button')) return;
    
        const row = target.closest('tr');
        if (!row) return;
    
        const codigo = row.cells[0].textContent!;
    
        if (target.classList.contains('editar')) {
            try {
                const libro = {
                    codigo: row.cells[0].textContent!,
                    categoria: row.cells[1].textContent!,
                    editorial: row.cells[2].textContent!,
                    nombre: row.cells[3].textContent!,
                    autor: row.cells[4].textContent!,
                    anioPublicacion: parseInt(row.cells[5].textContent || '0'), 
                    tipo: row.cells[6].textContent!
                };
                
    
            console.log('Datos del libro a editar:', libro);
    
            // Asignación de valores con validación adicional
            f_codigo.value = libro.codigo || '';
            
            // Verificamos si el valor de categoría existe en las opciones
            const categoriaOptions = Array.from(f_categoria.options).map(option => option.value);
            f_categoria.value = categoriaOptions.includes(libro.categoria) 
                ? libro.categoria 
                : categoriaOptions[0];
    
            f_editorial.value = libro.editorial || '';
            f_nombre.value = libro.nombre || '';
            f_autor.value = libro.autor || '';
            
            // Manejamos el año de publicación
            f_anio_publicacion.value = libro.anioPublicacion > 0 
                ? libro.anioPublicacion.toString() 
                : ''; 
    
            // Verificamos si el valor de tipo existe en las opciones
            const tipoOptions = Array.from(f_tipo.options).map(option => option.value);
            f_tipo.value = tipoOptions.includes(libro.tipo.toLowerCase()) 
                ? libro.tipo.toLowerCase() 
                : tipoOptions[0];
    
            // Mostramos el modal
            modal.style.display = 'flex';
            modal.style.visibility = 'visible';
            modal.style.opacity = '1';
    
            estadoBoton = 'Editar';
            boton.textContent = 'Actualizar Libro';
    
            console.log('Valores asignados:', {
                codigo: f_codigo.value,
                categoria: f_categoria.value,
                editorial: f_editorial.value,
                nombre: f_nombre.value,
                autor: f_autor.value,
                anioPublicacion: parseInt(f_anio_publicacion.value),
                tipo: f_tipo.value
            });
            } catch (error) {
                console.error('Error al preparar edición:', error);
                alert('No se pudieron cargar los datos del libro');
            }
        } else if (target.classList.contains('eliminar')) {
            if (confirm('¿Está seguro de eliminar este libro?')) {
                try {
                    await deleteLibro(codigo);
                    await displayLibros();
                } catch (error) {
                    console.error('Error al eliminar libro:', error);
                    alert('No se pudo eliminar el libro');
                }
        }
    }
    
    });
    
    function resetForm() {
        f_codigo.value = '';
        f_categoria.value = '';
        f_editorial.value = '';
        f_nombre.value = '';
        f_autor.value = '';
        f_anio_publicacion.value = '';
        f_tipo.value = '';
        estadoBoton = 'Crear';
        boton.textContent = 'Crear Libro';
    }

    // Cargar libros al iniciar
    displayLibros();
};