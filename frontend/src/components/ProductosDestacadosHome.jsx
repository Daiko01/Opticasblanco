import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Glasses, Sparkles, Search, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import API_BASE_URL from '../config';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProductosDestacadosHome() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [cargando, setCargando] = useState(true);
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/productos`)
      .then(r => r.json())
      .then(d => { setProductos(d); setCargando(false); })
      .catch(() => setCargando(false));
  }, []);

  const productosFiltrados = productos.filter(p => {
    if (filtro === 'todos') return true;
    const cat = (p.categoria || '').toLowerCase();
    if (filtro === 'opticos') return cat.includes('óptic') || cat.includes('optic') || cat.includes('receta') || cat.includes('lectura');
    if (filtro === 'sol') return cat.includes('sol') || cat.includes('sun');
    return true;
  }).slice(0, 10);

  const checkScrollButtons = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    // Reset scroll when filter changes
    el.scrollTo({ left: 0, behavior: 'instant' });
    // Wait a tick for DOM update then re-check
    requestAnimationFrame(checkScrollButtons);
  }, [filtro, cargando, checkScrollButtons]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScrollButtons, { passive: true });
    checkScrollButtons();
    const observer = new ResizeObserver(checkScrollButtons);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', checkScrollButtons);
      observer.disconnect();
    };
  }, [checkScrollButtons]);

  const scroll = (direction) => {
    const el = carouselRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('.carousel-item')?.offsetWidth || 280;
    const gap = 24;
    const scrollAmount = (cardWidth + gap) * 2;
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  const tabs = [
    { key: 'todos', label: 'Todos', icon: Sparkles },
    { key: 'opticos', label: 'Lentes Ópticos', icon: Glasses },
    { key: 'sol', label: 'Lentes de Sol', icon: Sparkles },
  ];

  return (
    <section ref={sectionRef} className="bg-slate-50 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-100 text-emerald-800 text-xs font-data uppercase tracking-widest mb-6 border border-emerald-200">
            Selección Destacada
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-emerald-950 tracking-tight mb-4">
            Productos <span className="font-drama italic text-emerald-700">destacados</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light">
            Los armazones más solicitados por nuestros clientes. Disponibles en todas nuestras sucursales.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setFiltro(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-4xl text-sm font-bold transition-all duration-300 ${
                  filtro === tab.key
                    ? 'bg-emerald-600 text-white shadow-organic-md'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-organic-md text-slate-400 hover:text-emerald-600 hover:border-emerald-300 transition-all duration-300 ${
              canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            } hidden md:flex`}
            aria-label="Anterior"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-organic-md text-slate-400 hover:text-emerald-600 hover:border-emerald-300 transition-all duration-300 ${
              canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            } hidden md:flex`}
            aria-label="Siguiente"
          >
            <ChevronRight size={22} />
          </button>

          {/* Fade edges */}
          <div className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none transition-opacity ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none transition-opacity ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />

          {/* Scrollable Track */}
          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-2 px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            <style>{`.carousel-track::-webkit-scrollbar { display: none; }`}</style>

            {cargando ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="carousel-item shrink-0 w-[260px] sm:w-[280px] md:w-[300px] organic-card overflow-hidden snap-start">
                  <div className="aspect-[4/3] w-full skeleton"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-5 skeleton w-3/4"></div>
                    <div className="h-4 skeleton w-1/2"></div>
                  </div>
                </div>
              ))
            ) : productosFiltrados.length === 0 ? (
              <div className="shrink-0 w-full text-center py-16 organic-card border-dashed !border-slate-300">
                <Search size={40} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-400 font-medium">No hay productos en esta categoría aún.</p>
              </div>
            ) : productosFiltrados.map(producto => (
              <Link
                key={producto.id}
                to={`/producto/${producto.id}`}
                className="carousel-item shrink-0 w-[260px] sm:w-[280px] md:w-[300px] organic-card overflow-hidden group block snap-start"
              >
                <div className="relative overflow-hidden aspect-[4/3] bg-white">
                  {producto.imagen_url ? (
                    <img
                      src={producto.imagen_url}
                      alt={producto.nombre}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <Glasses size={48} />
                    </div>
                  )}
                  {producto.categoria && (
                    <span className="absolute top-3 left-3 bg-emerald-100 text-emerald-800 text-[10px] font-data uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-200">
                      {producto.categoria}
                    </span>
                  )}
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="text-base font-heading font-bold text-emerald-950 mb-1 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {producto.nombre}
                  </h3>
                  {producto.marca && (
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-data mb-3">
                      {producto.marca}
                    </p>
                  )}
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-full font-data border border-emerald-200">
                    Consultar disponibilidad
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* See all CTA */}
        <div className="text-center mt-12">
          <Link
            to="/catalogo"
            className="btn-magnetic inline-flex items-center gap-2 bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold px-8 py-3.5 rounded-4xl transition-all duration-300 shadow-organic-sm hover:shadow-organic-md group"
          >
            Ver catálogo completo
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
