import { CalendarCheck, ChevronRight } from 'lucide-react';

export default function BannerCta({ onAbrirReserva }) {
  return (
    <div className="w-full bg-optica-dark relative overflow-hidden my-16">
      {/* Deco de fondo abstracto */}
      <div className="absolute inset-0 opacity-10">
        <svg fill="none" viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <path fill="currentColor" d="M0 100 C 20 0 50 0 100 100 Z" className="text-white" />
          <path fill="currentColor" d="M0 50 C 50 100 80 100 100 100 Z" className="text-emerald-500" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 md:py-20 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            ¿Visión borrosa o dolores<br className="hidden md:block" /> de cabeza al final del día?
          </h2>
          <p className="text-gray-300 text-lg max-w-xl font-light">
            Tu salud visual no puede esperar. Reserva tu evaluación computarizada 
            <span className="font-bold text-white"> 100% gratuita</span> al cotizar tus nuevos lentes con nosotros.
          </p>
        </div>

        <div className="flex-shrink-0 animate-pulse-slow">
          <button
            onClick={onAbrirReserva}
            className="group relative flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(16,185,129,0.4)] hover:-translate-y-1"
          >
            <CalendarCheck size={24} />
            Agendar Ahora
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
