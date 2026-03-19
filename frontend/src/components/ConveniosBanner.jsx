import { HeartPulse, CheckCircle2, ChevronRight } from 'lucide-react';

export default function ConveniosBanner() {
  const convenios = ['Isapre Banmédica', 'Consalud', 'Caja Los Andes', 'Fonasa (Bono PAD)', 'Cruz Blanca'];

  const handleWhatsAppConvenio = () => {
    window.open('https://wa.me/56991762935?text=Hola,%20me%20gustaría%20saber%20mas%20sobre%20los%20convenios%20y%20descuentos.', '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="relative w-full min-h-[500px] md:h-auto py-12 md:py-16 flex items-center overflow-hidden">
      {/* Imagen de fondo (Joven en óptica) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556228578-8d89cb34b6bb?auto=format&fit=crop&q=80&w=2000')" }}
      >
        <div className="absolute inset-0 bg-gray-900/90 dark:bg-gray-900/95"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8 py-10">
        
        <div className="max-w-2xl text-left">
          <span className="text-emerald-400 font-extrabold tracking-widest uppercase text-xs mb-3 block flex items-center gap-2">
            <HeartPulse size={16} /> Salud Visual Cercana
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
            Beneficios y <span className="text-emerald-400">Convenios</span> exclusivos
          </h2>
          
          <ul className="space-y-3 mb-8 text-gray-200">
            {[
              'Evaluación gratuita por la compra de tus lentes ópticos.',
              '20% de descuento adicional al agendar tu hora online.',
              'Descuentos especiales por planillazo y convenios con empresas.',
              'Atención y reembolso expedito con las principales Isapres.'
            ].map((beneficio, i) => (
              <li key={i} className="flex items-start gap-3 text-sm md:text-base">
                <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={20} />
                <span>{beneficio}</span>
              </li>
            ))}
          </ul>

          <button 
            onClick={handleWhatsAppConvenio}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-extrabold transition-colors shadow-lg shadow-emerald-500/30 flex items-center gap-2 group"
          >
            Consultar por mi empresa <ChevronRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Lado Derecho: Tarjetas de Descuentos con Logos PNG */}
        <div className="w-full md:w-auto flex flex-col gap-4 mt-8 md:mt-0 z-10 shrink-0">
          <p className="text-white font-bold opacity-80 uppercase tracking-widest text-xs mb-1 pl-2 text-center md:text-left">Descuentos por Convenio</p>
          
          <div className="flex flex-col sm:flex-row md:flex-col gap-4 justify-center md:justify-start">
            
            {/* Tarjeta Caja Los Héroes (30%) */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/20 transition-colors w-full sm:w-64 shadow-xl">
              <div className="w-16 h-12 bg-white rounded-lg flex items-center justify-center p-1.5 overflow-hidden shrink-0 shadow-inner">
                <img src="/logos/caja-los-heroes.png" alt="Caja Los Héroes" className="max-w-full max-h-full object-contain" onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='grid'}} />
                <span className="hidden place-items-center text-[10px] font-black text-gray-800 text-center leading-tight">LOS<br/>HÉROES</span>
              </div>
              <div>
                <p className="text-emerald-400 font-black text-2xl leading-none tracking-tight">30% <span className="text-lg font-bold">Dcto</span></p>
                <p className="text-white text-xs font-medium uppercase tracking-wider mt-0.5 opacity-90">Caja Los Héroes</p>
              </div>
            </div>

            {/* Tarjeta Fonasa (25%) */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/20 transition-colors w-full sm:w-64 shadow-xl">
              <div className="w-16 h-12 bg-white rounded-lg flex items-center justify-center p-1.5 overflow-hidden shrink-0 shadow-inner">
                <img src="/logos/fonasa.png" alt="Fonasa" className="max-w-full max-h-full object-contain" onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='grid'}} />
                <span className="hidden place-items-center text-xs font-black text-blue-600 tracking-tighter">FONASA</span>
              </div>
              <div>
                <p className="text-emerald-400 font-black text-2xl leading-none tracking-tight">25% <span className="text-lg font-bold">Dcto</span></p>
                <p className="text-white text-xs font-medium uppercase tracking-wider mt-0.5 opacity-90">Pacientes Fonasa</p>
              </div>
            </div>

            {/* Tarjeta Caja 18 (20%) */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/20 transition-colors w-full sm:w-64 shadow-xl">
              <div className="w-16 h-12 bg-white rounded-lg flex items-center justify-center p-1.5 overflow-hidden shrink-0 shadow-inner">
                <img src="/logos/caja18.png" alt="Caja 18" className="max-w-full max-h-full object-contain" onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='grid'}} />
                <span className="hidden place-items-center text-xs font-black text-gray-800 text-center leading-tight">CAJA<br/>18</span>
              </div>
              <div>
                <p className="text-emerald-400 font-black text-2xl leading-none tracking-tight">20% <span className="text-lg font-bold">Dcto</span></p>
                <p className="text-white text-xs font-medium uppercase tracking-wider mt-0.5 opacity-90">Caja 18 Sept.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
