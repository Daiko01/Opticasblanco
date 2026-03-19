import { useState } from 'react';
import { CheckCircle2, ArrowRight, Smartphone, Sun, Laptop } from 'lucide-react';

export default function InteractiveQuiz() {
  const [paso, setPaso] = useState(0);

  const opciones = [
    { id: 'pantallas', icono: Laptop, texto: 'Paso horas frente a pantallas' },
    { id: 'sol', icono: Sun, texto: 'Protección para exteriores' },
    { id: 'lectura', icono: Smartphone, texto: 'Dificultad para leer de cerca' },
  ];

  const handleSeleccion = () => {
    setPaso(1);
    setTimeout(() => setPaso(2), 1800);
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/56991762935?text=Hola,%20vengo%20de%20la%20pagina%20y%20tengo%20esta%20consulta', '_blank');
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-24 md:py-32 relative z-10 w-full">
      <div className="relative w-full glass-card p-8 md:p-16 shadow-organic-xl overflow-hidden">
        
        {/* Ambient blobs */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-mossy-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-float"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-clay/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-float animation-delay-2000"></div>

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          {paso === 0 && (
            <div className="animate-fade-in">
              <span className="inline-block py-1.5 px-4 rounded-full bg-clay/10 text-clay-700 dark:text-clay-300 text-xs font-data uppercase tracking-widest mb-6 border border-clay/20">
                Guía Interactiva
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-charcoal dark:text-cream mb-6 tracking-tight leading-tight">
                Encuentra tu lente <span className="font-drama italic text-mossy dark:text-clay">ideal</span>
              </h2>
              <p className="text-charcoal/60 dark:text-mossy-200/60 mb-12 text-lg font-light">
                Selecciona la situación que más te identifica y te recomendaremos la solución visual perfecta.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {opciones.map((opc) => {
                  const Icon = opc.icono;
                  return (
                    <button
                      key={opc.id}
                      onClick={handleSeleccion}
                      className="group organic-card !bg-surface/80 dark:!bg-mossy-800/80 backdrop-blur-sm flex flex-col items-center p-8 hover:!border-clay transition-all duration-300"
                    >
                      <div className="w-16 h-16 rounded-4xl bg-mossy/5 dark:bg-clay/10 flex items-center justify-center mb-6 group-hover:bg-clay group-hover:text-charcoal transition-all duration-300">
                        <Icon strokeWidth={1.5} size={28} className="text-mossy dark:text-clay group-hover:text-charcoal transition-colors duration-300" />
                      </div>
                      <span className="text-base font-semibold text-charcoal dark:text-cream text-center leading-snug">
                        {opc.texto}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {paso === 1 && (
            <div className="py-20 animate-fade-in flex flex-col items-center justify-center">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-mossy/10 dark:border-clay/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-clay border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-clay rounded-full animate-pulse"></div>
                </div>
              </div>
              <h3 className="text-2xl font-heading font-bold text-charcoal dark:text-cream">Analizando tu perfil visual...</h3>
              <p className="text-charcoal/40 dark:text-mossy-200/40 mt-3 text-lg font-data">Filtrando las mejores opciones.</p>
            </div>
          )}

          {paso === 2 && (
            <div className="animate-fade-in py-8">
              <div className="w-24 h-24 bg-clay/10 rounded-full flex items-center justify-center mx-auto mb-8 border-[6px] border-surface dark:border-mossy-800">
                <CheckCircle2 size={48} className="text-clay" />
              </div>
              <h2 className="text-4xl font-heading font-bold text-charcoal dark:text-cream mb-6 tracking-tight">
                ¡Tenemos la solución <span className="font-drama italic text-mossy dark:text-clay">perfecta!</span>
              </h2>
              <p className="text-charcoal/60 dark:text-mossy-200/60 mb-10 text-lg leading-relaxed max-w-xl mx-auto font-light">
                Tu estilo de vida requiere cristales específicos. Escríbenos para mostrarte los armazones seleccionados <strong className="text-charcoal dark:text-cream font-bold">especialmente para ti</strong>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleWhatsApp}
                  className="btn-magnetic btn-slide bg-[#25D366] text-white font-bold px-8 py-4 rounded-4xl transition-all shadow-organic-md flex items-center justify-center gap-3 w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center gap-2">Ver recomendación en WhatsApp <ArrowRight size={20} /></span>
                </button>
                <button
                  onClick={() => setPaso(0)}
                  className="text-charcoal/60 dark:text-mossy-200/60 hover:text-clay px-6 py-4 font-semibold transition-colors w-full sm:w-auto hover:bg-surface/50 rounded-4xl link-lift"
                >
                  Hacer otro test
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
