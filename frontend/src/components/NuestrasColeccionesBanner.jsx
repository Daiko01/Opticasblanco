import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function NuevasColeccionesBanner() {
  const handleConsultar = () => {
    window.open('https://wa.me/56991762935?text=Hola,%20vengo%20de%20la%20pagina%20y%20me%20interesa%20conocer%20las%20nuevas%20colecciones%20con%20filtro%20de%20luz%20azul.', '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-8 px-4 md:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden relative shadow-2xl bg-emerald-900">
        
        {/* Abstract Background Design */}
        <div className="absolute inset-0 z-0 opacity-20">
          {/* Decorative grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        <div className="relative z-10 px-8 py-16 md:py-20 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10">
          
          <div className="text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-700/50 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6">
              <ShieldCheck size={16} /> Protección Tecnológica
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
              Descubre las nuevas colecciones con filtro <span className="text-emerald-300">Luz Azul</span> integrado
            </h2>
            <p className="text-emerald-100/80 text-lg md:text-xl leading-relaxed mb-8 font-medium">
              Protege tus ojos de las pantallas digitales sin sacrificar el estilo. Diseños premium de tus marcas favoritas, listos para sumar comodidad a tu rutina diaria.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button 
                onClick={handleConsultar}
                className="bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-lg px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-white/20 hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Conocer la Colección <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <div className="hidden lg:flex relative w-1/3 mt-10 md:mt-0 justify-center">
             {/* Mockup visual de un cristal o lente */}
             <div className="relative w-64 h-64">
               <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[80px] animate-pulse"></div>
               <div className="absolute inset-0 border-[8px] border-white/10 rounded-full border-t-emerald-400/50 border-r-blue-400/50 animate-spin-slow"></div>
               <div className="absolute inset-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[30px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                 <ShieldCheck size={64} className="text-white/80 drop-shadow-lg" />
               </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
