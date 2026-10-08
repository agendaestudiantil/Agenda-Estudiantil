import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, FileText } from 'lucide-react';
import { useTasks } from '@/context/TaskContext';

/** Formatea un `created_at` (ISO) como fecha local legible. Evita el off-by-one de UTC. */
function formatCreatedAt(createdAt: string): string {
  if (!createdAt) return '';
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function NotesPage() {
  const { notes, deleteNote } = useTasks();
  const navigate = useNavigate();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [exitingId, setExitingId] = useState<string | null>(null);

  function handleConfirmDelete(id: string) {
    setConfirmingId(null);
    setExitingId(id);
    window.setTimeout(() => {
      deleteNote(id);
      setExitingId(null);
    }, 250);
  }

  return (
    <div className="space-y-6">
      <Link to="/perfil" className="flex items-center gap-1 text-gray-500 hover:text-emerald-700">
        <ArrowLeft size={18} />
        <span className="text-sm">Volver al perfil</span>
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Mis Notas</h1>
        <button
          onClick={() => navigate('/agregar')}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Plus size={16} />
          Nueva nota
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="card text-center py-10 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
            <FileText size={28} className="text-emerald-600" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-gray-500">¡Aún no tienes notas. Crea tu primera nota!</p>
          <button
            onClick={() => navigate('/agregar')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            <Plus size={16} />
            Nueva nota
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`card space-y-2 transition-all duration-200 ${
                exitingId === note.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-gray-800">{note.title}</h3>
                {confirmingId === note.id ? (
                  <span className="flex items-center gap-1.5 text-xs shrink-0">
                    <span className="text-gray-500">¿Eliminar?</span>
                    <button
                      onClick={() => handleConfirmDelete(note.id)}
                      className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium hover:bg-red-200 transition-colors"
                    >
                      Sí
                    </button>
                    <button
                      onClick={() => setConfirmingId(null)}
                      className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium hover:bg-gray-200 transition-colors"
                    >
                      No
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirmingId(note.id)}
                    aria-label={`Eliminar "${note.title}"`}
                    className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 whitespace-pre-wrap">{note.content}</p>
              {formatCreatedAt(note.created_at) && (
                <p className="text-xs text-emerald-700 font-medium">{formatCreatedAt(note.created_at)}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
