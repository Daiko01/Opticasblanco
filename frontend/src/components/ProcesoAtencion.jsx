import { useEffect, useRef } from 'react';
import { Search, FileCheck, Glasses, Smile } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProcesoAtencion() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.process-step', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        opacity: 0, y: 50, duration: 0.7, ease: 'power3.out', stagger: 0.15,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const pasos = [
    {
      icono: Search,
      numero: '01',
      titulo: 'Evaluación Integral',
      desc: 'Realizamos un examen visual completo con equipos de última generación para conocer tu situación ocular.',
    },
    {
      icono: FileCheck,
      numero: '02',
      titulo: 'Receta Personalizada',
      desc: 'Nuestros profesionales elaboran tu receta óptica precisa, despachada sin largas esperas.',
    },
    {
      icono: Glasses,
      numero: '03',
      titulo: 'Selección de Armazón',
      desc: 'Elige entre +500 modelos de las mejores marcas internacionales con la asesoría de nuestro equipo.',
    },
    {
      icono: Smile,
      numero: '04',
      titulo: 'Entrega y Seguimiento',
      desc: 'Recibe tus lentes con ajuste perfecto y cuenta con soporte continuo vía WhatsApp.',
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-100 text-emerald-800 text-xs font-data uppercase tracking-widest mb-6 border border-emerald-200">
            Nuestro Proceso
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-emerald-950 tracking-tight mb-4">
            Cómo funciona tu <span className="font-drama italic text-emerald-700">experiencia</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light">
            Desde la evaluación hasta la entrega — un proceso diseñado para tu comodidad.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />

          {pasos.map((paso, idx) => {
            const Icon = paso.icono;
            return (
              <div key={idx} className="process-step relative">
                <div className="organic-card p-8 text-center h-full flex flex-col items-center">
                  {/* Step number + icon */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-emerald-100 rounded-4xl flex items-center justify-center mx-auto border border-emerald-200">
                      <Icon size={32} className="text-emerald-700" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold font-data shadow-organic-sm">
                      {paso.numero}
                    </span>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-emerald-950 mb-3">{paso.titulo}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{paso.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Image banner below */}
        <div className="mt-16 relative rounded-5xl overflow-hidden h-64 md:h-80 shadow-organic-xl">
          <img
            src="/eye_exam_service.png"
            alt="Servicio de examen visual profesional"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/70 to-transparent" />
          <div className="absolute inset-0 flex items-center p-8 md:p-12">
            <div className="max-w-md">
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">
                Tecnología <span className="font-drama italic text-emerald-300">de punta</span>
              </h3>
              <p className="text-white/70 font-light">
                Contamos con autorefractómetros y equipos digitales de última generación para asegurar un diagnóstico preciso.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
