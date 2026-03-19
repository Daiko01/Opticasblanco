import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';

export default function NuestrasMarcas() {
  const marcas = [
    { nombre: "Ray-Ban", estilo: "Clásico & Sol", logoText: "RAY-BAN" },
    { nombre: "Oakley", estilo: "Deportivo & Rendimiento", logoText: "OAKLEY" },
    { nombre: "Vogue", estilo: "Moda & Tendencia", logoText: "VOGUE" },
    { nombre: "Prada", estilo: "Lujo Intemporal", logoText: "PRADA" },
    { nombre: "Persol", estilo: "Artesanía Italiana", logoText: "PERSOL" },
    { nombre: "Michael Kors", estilo: "Elegancia Urbana", logoText: "MICHAEL KORS" },
    { nombre: "Emporio Armani", estilo: "Estilo Moderno", logoText: "E. ARMANI" },
    { nombre: "Polo", estilo: "Estilo Americano", logoText: "POLO RALPH LAUREN" },
  ];

  return (
    <div className="pt-24 md:pt-28 pb-16 md:pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-100 text-emerald-800 text-xs font-data uppercase tracking-widest mb-6 border border-emerald-200">Colección Premium</span>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-emerald-950 mb-6 tracking-tight">
            Nuestras <span className="font-drama italic text-emerald-700">Marcas</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8 font-light">Las casas de diseño más prestigiosas para asegurarte estilo, durabilidad y los mejores materiales.</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> Distribuidores Oficiales</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> Garantía de Autenticidad</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> Colecciones Actualizadas</span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {marcas.map((marca, idx) => (
            <Link key={idx} to={`/catalogo?marca=${encodeURIComponent(marca.nombre)}`}
              className="organic-card-v2 p-8 flex flex-col items-center justify-center text-center group">
              <div className="h-16 flex items-center justify-center mb-4">
                <h3 className="text-xl md:text-2xl font-heading font-black tracking-tighter text-slate-400 group-hover:text-emerald-700 transition-all">{marca.logoText}</h3>
              </div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-data">{marca.estilo}</p>
            </Link>
          ))}
        </div>

        <ScrollReveal className="mt-20 bg-emerald-950 rounded-5xl p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
              ¿Buscas un modelo <span className="font-drama italic text-emerald-300">específico?</span>
            </h2>
            <p className="text-emerald-200/50 mb-8 max-w-lg mx-auto font-light">Si no encuentras el armazón que buscas, contáctanos.</p>
            <button className="btn-magnetic btn-slide bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-4xl transition-all shadow-organic-md"
              onClick={() => window.open('https://wa.me/56991762935?text=Hola,%20busco%20un%20modelo%20específico', '_blank')}>
              <span className="relative z-10">Consultar Disponibilidad</span>
            </button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
