import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Glasses } from 'lucide-react';

export default function ProductCard({ producto }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link 
      to={`/producto/${producto.id}`} 
      className="group flex flex-col h-full bg-white dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700/50 transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
    >
      {/* ── Imagen ─────────────────────────────────────────────────────────── */}
      <figure className="relative bg-[#f8f9fa] dark:bg-gray-900 aspect-[4/3] overflow-hidden m-0 flex items-center justify-center p-8">
        {producto.imagen_url && !imgError ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200 dark:text-gray-700">
            <Glasses size={72} strokeWidth={1} />
          </div>
        )}

        {/* Badge categoría sutil */}
        {producto.categoria && (
          <span className="absolute top-4 left-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm z-10 border border-emerald-100 dark:border-gray-700">
            {producto.categoria}
          </span>
        )}
      </figure>

      {/* ── Contenido Minimalista ─────────────────────────────────────────── */}
      <div className="p-6 flex flex-col flex-1 items-center justify-center text-center">
        {producto.marca && (
          <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
            {producto.marca}
          </p>
        )}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">
          {producto.nombre}
        </h3>
      </div>
    </Link>
  );
}
