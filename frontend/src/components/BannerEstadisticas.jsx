import { useEffect, useRef } from 'react';
import { Users, MapPin, Glasses, Clock } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BannerEstadisticas() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stat-item', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        opacity: 0, y: 30, duration: 0.6, ease: 'power3.out', stagger: 0.12,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const stats = [
    { icon: Users, number: '5.000+', label: 'Clientes atendidos por año' },
    { icon: MapPin, number: '3', label: 'Sucursales en la V Región' },
    { icon: Glasses, number: '500+', label: 'Modelos con stock permanente' },
    { icon: Clock, number: '15+', label: 'Años de experiencia' },
  ];

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-emerald-950 relative overflow-hidden">
      {/* Background texture */}
      <img
        src="/glasses_collection.png"
        alt=""
        role="presentation"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-10"
      />
      <div className="absolute inset-0 bg-emerald-950/80" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight mb-4">
            Números que hablan de <span className="font-drama italic text-emerald-300">confianza</span>
          </h2>
          <p className="text-emerald-200/60 max-w-xl mx-auto font-light">
            Ópticas Blanco en cifras — más de una década construyendo relaciones de confianza en la V Región.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="stat-item text-center p-6 rounded-4xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="w-14 h-14 mx-auto bg-emerald-500/20 rounded-4xl flex items-center justify-center mb-5">
                  <Icon size={28} className="text-emerald-300" />
                </div>
                <p className="text-4xl md:text-5xl font-drama italic text-white mb-2">{stat.number}</p>
                <p className="text-sm text-emerald-200/60 font-data uppercase tracking-wider leading-snug">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
