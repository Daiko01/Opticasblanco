import { useEffect, useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonios = [
  {
    nombre: 'María Fernanda G.',
    ubicacion: 'Viña del Mar',
    texto: 'La atención fue excelente, me ayudaron a elegir los lentes perfectos y en menos de una semana ya tenía mis anteojos listos. ¡Super recomendado!',
    estrellas: 5,
    iniciales: 'MF',
  },
  {
    nombre: 'Roberto Sánchez A.',
    ubicacion: 'Quilpué',
    texto: 'Llevé a toda mi familia y cada integrante encontró un modelo que le gustó. Los precios son realmente justos comparado con otras ópticas.',
    estrellas: 5,
    iniciales: 'RS',
  },
  {
    nombre: 'Carolina Muñoz P.',
    ubicacion: 'La Calera',
    texto: 'Me encantó el servicio por WhatsApp — pude consultar modelos y reservar hora sin salir de mi casa. Muy moderno y eficiente.',
    estrellas: 5,
    iniciales: 'CM',
  },
  {
    nombre: 'Fernando López B.',
    ubicacion: 'Viña del Mar',
    texto: 'Llevaba años buscando lentes progresivos buenos. El equipo me hizo un examen completo y me recomendaron exactamente lo que necesitaba.',
    estrellas: 5,
    iniciales: 'FL',
  },
  {
    nombre: 'Andrea Villalobos R.',
    ubicacion: 'Quilpué',
    texto: 'Llegué por una recomendación y no me arrepiento. La calidad de los cristales y el seguimiento post-venta son de otro nivel.',
    estrellas: 5,
    iniciales: 'AV',
  },
];

export default function Testimonios() {
  const sectionRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.testimonial-section', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonios.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrentIndex(i => (i - 1 + testimonios.length) % testimonios.length);
  const next = () => setCurrentIndex(i => (i + 1) % testimonios.length);

  const t = testimonios[currentIndex];

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 testimonial-section">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-100 text-emerald-800 text-xs font-data uppercase tracking-widest mb-6 border border-emerald-200">
            Testimonios
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-emerald-950 tracking-tight">
            Lo que dicen nuestros <span className="font-drama italic text-emerald-700">clientes</span>
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="organic-card p-8 md:p-12 relative overflow-hidden">
          {/* Quote icon */}
          <Quote size={80} className="absolute top-6 right-8 text-emerald-100 rotate-180" />

          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="w-20 h-20 rounded-4xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl font-heading shadow-organic-md">
                {t.iniciales}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              {/* Stars */}
              <div className="flex gap-1 mb-4 justify-center md:justify-start">
                {Array.from({ length: t.estrellas }).map((_, i) => (
                  <Star key={i} size={18} fill="#059669" className="text-emerald-600" />
                ))}
              </div>

              <blockquote className="text-lg md:text-xl text-slate-700 leading-relaxed mb-6 font-medium italic">
                "{t.texto}"
              </blockquote>

              <div>
                <p className="font-heading font-bold text-emerald-950">{t.nombre}</p>
                <p className="text-sm text-slate-400 font-data">Sucursal {t.ubicacion}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            <div className="flex gap-2">
              {testimonios.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'bg-emerald-600 w-8' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Ir a testimonio ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-700 hover:border-emerald-300 transition-all"
                aria-label="Testimonio anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-700 hover:border-emerald-300 transition-all"
                aria-label="Siguiente testimonio"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
