import { useEffect, useRef } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

export default function HeroSection({ onAbrirReserva }) {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.hero-anim', { opacity: 0, y: 40 });
      gsap.to('.hero-anim', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.3,
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen flex items-end overflow-hidden"
    >
      {/* Background */}
      <img
        src="/optical_store_interior.png"
        alt=""
        role="presentation"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        fetchpriority="high"
      />

      {/* Gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/60 to-transparent"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 md:pb-24 lg:pb-32 pt-32">
        {/* Trust Badge */}
        <div className="hero-anim inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-data text-emerald-200 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          +20 años cuidando tu visión en la V Región
        </div>

        {/* Keyline Statement */}
        <h1 className="hero-anim mb-6">
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white tracking-tight leading-[1.1]">
            Tu salud visual es nuestra
          </span>
          <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-drama italic text-white leading-[0.95] -mt-1 md:-mt-2">
            Prioridad.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-anim text-lg md:text-xl text-white/85 max-w-lg leading-relaxed mb-10 font-light">
          Su salud visual a un precio justo. Asesoría clínica personalizada y una selección exclusiva de armazones para ti.
        </p>

        {/* CTAs */}
        <div className="hero-anim flex flex-col sm:flex-row gap-4">
          <button
            onClick={onAbrirReserva}
            className="btn-magnetic btn-slide group flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-4xl shadow-organic-lg hover:shadow-organic-xl transition-all duration-300"
          >
            <Calendar size={20} className="relative z-10" />
            <span className="relative z-10">Reservar Hora</span>
          </button>
          <Link
            to="/catalogo"
            className="btn-magnetic group flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold px-8 py-4 rounded-4xl transition-all duration-300 hover:bg-white/20"
          >
            <span>Explorar Catálogo</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Stats */}
        <div className="hero-anim flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10">
          <div>
            <span className="block text-3xl md:text-4xl font-drama italic text-emerald-300">500+</span>
            <span className="text-sm text-white/70 font-data uppercase tracking-wider">Modelos</span>
          </div>
          <div>
            <span className="block text-3xl md:text-4xl font-drama italic text-emerald-300">3</span>
            <span className="text-sm text-white/70 font-data uppercase tracking-wider">Sucursales</span>
          </div>
          <div>
            <span className="block text-3xl md:text-4xl font-drama italic text-emerald-300">20+</span>
            <span className="text-sm text-white/70 font-data uppercase tracking-wider">Años</span>
          </div>
        </div>
      </div>
    </section>
  );
}
