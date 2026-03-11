import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const location = useLocation();
  let pathnames = location.pathname.split('/').filter(x => x);
  if (pathnames.length > 0 && pathnames[0] === 'producto') pathnames = ['catalogo', ...pathnames];

  const routeNames = { 'catalogo': 'Catálogo', 'marcas': 'Nuestras Marcas', 'tiendas': 'Sucursales', 'quienes-somos': 'Nosotros', 'contacto': 'Contacto', 'producto': 'Detalles del Producto' };

  if (pathnames.length === 0 || pathnames[0] === 'admin') return null;

  return (
    <div className="bg-white/50 border-b border-slate-100 backdrop-blur-sm sticky top-[72px] z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 md:px-6">
        <nav className="flex text-sm text-slate-400 font-medium whitespace-nowrap overflow-x-auto custom-scrollbar">
          <Link to="/" className="flex items-center hover:text-emerald-600 transition-colors shrink-0 link-lift">
            <Home size={14} className="mr-1.5" /> Inicio
          </Link>
          {pathnames.map((value, index) => {
            const isLast = index === pathnames.length - 1;
            let to = `/${pathnames.slice(0, index + 1).join('/')}`;
            if (pathnames[0] === 'catalogo' && pathnames[1] === 'producto') {
              if (index === 0) to = '/catalogo'; else if (index === 1) to = '/producto'; else to = `/${pathnames.slice(1, index + 1).join('/')}`;
            }
            let name = routeNames[value] || value;
            if (pathnames.includes('producto') && index === pathnames.length - 1) name = "Vista Rápida";
            const isClickable = value !== 'producto';
            return (
              <div key={to} className="flex items-center shrink-0">
                <ChevronRight size={14} className="mx-2 text-slate-200" />
                {isLast || !isClickable ? (
                  <span className={`capitalize truncate max-w-[200px] ${isLast ? 'font-bold text-emerald-950' : 'font-medium'}`}>{name}</span>
                ) : (
                  <Link to={to} className="hover:text-emerald-600 transition-colors capitalize link-lift">{name}</Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
