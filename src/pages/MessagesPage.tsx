import { useState } from 'react';
import { Send, Smile, Plus } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  type: 'text' | 'audio';
}

const DEMO_MESSAGES: ChatMessage[] = [
  { id: '1', text: '¡Hola! ¿Ya hiciste la tarea de matemáticas?', sender: 'other', timestamp: '10:30', type: 'text' },
  { id: '2', text: 'Todavía no, voy a empezar ahorita. ¿Tú ya la terminaste?', sender: 'me', timestamp: '10:32', type: 'text' },
  { id: '3', text: '¡Sí! Si necesitas ayuda me dices 😊', sender: 'other', timestamp: '10:33', type: 'text' },
];

export function MessagesPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_MESSAGES);
  const [newMessage, setNewMessage] = useState('');

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    };

    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  }

  return (
    <div className="flex flex-col h-[calc(100vh-220px)]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end gap-2 max-w-[75%] ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                msg.sender === 'me' ? 'bg-blue-100' : 'bg-purple-100'
              }`}>
                <span className="text-xs">
                  {msg.sender === 'me' ? '👤' : '👩'}
                </span>
              </div>

              {/* Bubble */}
              <div className={`px-4 py-2.5 rounded-2xl ${
                msg.sender === 'me'
                  ? 'bg-blue-100 text-gray-800 rounded-br-md'
                  : 'bg-purple-100 text-gray-800 rounded-bl-md'
              }`}>
                <p className="text-sm">{msg.text}</p>
                <p className="text-[10px] text-gray-400 mt-1 text-right">{msg.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <form onSubmit={sendMessage} className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <button type="button" className="text-purple-400 hover:text-purple-600 transition-colors" aria-label="Emoji">
          <Smile size={22} />
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none text-sm"
        />
        <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Adjuntar">
          <Plus size={22} />
        </button>
        <button
          type="submit"
          className="w-9 h-9 rounded-full bg-pink-400 hover:bg-pink-500 flex items-center justify-center text-white transition-colors shadow-sm"
          aria-label="Enviar"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
