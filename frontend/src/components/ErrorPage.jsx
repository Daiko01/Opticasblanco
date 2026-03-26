import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, RefreshCw, Search, ShieldAlert, ServerCrash, WifiOff, AlertTriangle } from 'lucide-react';

/* ========================================
   CONFIGURACIÓN DE ERRORES
   ======================================== */
const errorConfig = {
  404: {
    code: '404',
    titulo: 'Página no encontrada',
    descripcion: 'Lo sentimos, la página que buscas no existe o fue movida a otra ubicación.',
    icono: Search,
    color: 'emerald',
    emoji: '🔍',
    sugerencia: '¿Quizás te interesa explorar nuestro catálogo de lentes?',
  },
  500: {
    code: '500',
    titulo: 'Error del servidor',
    descripcion: 'Ocurrió un problema interno en nuestro servidor. Estamos trabajando para solucionarlo.',
    icono: ServerCrash,
    color: 'amber',
    emoji: '⚙️',
    sugerencia: 'Intenta recargar la página en unos momentos.',
  },
  403: {
    code: '403',
    titulo: 'Acceso denegado',
    descripcion: 'No tienes permisos para acceder a esta sección. Si crees que es un error, contáctanos.',
    icono: ShieldAlert,
    color: 'red',
    emoji: '🔒',
    sugerencia: 'Vuelve al inicio o contacta al administrador.',
  },
  offline: {
    code: 'Sin conexión',
    titulo: 'Sin conexión a internet',
    descripcion: 'Parece que perdiste la conexión. Revisa tu red e intenta de nuevo.',
    icono: WifiOff,
    color: 'slate',
    emoji: '📡',
    sugerencia: 'Verifica tu conexión Wi-Fi o datos móviles.',
  },
};

/* ========================================
   PARTÍCULAS FLOTANTES decorativas
   ======================================== */
function FloatingParticles({ color }) {
  const colorMap = {
    emerald: 'bg-emerald-400/20',
    amber: 'bg-amber-400/20',
    red: 'bg-red-400/20',
    slate: 'bg-slate-400/20',
  };
  const bgClass = colorMap[color] || colorMap.emerald;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${bgClass} animate-float-particle`}
          style={{
            width: `${20 + Math.random() * 40}px`,
            height: `${20 + Math.random() * 40}px`,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${6 + Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ========================================
   COMPONENTE PRINCIPAL ERROR PAGE
   ======================================== */
export default function ErrorPage({ tipo = 404 }) {
  const location = useLocation();
  const config = errorConfig[tipo] || errorConfig[404];
  const IconoError = config.icono;
  const [contadorReintentos, setContadorReintentos] = useState(0);

  // Variantes de color para tailwind classes
  const colorVariants = {
    emerald: {
      bg: 'bg-emerald-50',
      bgDark: 'bg-emerald-100',
      text: 'text-emerald-600',
      textLight: 'text-emerald-500',
      border: 'border-emerald-200',
      ring: 'ring-emerald-500/20',
      btnBg: 'bg-emerald-600 hover:bg-emerald-700',
      btnOutline: 'border-emerald-300 text-emerald-700 hover:bg-emerald-50',
      glow: 'shadow-emerald-500/10',
    },
    amber: {
      bg: 'bg-amber-50',
      bgDark: 'bg-amber-100',
      text: 'text-amber-600',
      textLight: 'text-amber-500',
      border: 'border-amber-200',
      ring: 'ring-amber-500/20',
      btnBg: 'bg-amber-600 hover:bg-amber-700',
      btnOutline: 'border-amber-300 text-amber-700 hover:bg-amber-50',
      glow: 'shadow-amber-500/10',
    },
    red: {
      bg: 'bg-red-50',
      bgDark: 'bg-red-100',
      text: 'text-red-600',
      textLight: 'text-red-500',
      border: 'border-red-200',
      ring: 'ring-red-500/20',
      btnBg: 'bg-red-600 hover:bg-red-700',
      btnOutline: 'border-red-300 text-red-700 hover:bg-red-50',
      glow: 'shadow-red-500/10',
    },
    slate: {
      bg: 'bg-slate-50',
      bgDark: 'bg-slate-100',
      text: 'text-slate-600',
      textLight: 'text-slate-500',
      border: 'border-slate-200',
      ring: 'ring-slate-500/20',
      btnBg: 'bg-slate-600 hover:bg-slate-700',
      btnOutline: 'border-slate-300 text-slate-700 hover:bg-slate-50',
      glow: 'shadow-slate-500/10',
    },
  };

  const cv = colorVariants[config.color] || colorVariants.emerald;

  useEffect(() => {
    document.title = `${config.code} - ${config.titulo} | Ópticas Blanco`;
  }, [config]);

  const handleReload = () => {
    setContadorReintentos(prev => prev + 1);
    setTimeout(() => window.location.reload(), 300);
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Fondo decorativo */}
      <FloatingParticles color={config.color} />

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-lg text-center animate-fade-in">
        
        {/* Logo */}
        <div className="mb-8">
          <Link to="/" className="inline-block group">
            <img
              src="/logo.png"
              alt="Ópticas Blanco"
              className="h-12 md:h-14 object-contain mx-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Código de error grande */}
        <div className="relative mb-6">
          <span
            className="block text-[8rem] md:text-[10rem] font-black leading-none tracking-tighter text-slate-100 select-none"
            aria-hidden="true"
          >
            {config.code}
          </span>
          {/* Icono superpuesto */}
          <div className={`absolute inset-0 flex items-center justify-center`}>
            <div className={`w-20 h-20 md:w-24 md:h-24 ${cv.bg} ${cv.border} border-2 rounded-full flex items-center justify-center shadow-xl ${cv.glow} animate-bounce-slow`}>
              <IconoError size={36} className={cv.text} strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Textos */}
        <div className="space-y-3 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            {config.emoji} {config.titulo}
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            {config.descripcion}
          </p>
          <p className={`text-xs font-medium ${cv.textLight} ${cv.bg} inline-block px-4 py-2 rounded-full ${cv.border} border`}>
            {config.sugerencia}
          </p>
        </div>

        {/* Ruta actual (solo 404) */}
        {tipo === 404 && (
          <div className="mb-8 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 inline-block">
            <p className="text-xs font-mono text-slate-400">
              Ruta solicitada: <span className="text-slate-600 font-semibold">{location.pathname}</span>
            </p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className={`flex items-center gap-2 ${cv.btnBg} text-white font-bold px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl btn-magnetic group`}
          >
            <Home size={18} className="group-hover:scale-110 transition-transform" />
            Volver al Inicio
          </Link>

          <button
            onClick={() => window.history.back()}
            className={`flex items-center gap-2 bg-white border-2 ${cv.btnOutline} font-bold px-6 py-3 rounded-2xl transition-all duration-300 btn-magnetic group`}
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Página Anterior
          </button>

          {tipo === 500 && (
            <button
              onClick={handleReload}
              className="flex items-center gap-2 bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold px-6 py-3 rounded-2xl transition-all duration-300 btn-magnetic group"
            >
              <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
              Reintentar
            </button>
          )}
        </div>

        {/* Accesos rápidos */}
        <div className="mt-10 pt-8 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Páginas populares</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { to: '/catalogo', label: 'Catálogo' },
              { to: '/tiendas', label: 'Tiendas' },
              { to: '/contacto', label: 'Contacto' },
              { to: '/marcas', label: 'Marcas' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs font-semibold text-slate-500 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 px-4 py-2 rounded-full border border-slate-200 hover:border-emerald-200 transition-all duration-200 link-lift"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
