import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EstilosGaleria() {
  const estilos = [
    {
      id: 'transparentes',
      nombre: 'Transparentes',
      desc: 'Sutiles, modernos y versátiles.',
      colorBusqueda: 'Transparente',
      imagen: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'herencia',
      nombre: 'Herencia Moderna',
      desc: 'Tonos cálidos y clásicos atemporales.',
      colorBusqueda: 'Café',
      imagen: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'brillos',
      nombre: 'Brillos y Refinados',
      desc: 'Toques metálicos y elegancia pura.',
      colorBusqueda: 'Gris',
      imagen: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'dorada',
      nombre: 'Hora Dorada',
      desc: 'Destaca con monturas deslumbrantes.',
      colorBusqueda: 'Dorado',
      imagen: 'https://images.unsplash.com/photo-1508296695146-257a814050b4?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'clasicos',
      nombre: 'Clásicos',
      desc: 'El poder del negro en tu mirada.',
      colorBusqueda: 'Negro',
      imagen: 'https://images.unsplash.com/photo-1595052981881-807221290352?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center md:text-left mb-12 max-w-2xl">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <span className="text-emerald-500 font-extrabold tracking-widest uppercase text-xs">Colecciones Exclusivas</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            Tu estilo, <br /> <span className="text-emerald-500">a tu manera</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            ¿Buscas el armazón perfecto pero no sabes por dónde empezar? Explora una selección de estilos por forma y color para que se adapten a tu mirada.
          </p>
        </div>

        {/* Contenedor Horizontal con Scroll */}
        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 snap-x snap-mandatory hide-scroll-bar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {estilos.map((estilo) => (
            <Link 
              key={estilo.id}
              to={`/catalogo?busqueda=${estilo.colorBusqueda}`}
              className="relative min-w-[280px] md:min-w-[320px] h-[400px] rounded-3xl overflow-hidden group snap-center shadow-lg dark:shadow-none"
            >
              {/* Imagen de Fondo */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${estilo.imagen})` }}
              ></div>
              
              {/* Overlay Oscuro / Gradiente */}
              <div className="absolute inset-0 bg-gray-900/70 opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              
              {/* Contenido */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-10 text-white">
                <h3 className="text-3xl font-black mb-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">{estilo.nombre}</h3>
                <p className="text-sm text-gray-300 font-medium mb-4 max-w-[90%] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                  {estilo.desc}
                </p>
                <div className="flex items-center gap-2 text-white font-bold text-sm bg-emerald-500/90 backdrop-blur-md w-max px-5 py-2.5 rounded-xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all delay-150 duration-300">
                  Ver Colección <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}

          {/* Tarjeta Extra: CTA Catálogo Completo */}
          <Link 
            to="/catalogo"
            className="relative min-w-[280px] md:min-w-[320px] h-[400px] rounded-3xl p-8 overflow-hidden group bg-gray-900 dark:bg-emerald-900 border border-gray-800 hover:shadow-xl transition-all duration-300 flex flex-col justify-center items-center text-center snap-center"
          >
            <div className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10 shadow-lg shadow-emerald-500/50">
              <ArrowRight size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Ver todo el catálogo</h3>
            <p className="text-gray-400 relative z-10">Descubre +500 modelos</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
