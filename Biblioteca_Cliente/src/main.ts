// Mapa de scripts asociados a cada página
const pageScripts: Record<string, () => Promise<any>> = {
    'Libros.html': () => import('./scripts/LibroScript'),
    'Estudiantes.html': () => import('./scripts/EstudianteScript'),
    'Prestamos.html': () => import('./scripts/PrestamoScript'),
    'Inicio.html': () => import('./scripts/InicioScript')
};

// Función para cargar una página y su script
const loadPageAndScript = async (page: string) => {
    try {
        // Actualizar la clase "active" del navbar
        document.querySelectorAll('#navbar a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });

        // Cargar el contenido HTML
        const response = await fetch(`/src/paginas/${page}`);
        if (!response.ok) {
            throw new Error(`No se pudo cargar la página: ${page}`);
        }
        const html = await response.text();
        const mainContainer = document.getElementById('main-container')!;
        mainContainer.innerHTML = html;

        // Cargar el script asociado
        const loadScript = pageScripts[page];
        if (loadScript) {
            const module = await loadScript();
            if (module.initPage) {
                await module.initPage();
            }
        }
    } catch (error) {
        console.error('Error al cargar la página:', error);
        const mainContainer = document.getElementById('main-container')!;
        mainContainer.innerHTML = `
            <div class="error-container">
                <h2>Error al cargar la página</h2>
                <p>Intente de nuevo más tarde.</p>
            </div>
        `;
    }
};

// Manejar clics en el navbar
document.getElementById('navbar')!.addEventListener('click', (event) => {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const link = target.closest('a');
    if (link) {
        const page = link.getAttribute('data-page');
        if (page) {
            loadPageAndScript(page);
        }
    }
});

// Cargar la página inicial (Inicio)
window.addEventListener('load', () => {
    loadPageAndScript('Inicio.html');
});
