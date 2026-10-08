import { Link } from 'react-router-dom';
import { ArrowLeft, CheckSquare, Flag, Bell, Target, Mail } from 'lucide-react';

export function HelpPage() {
  return (
    <div className="space-y-6">
      <Link to="/perfil" className="flex items-center gap-1 text-gray-500 hover:text-emerald-700">
        <ArrowLeft size={18} />
        <span className="text-sm">Volver al perfil</span>
      </Link>

      <h1 className="text-xl font-bold text-gray-800">Ayuda y Soporte</h1>

      <div className="card space-y-3">
        <div className="flex items-center gap-2 text-gray-800">
          <CheckSquare size={18} className="text-emerald-600" />
          <h2 className="font-semibold">Tareas</h2>
        </div>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          <li>Crear: ve a Agregar y elige "Nueva Tarea". Completa el título, la materia y la fecha.</li>
          <li>Editar: toca una tarea en la lista de Tareas para abrir el formulario y guardar los cambios.</li>
          <li>Eliminar: toca el ícono de papelera y confirma con "Sí".</li>
          <li>Estados: una tarea puede estar Pendiente, En progreso o Completada. Usa el botón de la tarjeta para pasarla a En progreso.</li>
        </ul>
      </div>

      <div className="card space-y-3">
        <div className="flex items-center gap-2 text-gray-800">
          <Flag size={18} className="text-emerald-600" />
          <h2 className="font-semibold">Prioridades</h2>
        </div>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          <li><span className="font-medium text-gray-700">Urgente:</span> necesita atención inmediata.</li>
          <li><span className="font-medium text-gray-700">Importante:</span> relevante, pero no inmediata.</li>
          <li><span className="font-medium text-gray-700">Tiempo:</span> puede esperar o planificarse con calma.</li>
        </ul>
      </div>

      <div className="card space-y-3">
        <div className="flex items-center gap-2 text-gray-800">
          <Bell size={18} className="text-emerald-600" />
          <h2 className="font-semibold">Recordatorios</h2>
        </div>
        <p className="text-sm text-gray-600">
          Crea un recordatorio desde Agregar con la fecha y hora deseada. En la sección Recordatorios de tu perfil
          puedes activarlos, desactivarlos o eliminarlos.
        </p>
      </div>

      <div className="card space-y-3">
        <div className="flex items-center gap-2 text-gray-800">
          <Target size={18} className="text-emerald-600" />
          <h2 className="font-semibold">Metas</h2>
        </div>
        <p className="text-sm text-gray-600">
          Define metas personales con una fecha objetivo. Avanza su progreso con los botones +10% y +25%; al llegar
          al 100% la meta se marca como completada.
        </p>
      </div>

      <div className="card space-y-2">
        <div className="flex items-center gap-2 text-gray-800">
          <Mail size={18} className="text-emerald-600" />
          <h2 className="font-semibold">Contacto</h2>
        </div>
        <p className="text-sm text-gray-600">
          ¿Necesitas ayuda? Escríbenos a{' '}
          <a
            href="mailto:agendaestudiantil2026@gmail.com"
            className="font-medium text-emerald-700 underline hover:text-emerald-800"
          >
            agendaestudiantil2026@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
