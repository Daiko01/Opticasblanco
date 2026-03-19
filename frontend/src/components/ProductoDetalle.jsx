import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Package, ArrowLeft, Glasses, Search, CalendarDays, AlertTriangle, MessageCircle, Ruler, X, Users, CheckCircle2, Map, ChevronLeft, ChevronRight } from 'lucide-react';
import API_BASE_URL from '../config';

export default function ProductoDetalle({ onAbrirReserva }) {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showStoresModal, setShowStoresModal] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [sucursales, setSucursales] = useState([]);
  
  // Procesar galería de imágenes de forma segura para usarla en el useEffect
  let galeria = [];
  if (producto?.imagen_url) galeria.push(producto.imagen_url);
  if (producto?.imagenes_secundarias) {
    const extras = producto.imagenes_secundarias.split(',').map(u => u.trim()).filter(u => u);
    galeria = [...galeria, ...extras];
  }

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [lightboxPan, setLightboxPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [initialDistance, setInitialDistance] = useState(null);
  const [initialZoom, setInitialZoom] = useState(1);

  const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handlePointerDown = (clientX, clientY) => {
    setIsDragging(true);
    setStartPan({ x: clientX - lightboxPan.x, y: clientY - lightboxPan.y });
  };

  const handlePointerMove = (clientX, clientY) => {
    if (!isDragging) return;
    setLightboxPan({ x: clientX - startPan.x, y: clientY - startPan.y });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const resetLightboxTransforms = () => {
    setLightboxZoom(1);
    setLightboxPan({ x: 0, y: 0 });
  };

  // Bloquear scroll y escuchar Escape cuando Lightbox abierto
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') {
         setLightboxIndex((prev) => (prev === 0 ? galeria.length - 1 : prev - 1));
         resetLightboxTransforms();
      }
      if (e.key === 'ArrowRight') {
         setLightboxIndex((prev) => (prev === galeria.length - 1 ? 0 : prev + 1));
         resetLightboxTransforms();
      }
    };
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen]);
  
  const carouselRef = useRef(null);
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll al inicio al cambiar de producto
    // Ejecutar asincrónicamente para evitar warnings de render en cascada síncrono de React
    setTimeout(() => {
      setCargando(true);
      // Generar un número de visualizaciones aleatorias entre 3 y 14
      setViewers(Math.floor(Math.random() * 12) + 3);
    }, 0);

    fetch(`${API_BASE_URL}/productos/${id}`)
      .then(r => r.json())
      .then(data => { 
        setProducto(data); 
        setImagenSeleccionada(data.imagen_url);
        
        // Cargar todos los productos para filtrar relacionados
        fetch(`${API_BASE_URL}/productos`)
          .then(r => r.json())
          .then(allProductos => {
            if (data && !data.mensaje) {
               let rel = allProductos.filter(p => p.id !== data.id && p.categoria === data.categoria);
               if (rel.length === 0) {
                 rel = allProductos.filter(p => p.id !== data.id).sort(() => 0.5 - Math.random());
               }
               setRelacionados(rel.slice(0, 4));
            }
            setCargando(false);
          })
          .catch(() => setCargando(false));
      })
      .catch(() => setCargando(false));

    // Cargar sucursales globlamente para el modal de WhatsApp
    fetch(`${API_BASE_URL}/sucursales`)
      .then(r => r.json())
      .then(data => setSucursales(data))
      .catch(e => console.error("Error cargando sucursales para WhatsApp:", e));
  }, [id]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transformOrigin: 'center center', transform: 'scale(1)' });
  };

  const getWhatsAppLink = (sucursal) => {
    const num = (sucursal.whatsapp_numero || '').replace(/\D/g, '');
    if (!num) return null;
    const link = `${window.location.origin}/producto/${producto?.id}`;
    const msg = `Hola estaba viendo los ${producto?.nombre} ${producto?.sku ? `(${producto.sku}) ` : ''}quería hacer una consulta. Puedes verlo aquí: ${link}`;
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  };

  const getWhatsAppAsesoriaLink = () => {
    const conNum = sucursales.find(s => s.whatsapp_numero);
    const num = conNum ? conNum.whatsapp_numero.replace(/\D/g, '') : '';
    if (!num) return null;
    const link = `${window.location.origin}/producto/${producto?.id}`;
    const msg = `Reserva de Asesoría Visual: ¡Hola! Estaba viendo los lentes ${producto?.nombre} ${producto?.sku ? `(${producto.sku}) ` : ''}y tengo algunas dudas sobre cuál es mi talla o qué tipo de lente le viene mejor a mi rostro. Aquí el modelo: ${link}`;
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  };

  if (cargando) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!producto || producto.mensaje) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="mb-4 text-gray-400">
          <Search size={64} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Producto no encontrado</h2>
        <Link to="/catalogo" className="text-emerald-500 font-medium hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 md:px-12 md:py-16 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Izquierda: Imagen y Galería (7 columnas en LG) */}
        <div className="lg:col-span-7 flex flex-col gap-6 sticky top-24">
          <div 
            className="bg-[#f8f9fa] dark:bg-gray-800/80 rounded-[3rem] overflow-hidden aspect-square md:aspect-[4/3] flex items-center justify-center border border-gray-100 dark:border-gray-800 relative group cursor-zoom-in shadow-sm"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const idx = galeria.indexOf(imagenSeleccionada);
              setLightboxIndex(idx !== -1 ? idx : 0);
              setLightboxOpen(true);
              resetLightboxTransforms();
            }}
          >
            {imagenSeleccionada ? (
              <img 
                src={imagenSeleccionada} 
                alt={producto.nombre} 
                className="w-full h-full object-contain p-8 md:p-16 relative z-10 transition-transform duration-300 ease-out mix-blend-multiply dark:mix-blend-normal hover:scale-105" 
                style={zoomStyle}
              />
            ) : (
               <div className="text-gray-300 dark:text-gray-600">
                <Glasses size={120} />
              </div>
            )}
            {/* Sombra ambient light detrás de la imagen si existe */}
            {imagenSeleccionada && (
              <div 
                className="absolute inset-10 blur-3xl opacity-20 z-0 bg-cover bg-center rounded-full" 
                style={{ backgroundImage: `url('${imagenSeleccionada}')` }}
              ></div>
            )}
          </div>
          
          {/* Miniaturas de la Galería */}
          {galeria.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar snap-x">
              {galeria.map((imgUrl, i) => (
                <button 
                  key={i}
                  onClick={() => setImagenSeleccionada(imgUrl)}
                  className={`flex-none w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 bg-[#f8f9fa] dark:bg-gray-800 snap-center ${
                    imagenSeleccionada === imgUrl 
                      ? 'border-emerald-500 shadow-md transform -translate-y-1' 
                      : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <img src={imgUrl} alt={`${producto.nombre} thumbnail ${i+1}`} className="w-full h-full object-contain p-2 mix-blend-multiply dark:mix-blend-normal" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Derecha: Info del producto (5 columnas en LG) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          {/* Categoría y SKU */}
          {(producto.categoria || producto.sku) && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {producto.categoria && (
                  <span className="inline-flex items-center bg-gray-900 dark:bg-emerald-400 text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-sm">
                    {producto.categoria}
                  </span>
                )}
                {producto.sku && (
                  <span className="text-xs font-mono font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                    SKU: {producto.sku}
                  </span>
                )}
              </div>
              <button 
                onClick={() => setShowSizeGuide(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-full shadow-sm"
              >
                <Ruler size={14} /> Guía de Tallas
              </button>
            </div>
          )}

          {/* Nombre y Marca */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4 leading-[1.1] tracking-tight">
              {producto.nombre}
            </h1>
            {producto.marca && (
              <p className="text-xl text-gray-400 dark:text-gray-500 flex items-center gap-2 font-medium">
                by <span className="font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest text-lg">{producto.marca}</span>
              </p>
            )}
          </div>

          {/* Personas viendo (Social Proof) */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-emerald-50/50 dark:bg-emerald-900/10 px-4 py-2 rounded-xl border border-emerald-100/50 dark:border-emerald-800/30">
               <div className="relative flex h-2.5 w-2.5">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
               </div>
               <p><strong className="text-gray-900 dark:text-white font-bold">{viewers} personas</strong> están viendo este modelo</p>
            </div>
          </div>

          {/* Descripción */}
          {producto.descripcion && (
            <div className="mb-12 bg-gray-50/50 dark:bg-gray-800/20 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800/50">
              <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Acerca de este modelo</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg font-medium">{producto.descripcion}</p>
            </div>
          )}

          {/* Botones de Acción Múltiple */}
          <div className="space-y-4">
            {/* CTA Principal */}
            <button
              onClick={onAbrirReserva}
              className="w-full bg-gray-900 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white font-extrabold text-lg py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 group"
            >
              <CalendarDays size={24} className="group-hover:scale-110 transition-transform" />
              Agendar Evaluación Visual
            </button>

            {/* CTA Secundario (WhatsApp) */}
            <button 
              onClick={() => setShowStoresModal(true)}
              className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold text-lg py-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 flex items-center justify-center gap-3 hover:border-emerald-500 dark:hover:border-emerald-500 group"
            >
              <MessageCircle size={24} className="text-emerald-500 group-hover:scale-110 transition-transform" />
              Hacer una consulta por WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Sección También te podría gustar */}
      {relacionados.length > 0 && (
        <div className="mt-24 pt-16 border-t border-gray-200 dark:border-gray-800">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">También te podría gustar</h2>
            <p className="text-gray-500 dark:text-gray-400">Descubre otros modelos similares recomendados para ti</p>
          </div>
          
          <div className="relative group/carousel">
            {/* Controles del Carrusel (Mobile) */}
            <button 
              onClick={() => scrollCarousel('left')}
              className="absolute left-0 top-[40%] -translate-y-1/2 -ml-2 sm:-ml-4 z-20 sm:hidden bg-white/95 dark:bg-gray-800/95 text-gray-800 dark:text-gray-200 p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all opacity-90"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scrollCarousel('right')}
              className="absolute right-0 top-[40%] -translate-y-1/2 -mr-2 sm:-mr-4 z-20 sm:hidden bg-white/95 dark:bg-gray-800/95 text-gray-800 dark:text-gray-200 p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all opacity-90"
            >
              <ChevronRight size={24} />
            </button>

            <div 
              ref={carouselRef}
              className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory pb-6 custom-scrollbar px-4 sm:px-0"
            >
              {relacionados.map(rel => (
                <Link key={rel.id} to={`/producto/${rel.id}`} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:-translate-y-2 flex flex-col h-full min-w-[55vw] max-w-[240px] sm:min-w-0 sm:max-w-none snap-center shrink-0">
                {/* Imagen */}
                <div className="relative overflow-hidden aspect-square bg-gray-50 dark:bg-gray-900 p-4">
                  {rel.imagen_url ? (
                    <img 
                      src={rel.imagen_url} 
                      alt={rel.nombre} 
                      className="w-full h-full object-contain p-2 rounded-xl group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                      <Glasses size={48} opacity={0.5} />
                    </div>
                  )}
                  {/* Badge de categoría rápida */}
                  {rel.categoria && (
                    <span className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm">
                      {rel.categoria}
                    </span>
                  )}
                </div>

                {/* Info rápida */}
                <div className="p-5 flex flex-col flex-1 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                      {rel.nombre}
                    </h3>
                    {rel.marca && (
                      <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">
                        {rel.marca}
                      </p>
                    )}
                  </div>
                  
                  <div className="pt-3">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
                      Ver detalles →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          </div>
        </div>
      )}

      {/* Modal / Popup de Guía de Tallas */}
      {showSizeGuide && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowSizeGuide(false)}
          />
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-fade-in custom-scrollbar">
            {/* Header Modal */}
            <div className="sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <Ruler className="text-emerald-500" /> Guía de Tallas
              </h2>
              <button 
                onClick={() => setShowSizeGuide(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Contenido Modal */}
            <div className="p-6 md:p-8 space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Encuentra tu Ajuste Perfecto</h3>
                <p className="text-gray-500 dark:text-gray-400">La comodidad óptica empieza por el tamaño correcto del armazón.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 text-center">
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-lg mb-1">Talla S</h4>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-3">Rostros Pequeños</p>
                  <span className="text-sm bg-white dark:bg-gray-800 px-3 py-1 rounded-full font-bold shadow-sm">48mm - 50mm</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-lg mb-1">Talla M</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-3">Rostros Estándar</p>
                  <span className="text-sm bg-white dark:bg-gray-700 px-3 py-1 rounded-full font-bold shadow-sm">51mm - 53mm</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-lg mb-1">Talla L</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-3">Rostros Amplios</p>
                  <span className="text-sm bg-white dark:bg-gray-700 px-3 py-1 rounded-full font-bold shadow-sm">54mm - 58mm</span>
                </div>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800/50 rounded-2xl p-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Glasses size={18} className="text-emerald-500" /> Tip para medir
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  Revisa en la varilla interior de tus lentes actuales. Verás una serie de tres números (ej: <strong className="text-gray-900 dark:text-white font-black">52</strong>-18-140). El **primer número** indica el ancho del lente (tu talla).
                </p>
                <div className="bg-gray-200 dark:bg-gray-700 h-[1px] w-full my-4"></div>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <strong>Lentes de Sol:</strong> Las gafas de sol tienden a ser más grandes (entre 55mm y 62mm es normal para dar mayor cobertura).
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <strong>El Ajuste:</strong> Tus ojos deben quedar centrados en el cristal para la mejor visión geométrica.
                  </li>
                </ul>
              </div>

              {/* Contacto Directo Whatsapp Asesoria */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center shadow-lg">
                <h4 className="text-xl font-bold mb-2">¿Aún tienes dudas con tu talla?</h4>
                <p className="text-green-50 text-sm mb-5 text-balance mx-auto">
                  Nuestro equipo de asesores de imagen óptica te ayudará a encontrar el modelo perfecto según la forma de tu rostro.
                </p>
                <a 
                  href={getWhatsAppAsesoriaLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-emerald-700 hover:bg-gray-50 font-bold py-3 px-6 rounded-xl w-full inline-flex items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-xl"
                >
                  <MessageCircle size={20} />
                  Solicitar Asesoría por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal / Slide-over de Disponibilidad de Tiendas */}
      {showStoresModal && createPortal(
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowStoresModal(false)}
          />
          <div className="bg-white dark:bg-gray-900 w-full max-w-md h-full relative z-10 shadow-2xl flex flex-col animate-slide-left">
            {/* Header Modal */}
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 sticky top-0">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageCircle className="text-emerald-500" /> Consultar disponibilidad
              </h2>
              <button 
                onClick={() => setShowStoresModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Contenido Slide-over */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 leading-tight">Elige tu sucursal para consultar</h3>
                <p className="text-emerald-600 dark:text-emerald-400 font-black">{producto.nombre}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Te conectamos directo por WhatsApp con nosotros según tu ubicación.</p>
              </div>

              <div className="space-y-4">
                {sucursales.map((s, i) => {
                  const waLink = getWhatsAppLink(s);
                  return (
                    <div key={i} className="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-white dark:bg-gray-700 md:p-2 p-1.5 rounded-lg shadow-sm">
                          <Map className="text-emerald-500 w-5 h-5" />
                        </div>
                        <span className="font-extrabold text-gray-900 dark:text-white text-lg">{s.nombre}</span>
                      </div>
                      {waLink ? (
                        <a 
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-900 hover:bg-emerald-500 dark:bg-gray-700 dark:hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 w-full text-sm shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                        >
                          <MessageCircle size={16} /> Consultar por WhatsApp
                        </a>
                      ) : (
                        <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg text-center font-medium">
                          ⚠️ Número temporalmente fuera de servicio.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
               <button
                  onClick={onAbrirReserva}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <CalendarDays size={18} /> Agendar Evaluación Visual
               </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && createPortal(
        <div 
          id="lightbox-bg"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in overflow-hidden touch-none select-none"
          onClick={(e) => {
            if (e.target.id === 'lightbox-bg') setLightboxOpen(false);
          }}
        >
          {/* Botón Cerrar */}
          <button 
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all"
            title="Cerrar (Esc)"
          >
            <X size={32} />
          </button>

          {/* Navegación Anterior */}
          {galeria.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev === 0 ? galeria.length - 1 : prev - 1));
                resetLightboxTransforms();
              }}
              className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-2 sm:p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all"
            >
              <ChevronLeft size={36} />
            </button>
          )}

          {/* Navegación Siguiente */}
          {galeria.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev === galeria.length - 1 ? 0 : prev + 1));
                resetLightboxTransforms();
              }}
              className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-2 sm:p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all"
            >
              <ChevronRight size={36} />
            </button>
          )}

          {/* Contenedor de Imagen Arrastrable */}
          <div 
            className="w-full h-full flex items-center justify-center"
            id="lightbox-bg"
          >
             <img 
               src={galeria[lightboxIndex]} 
               alt={`Vista ampliada ${lightboxIndex + 1}`} 
               className="max-w-full max-h-[85vh] object-contain cursor-grab active:cursor-grabbing will-change-transform"
               style={{ 
                 transform: `translate(${lightboxPan.x}px, ${lightboxPan.y}px) scale(${lightboxZoom})`,
                 transition: isDragging ? 'none' : 'transform 0.1s ease-out'
               }}
               draggable="false"
               onWheel={(e) => {
                 const scaleChange = e.deltaY * -0.002;
                 setLightboxZoom((z) => Math.min(Math.max(1, z + scaleChange), 5));
               }}
               onMouseDown={(e) => { e.preventDefault(); handlePointerDown(e.clientX, e.clientY); }}
               onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
               onMouseUp={handlePointerUp}
               onMouseLeave={handlePointerUp}
               onTouchStart={(e) => {
                 if (e.touches.length === 2) {
                   setInitialDistance(getDistance(e.touches));
                   setInitialZoom(lightboxZoom);
                 } else if (e.touches.length === 1) {
                   handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
                 }
               }}
               onTouchMove={(e) => {
                 if (e.touches.length === 2 && initialDistance) {
                   const newDistance = getDistance(e.touches);
                   const scaleChange = newDistance / initialDistance;
                   setLightboxZoom(Math.min(Math.max(1, initialZoom * scaleChange), 5));
                 } else if (e.touches.length === 1) {
                   handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
                 }
               }}
               onTouchEnd={(e) => {
                 setInitialDistance(null);
                 handlePointerUp();
               }}
               onDoubleClick={(e) => {
                 e.stopPropagation();
                 if (lightboxZoom > 1) {
                    resetLightboxTransforms();
                 } else {
                    setLightboxZoom(2);
                 }
               }}
             />
             
             {/* Indicador */}
             {galeria.length > 1 && (
               <div className="absolute bottom-6 sm:bottom-10 text-white/80 font-medium text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm pointer-events-none z-50">
                 {lightboxIndex + 1} / {galeria.length}
               </div>
             )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
