import { useState, useEffect } from 'react';
import { ArrowRight, Star, Glasses } from 'lucide-react';
import ProductCard from './ProductCard';
import API_BASE_URL from '../config';

export default function MejoresProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState('Op'); // 'Op': Opticos, 'Sol': Sol, 'Todos': Todos

  useEffect(() => {
    fetch(`${API_BASE_URL}/productos`)
      .then(r => r.json())
      .then(data => {
        setProductos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error cargando mejores productos:', err);
        setLoading(false);
      });
  }, []);

  const productosAsArray = Array.isArray(productos) ? productos : [];
  
  // Lógica de filtrado básico basada en palabras clave en categoría (asumiendo sol vs ópticos)
  const filtrados = productosAsArray.filter(p => {
    const cat = (p.categoria || '').toLowerCase();
    if (filtroActivo === 'Todos') return true;
    if (filtroActivo === 'Sol') return cat.includes('sol');
    if (filtroActivo === 'Op') return cat.includes('optico') || cat.includes('óptico') || cat.includes('marco');
    return true;
  });

  // Mostramos solo un máximo de 4 productos en el home
  const mostrar = filtrados.slice(0, 4);

  return (
    <section className="py-24 px-4 md:px-8 bg-gray-50 dark:bg-gray-900 overflow-hidden relative border-t border-gray-100 dark:border-gray-800">
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-emerald-500 font-extrabold tracking-widest uppercase text-xs">Selección de Expertos</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              Nuestros <span className="text-emerald-500">Mejores</span> Lentes
            </h2>
          </div>

          {/* Selector de Pestañas (Pills) */}
          <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 w-full md:w-auto">
            {['Op', 'Sol'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltroActivo(cat)}
                className={`flex-1 md:flex-none uppercase text-xs font-bold px-6 py-3 rounded-xl transition-all duration-300 ${
                  filtroActivo === cat 
                    ? 'bg-emerald-500 text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {cat === 'Op' ? 'Ópticos' : 'Lentes de Sol'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : mostrar.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mostrar.map(producto => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <Glasses className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-500 font-medium">Aún no hay modelos destacados en esta categoría.</h3>
          </div>
        )}

        <div className="mt-14 text-center">
          <a 
            href="/catalogo"
            className="inline-flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold hover:text-emerald-700 transition-all hover:gap-3 group px-4 py-2"
          >
            Explorar todo el catálogo <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
