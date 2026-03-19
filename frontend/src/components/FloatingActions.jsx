import { Calendar, MessageCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function FloatingActions({ onAbrirReserva }) {
  const [visible, setVisible] = useState(false);
  const [cerrado, setCerrado] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (cerrado || !visible) return null;

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 animate-fade-in flex flex-col items-end gap-3">
      <button onClick={() => setCerrado(true)}
        className="bg-white/90 text-slate-300 hover:text-slate-500 p-1.5 rounded-full shadow-organic-sm backdrop-blur-sm border border-slate-200 transition-colors cursor-pointer mr-1"
        aria-label="Cerrar botones flotantes"><X size={14} /></button>
      <div className="flex flex-col gap-3">
        <button onClick={onAbrirReserva}
          className="group relative btn-magnetic flex items-center justify-center p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-4xl shadow-organic-lg transition-all"
          aria-label="Agendar Examen Visual">
          <Calendar size={22} />
          <span className="absolute right-full mr-4 bg-emerald-950 text-white text-sm font-bold px-3 py-1.5 rounded-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block font-data">
            Reservar Hora<span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-emerald-950 rotate-45"></span>
          </span>
        </button>
        <button onClick={() => window.open('https://wa.me/56991762935?text=Hola', '_blank')}
          className="group relative btn-magnetic flex items-center justify-center p-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-4xl shadow-organic-lg transition-all"
          aria-label="Consultar por WhatsApp">
          <MessageCircle size={22} />
          <span className="absolute right-full mr-4 bg-emerald-950 text-white text-sm font-bold px-3 py-1.5 rounded-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block font-data">
            WhatsApp<span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-emerald-950 rotate-45"></span>
          </span>
        </button>
      </div>
    </div>
  );
}
