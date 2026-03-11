import { useState } from 'react';
import { MessageCircle, X, MapPin } from 'lucide-react';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const sucursales = [
    { nombre: "Viña del Mar", numero: "56991762935", mensaje: "Hola, vengo de la pagina y tengo una consulta" },
    { nombre: "Quilpué", numero: "56974408675", mensaje: "Hola, vengo de la pagina y tengo una consulta" },
    { nombre: "La Calera", numero: "56967068446", mensaje: "Hola, vengo de la pagina y tengo una consulta" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <button onClick={() => setIsOpen(!isOpen)}
        className="btn-magnetic bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-4xl shadow-organic-lg transition-all flex items-center justify-center relative z-10"
        aria-label="Chatear por WhatsApp">
        {isOpen ? <X size={28} /> : (
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
          </svg>
        )}
      </button>

      {!isOpen && (
        <div className="absolute right-full mr-4 bottom-3 bg-white text-slate-800 px-4 py-2 rounded-4xl rounded-br-none shadow-organic-md text-sm font-bold animate-bounce whitespace-nowrap border border-slate-200 pointer-events-none hidden md:block">
          ¡Escríbenos! 👋
        </div>
      )}

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-72 bg-white rounded-4xl shadow-organic-xl border border-slate-200 overflow-hidden animate-fade-in origin-bottom-right">
          <div className="bg-emerald-700 text-white p-4 rounded-t-4xl">
            <h3 className="font-heading font-bold text-lg mb-1 flex items-center gap-2"><MessageCircle size={18} /> Chat por Sucursal</h3>
            <p className="text-sm text-emerald-100/70 leading-tight font-light">Selecciona tu sucursal más cercana.</p>
          </div>
          <div className="p-2 space-y-1">
            {sucursales.map((suc, idx) => (
              <a key={idx} href={`https://wa.me/${suc.numero}?text=${encodeURIComponent(suc.mensaje)}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl transition-colors group link-lift"
                onClick={() => setIsOpen(false)}>
                <div className="bg-emerald-100 text-emerald-700 p-2 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors"><MapPin size={16} /></div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{suc.nombre}</p>
                  <p className="text-xs text-slate-400 font-data">Respuesta rápida</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}