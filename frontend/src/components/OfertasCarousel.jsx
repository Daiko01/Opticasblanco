import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    imagen: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&q=80&w=1600',
    alt: 'Gafas de sol de verano en la playa',
    badge: '🌞 Temporada Verano',
    titulo: 'Colección Verano 2025',
    subtitulo: 'Los modelos más buscados de la temporada',
    oferta: '20% OFF',
    ofertaDetalle: 'En toda la línea solar',
    cta: { label: 'Ver Ofertas', href: '/catalogo?categoria=solar' },
    gradiente: 'from-amber-900/80 via-orange-800/50 to-transparent',
    acento: 'bg-amber-400 text-amber-900',
    acentoTexto: 'text-amber-300',
  },
  {
    id: 2,
    imagen: 'https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?auto=format&fit=crop&q=80&w=1600',
    alt: 'Especialista realizando examen visual',
    badge: '👁️ Servicio Especial',
    titulo: 'Examen Visual Gratis',
    subtitulo: 'Con la compra de cualquier armazón de nuestra colección',
    oferta: '$0',
    ofertaDetalle: 'Evaluación computarizada incluida',
    cta: { label: 'Reservar Ahora', href: null, action: 'reservar' },
    gradiente: 'from-emerald-900/80 via-emerald-800/50 to-transparent',
    acento: 'bg-emerald-400 text-emerald-900',
    acentoTexto: 'text-emerald-300',
  },
  {
    id: 3,
    imagen: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=1600',
    alt: 'Armazones Ray-Ban clásicos aviador',
    badge: '⭐ Marca Destacada',
    titulo: 'Ray-Ban Aviator Clásico',
    subtitulo: 'El ícono atemporal que nunca pasa de moda',
    oferta: 'Consulta',
    ofertaDetalle: 'Disponibilidad por WhatsApp',
    cta: { label: 'Ver Modelos', href: '/catalogo?marca=Ray-Ban' },
    gradiente: 'from-gray-900/85 via-gray-800/50 to-transparent',
    acento: 'bg-red-400 text-white',
    acentoTexto: 'text-red-300',
  },
  {
    id: 4,
    imagen: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=1600',
    alt: 'Selección de armazones coloridos para niños',
    badge: '🎒 Nueva Colección',
    titulo: 'Colección Infantil',
    subtitulo: 'Diseños divertidos y seguros para los más pequeños',
    oferta: '2×1',
    ofertaDetalle: 'En segunda unidad de montura infantil',
    cta: { label: 'Ver Colección', href: '/catalogo?categoria=infantil' },
    gradiente: 'from-purple-900/80 via-purple-800/50 to-transparent',
    acento: 'bg-purple-400 text-white',
    acentoTexto: 'text-purple-300',
  },
];

const AUTOPLAY_INTERVAL = 5000;

export default function OfertasCarousel({ onAbrirReserva }) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((newIndex, direction) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIndex(newIndex);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const prev = useCallback(() => {
    goTo((index - 1 + slides.length) % slides.length);
  }, [index, goTo]);

  const next = useCallback(() => {
    goTo((index + 1) % slides.length);
  }, [index, goTo]);

  // Autoplay
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const slide = slides[index];

  return (
    <section
      aria-label="Carrusel de ofertas y promociones"
      className="relative w-full h-[340px] md:h-[420px] overflow-hidden bg-gray-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Imagen de fondo */}
          <img
            src={s.imagen}
            alt={s.alt}
            className="absolute inset-0 w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
          {/* Overlay gradiente */}
          <div className={`absolute inset-0 bg-gradient-to-r ${s.gradiente}`} aria-hidden="true" />
          <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
        </div>
      ))}

      {/* Contenido del slide activo */}
      <div className="relative z-20 h-full flex items-center px-8 md:px-16 lg:px-24 max-w-5xl">
        <div
          key={index}
          className="animate-slide-up"
        >
          {/* Badge */}
          <span className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 ${slide.acento}`}>
            <Tag size={11} aria-hidden="true" />
            {slide.badge}
          </span>

          {/* Título */}
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-2 drop-shadow-lg max-w-xl">
            {slide.titulo}
          </h2>

          <p className="text-gray-200 text-sm md:text-base mb-5 max-w-md leading-relaxed">
            {slide.subtitulo}
          </p>

          {/* Oferta + CTA */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Precio / oferta destacado */}
            <div className={`flex flex-col leading-none border border-white/20 rounded-2xl px-4 py-3 backdrop-blur-sm bg-black/20`}>
              <span className={`text-2xl md:text-3xl font-black ${slide.acentoTexto}`}>
                {slide.oferta}
              </span>
              <span className="text-white/60 text-xs mt-0.5">{slide.ofertaDetalle}</span>
            </div>

            {/* Botón CTA */}
            {slide.cta.action === 'reservar' ? (
              <button
                onClick={onAbrirReserva}
                className="bg-white text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-emerald-50 hover:-translate-y-0.5 transition-all duration-200 shadow-lg text-sm"
              >
                {slide.cta.label} →
              </button>
            ) : (
              <Link
                to={slide.cta.href}
                className="bg-white text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-emerald-50 hover:-translate-y-0.5 transition-all duration-200 shadow-lg text-sm"
              >
                {slide.cta.label} →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Controles de navegación — flechas */}
      <button
        onClick={prev}
        aria-label="Oferta anterior"
        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white p-2.5 rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white"
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <button
        onClick={next}
        aria-label="Siguiente oferta"
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white p-2.5 rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white"
      >
        <ChevronRight size={20} aria-hidden="true" />
      </button>

      {/* Dots de navegación */}
      <div
        role="tablist"
        aria-label="Seleccionar oferta"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2"
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === index}
            aria-label={`Slide ${i + 1}: ${s.titulo}`}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === index
                ? 'w-8 h-2.5 bg-white'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Barra de progreso autoplay */}
      {!isPaused && (
        <div
          aria-hidden="true"
          key={`progress-${index}`}
          className="absolute bottom-0 left-0 z-30 h-[3px] bg-white/60"
          style={{
            animation: `slideProgress ${AUTOPLAY_INTERVAL}ms linear`,
          }}
        />
      )}

      <style>{`
        @keyframes slideProgress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
}
