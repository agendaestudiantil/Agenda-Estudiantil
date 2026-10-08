import { MessageCircle } from 'lucide-react';

export function MessagesPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 space-y-5">
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center shadow-sm">
        <MessageCircle size={36} className="text-emerald-600" strokeWidth={1.5} />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-gray-800">Mensajes</h1>
        <p className="text-sm text-gray-600 max-w-xs">
          Muy pronto podrás chatear con tus compañeros.
        </p>
        <p className="text-sm text-gray-500 max-w-xs">
          Esta función estará disponible próximamente.
        </p>
      </div>
    </div>
  );
}
