import { Users, Target, Shield, Award } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function QuienesSomos() {
  const valores = [
    { icono: Target, titulo: "Precisión", desc: "Equipos de última generación para diagnósticos exactos." },
    { icono: Shield, titulo: "Garantía", desc: "Respaldo total en todos nuestros armazones y cristales." },
    { icono: Users, titulo: "Atención", desc: "Un equipo humano dedicado a tu comodidad y estilo." },
    { icono: Award, titulo: "Calidad", desc: "Trabajamos solo con los mejores laboratorios ópticos." },
  ];

  return (
    <div className="pt-24 md:pt-28 pb-16 md:pb-24">
      <ScrollReveal className="max-w-6xl mx-auto px-6 mb-20 text-center">
        <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-100 text-emerald-800 text-xs font-data uppercase tracking-widest mb-6 border border-emerald-200">Nuestra Historia</span>
        <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-emerald-950 mb-6 tracking-tight">
          Más que una óptica,<br /><span className="font-drama italic text-emerald-700">una visión de vida.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-light">
          En Ópticas Blanco llevamos más de 15 años cuidando la salud visual de nuestros clientes.
        </p>
      </ScrollReveal>

      <ScrollReveal className="max-w-6xl mx-auto px-6 mb-20">
        <div className="relative h-96 md:h-[500px] rounded-5xl overflow-hidden shadow-organic-xl">
          <img src="/optical_store_interior.png" alt="Interior de Ópticas Blanco" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent" />
          <div className="absolute inset-0 flex items-end p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
              Profesionales a tu <span className="font-drama italic text-emerald-300">servicio.</span>
            </h2>
          </div>
        </div>
      </ScrollReveal>

      <div className="bg-slate-50 py-20">
        <ScrollReveal className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-extrabold text-emerald-950">
              Nuestros <span className="font-drama italic text-emerald-700">Pilares</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map((val, idx) => {
              const Icon = val.icono;
              return (
                <div key={idx} className="organic-card p-6 text-center">
                  <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-700 rounded-4xl flex items-center justify-center mb-6 border border-emerald-200">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-emerald-950 mb-3">{val.titulo}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
