import { getLibros } from '../Controlador/LibroLista';
import { getEstudiantes } from '../Controlador/EstudianteLista';
import { getPrestamos } from '../Controlador/PrestamoLista';
import { jsPDF } from "jspdf";

export const initPage = async () => {
    console.log('Cargando el dashboard...');

    try {
        // Cargar datos desde tus APIs
        const libros = await getLibros();
        const estudiantes = await getEstudiantes();
        const prestamos = await getPrestamos();

        // Calcular estadísticas
        const prestamosActivos = prestamos.filter(p => !p.devuelto).length;
        const prestamosVencidos = prestamos.filter(p => {
            const hoy = new Date();
            return !p.devuelto && new Date(p.fecha_entrega) < hoy;
        }).length;

        // Actualizar estadísticas en el DOM
        document.querySelector('#libros-total .stat-number')!.textContent = libros.length.toString();
        document.querySelector('#estudiantes-total .stat-number')!.textContent = estudiantes.length.toString();
        document.querySelector('#prestamos-activos .stat-number')!.textContent = prestamosActivos.toString();
        document.querySelector('#prestamos-vencidos .stat-number')!.textContent = prestamosVencidos.toString();

        // Manejar clic en el botón de reporte
        document.getElementById('btn-reporte')?.addEventListener('click', () => {
            generarReporte(libros.length, estudiantes.length, prestamosActivos, prestamosVencidos);
        });
    } catch (error) {
        console.error('Error cargando el dashboard:', error);
        document.querySelectorAll('.stat-number').forEach(stat => {
            stat.textContent = 'Error';
        });
    }
};

// Generar reporte en PDF con jsPDF
function generarReporte(
    totalLibros: number,
    totalEstudiantes: number,
    prestamosActivos: number,
    prestamosVencidos: number
) {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(20);
    doc.text('Reporte de Biblioteca', 105, 20, { align: 'center' });

    // Espaciado inicial
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 30);

    // Contenido del reporte
    doc.text(`Total de Libros: ${totalLibros}`, 10, 40);
    doc.text(`Total de Estudiantes: ${totalEstudiantes}`, 10, 50);
    doc.text(`Préstamos Activos: ${prestamosActivos}`, 10, 60);
    doc.text(`Préstamos Vencidos: ${prestamosVencidos}`, 10, 70);

    // Guardar el archivo PDF
    doc.save('reporte-biblioteca.pdf');
}
