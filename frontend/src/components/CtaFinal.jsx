import { useEffect, useRef } from 'react';
import { CalendarDays } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CtaFinal({ onAbrirReserva }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.manifesto-line', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', stagger: 0.12,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} aria-labelledby="cta-heading" className="relative overflow-hidden min-h-[500px] bg-emerald-950">
      <img
        src="/glasses_collection.png"
        alt="" role="presentation"
        className="absolute inset-0 w-full h-full object-cover opacity-10"
        loading="lazy" aria-hidden="true"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-emerald-950/80" />

      <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center relative z-10 flex flex-col items-center">
        <span className="manifesto-line inline-block bg-emerald-100/10 text-emerald-300 border border-emerald-400/20 text-xs font-data uppercase tracking-widest px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
          Nuestra Filosofía
        </span>

        <p className="manifesto-line text-lg md:text-xl text-emerald-200/50 mb-4 max-w-2xl font-light leading-relaxed">
          La mayoría de las ópticas se enfoca en vender lentes.
        </p>

        <h2 id="cta-heading" className="manifesto-line text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-10 max-w-4xl">
          <span className="font-heading font-bold">Nosotros cuidamos tu </span>
          <span className="font-drama italic text-emerald-300">visión.</span>
        </h2>

        <p className="manifesto-line text-lg text-emerald-200/50 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
          Su salud visual a un precio justo. Evaluamos tu vista con la mejor tecnología, profesionales dedicados y las marcas que más confías.
        </p>

        <button
          onClick={onAbrirReserva}
          className="manifesto-line btn-magnetic btn-slide group inline-flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg px-10 py-5 rounded-4xl shadow-organic-xl hover:shadow-[0_0_60px_rgba(5,150,105,0.3)] transition-all duration-300"
        >
          <CalendarDays size={22} className="relative z-10" />
          <span className="relative z-10">Agendar Evaluación Ahora</span>
          <svg aria-hidden="true" className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </section>
  );
}
