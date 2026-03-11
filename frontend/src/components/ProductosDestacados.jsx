import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Skeleton card para mostrar mientras carga
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 min-w-[65vw] max-w-[280px] sm:min-w-0 sm:max-w-none snap-center shrink-0 flex flex-col">
      <div className="skeleton h-48 rounded-none" />
      <div className="p-4 flex flex-col gap-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="skeleton h-6 w-1/3 mt-2" />
      </div>
    </div>
  );
}

export default function ProductosDestacados() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const carouselRef = useRef(null);
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/productos')
      .then(r => r.json())
      .then(datos => {
        setProductos(datos.slice(0, 4));
        setCargando(false);
      })
      .catch(error => {
        console.error('Error cargando productos destacados:', error);
        setCargando(false);
      });
  }, []);

  // No renderizar nada si terminó de cargar y no hay productos
  if (!cargando && productos.length === 0) return null;

  return (
    <section aria-labelledby="productos-heading" className="max-w-6xl mx-auto px-4 py-16 md:px-8">
      {/* Título */}
      <div className="text-center mb-10">
        <p className="text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
          <span aria-hidden="true" className="w-8 h-[2px] bg-emerald-500" />
          Lo más buscado
          <span aria-hidden="true" className="w-8 h-[2px] bg-emerald-500" />
        </p>
        <h2 id="productos-heading" className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white mb-2">
          Productos Destacados
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Los lentes más buscados por nuestros clientes
        </p>
      </div>

      {/* Grid de 4 productos y Carrusel Mobile */}
      <div className="relative group/carousel">
        {/* Controles Mobile */}
        <button
          onClick={() => scrollCarousel('left')}
          aria-label="Ir a productos anteriores"
          className="absolute left-0 top-[40%] -translate-y-1/2 -ml-2 sm:-ml-4 z-20 sm:hidden bg-white/95 dark:bg-gray-800/95 text-gray-800 dark:text-gray-200 p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all opacity-90"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </button>
        <button
          onClick={() => scrollCarousel('right')}
          aria-label="Ver más productos"
          className="absolute right-0 top-[40%] -translate-y-1/2 -mr-2 sm:-mr-4 z-20 sm:hidden bg-white/95 dark:bg-gray-800/95 text-gray-800 dark:text-gray-200 p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all opacity-90"
        >
          <ChevronRight size={24} aria-hidden="true" />
        </button>

        <div
          ref={carouselRef}
          role="list"
          aria-label="Productos destacados"
          className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory pb-4 custom-scrollbar px-4 sm:px-0"
        >
          {cargando
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="sm:min-w-0 snap-center shrink-0"><SkeletonCard /></div>
              ))
            : productos.map(producto => (
                <Link
                  key={producto.id}
                  to={`/producto/${producto.id}`}
                  role="listitem"
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:-translate-y-1 flex flex-col h-full min-w-[65vw] max-w-[280px] sm:min-w-0 sm:max-w-none snap-center shrink-0"
                >
                  {/* Imagen */}
                  <div className="relative overflow-hidden h-48 bg-gray-100 dark:bg-gray-900">
                    {producto.imagen_url ? (
                      <img
                        src={producto.imagen_url}
                        alt={`${producto.nombre}${producto.marca ? ` — ${producto.marca}` : ''}`}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        width="280"
                        height="192"
                        decoding="async"
                      />
                    ) : (
                      <div aria-hidden="true" className="w-full h-full flex items-center justify-center text-5xl text-gray-300 dark:text-gray-600">👓</div>
                    )}
                    {producto.categoria && (
                      <span className="absolute top-3 left-3 bg-optica-dark/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {producto.categoria}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">{producto.nombre}</h3>
                    {producto.marca && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{producto.marca}</p>
                    )}
                    {producto.material && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{producto.material}</p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full">
                        Consultar disponibilidad
                      </span>
                      <span aria-hidden="true" className="text-xs font-semibold text-optica-dark dark:text-emerald-400 group-hover:underline">Ver →</span>
                    </div>
                  </div>
                </Link>
              ))
          }
        </div>
      </div>

      {/* Botón ver catálogo completo */}
      <div className="text-center mt-10">
        <Link
          to="/catalogo"
          className="inline-block bg-optica-dark hover:bg-optica-light text-white font-bold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Ver Catálogo Completo →
        </Link>
      </div>
    </section>
  );
}
