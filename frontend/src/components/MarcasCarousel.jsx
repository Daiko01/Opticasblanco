import { Link } from 'react-router-dom';

export default function MarcasCarousel() {
  const marcas = [
    { nombre: 'Ray-Ban', logo: 'RAY-BAN' },
    { nombre: 'Oakley', logo: 'OAKLEY' },
    { nombre: 'Vogue', logo: 'VOGUE' },
    { nombre: 'Gucci', logo: 'GUCCI' },
    { nombre: 'Prada', logo: 'PRADA' },
    { nombre: 'Versace', logo: 'VERSACE' },
    { nombre: 'Tom Ford', logo: 'TOM FORD' },
    { nombre: 'Dolce & Gabbana', logo: 'D&G' },
    { nombre: 'Armani', logo: 'ARMANI' },
    { nombre: 'Carolina Herrera', logo: 'C.H' },
  ];

  return (
    <section aria-label="Marcas internacionales" className="bg-transparent py-16 overflow-hidden border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <p className="text-center text-xs font-data uppercase tracking-[0.25em] text-slate-300">
          Trabajamos con las mejores marcas del mundo
        </p>
      </div>

      <div className="relative flex overflow-x-hidden" role="presentation">
        <div aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div aria-hidden="true" className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
          {marcas.map((marca, index) => (
            <Link key={`real-${index}`} to={`/catalogo?marca=${encodeURIComponent(marca.nombre)}`} aria-label={`Ver productos de ${marca.nombre}`}
              className="flex-shrink-0 mx-8 md:mx-16 group cursor-pointer inline-block link-lift"
            >
              <span className="text-2xl md:text-3xl font-heading font-black tracking-widest text-slate-200 group-hover:text-emerald-600 transition-colors duration-300 select-none">
                {marca.logo}
              </span>
            </Link>
          ))}
          {marcas.map((marca, index) => (
            <span key={`dup-${index}`} aria-hidden="true"
              className="flex-shrink-0 mx-8 md:mx-16 text-2xl md:text-3xl font-heading font-black tracking-widest text-slate-200 select-none inline-block"
            >{marca.logo}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
