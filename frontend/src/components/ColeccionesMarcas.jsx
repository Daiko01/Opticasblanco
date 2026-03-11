import { ArrowRight, Tag } from 'lucide-react';

export default function ColeccionesMarcas() {
  const marcas = [
    {
      id: 'rayban',
      nombre: 'Ray-Ban',
      subtitulo: 'Iconos atemporales',
      desc: 'El espíritu rebelde y el diseño que hace historia.',
      colores: 'bg-red-900',
      imagen: 'https://images.unsplash.com/photo-1572631382901-cece0621e271?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'oakley',
      nombre: 'Oakley',
      subtitulo: 'Rendimiento Extremo',
      desc: 'Tecnología deportiva para desafiar tus límites.',
      colores: 'bg-gray-900',
      imagen: 'https://images.unsplash.com/photo-1621252636904-436d4bc22ba8?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'versace',
      nombre: 'Versace',
      subtitulo: 'Lujo Atrevido',
      desc: 'Glamour italiano que nunca pasa desapercibido.',
      colores: 'bg-amber-800',
      imagen: 'https://images.unsplash.com/photo-1559564883-9e4ce07a1bfe?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'michaelkors',
      nombre: 'Michael Kors',
      subtitulo: 'Elegancia Jet-Set',
      desc: 'Sofisticación moderna para tu día a día.',
      colores: 'bg-teal-900',
      imagen: 'https://images.unsplash.com/photo-1588667610080-69273fdb2ab3?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pl-0 md:pl-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-5 h-5 text-emerald-500" />
              <span className="text-emerald-500 font-extrabold tracking-widest uppercase text-xs">Marcas Globales</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              Colecciones <span className="text-emerald-500">Destacadas</span>
            </h2>
          </div>
          <a 
            href="/marcas" 
            className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-700 transition"
          >
            Ver todas las marcas <ArrowRight size={20} />
          </a>
        </div>

        {/* Grid de Marcas Premium Horizontal */}
        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 snap-x snap-mandatory px-0 md:px-4 hide-scroll-bar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {marcas.map((marca) => (
            <div 
              key={marca.id}
              className={`relative min-w-[300px] md:min-w-[400px] overflow-hidden rounded-3xl h-[400px] md:h-[480px] group bg-gray-100 dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 snap-center`}
            >
              {/* Imagen de fondo (Modelo) */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${marca.imagen})` }}
              ></div>
              
              {/* Filtro Color Opaco Overlay Moderado */}
              <div className={`absolute inset-0 ${marca.colores} mix-blend-multiply opacity-60 group-hover:opacity-80 transition-opacity duration-500`}></div>
              
              {/* Oscuro inferior para asegurar lectura */}
              <div className="absolute inset-0 bg-gray-900/60 opacity-90"></div>
              
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end text-white z-10">
                <p className="text-sm font-bold uppercase tracking-widest opacity-90 mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {marca.subtitulo}
                </p>
                <h3 className="text-4xl lg:text-5xl font-black tracking-tight mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  {marca.nombre}
                </h3>
                <p className="text-gray-200 font-medium max-w-sm mb-8 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                  {marca.desc}
                </p>
                
                <div className="overflow-hidden">
                  <a 
                    href={`/catalogo?busqueda=${marca.nombre}`}
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-gray-900 px-6 py-3.5 rounded-xl font-bold transition-colors transform translate-y-12 group-hover:translate-y-0 duration-300 delay-150 border border-white/30"
                  >
                    Ver Colección <ArrowRight size={18} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
