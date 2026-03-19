import { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from './ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

export default function Contacto({ onAbrirReserva }) {
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', sucursal: '', mensaje: '' });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-anim-v2', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        opacity: 0, y: 40, duration: 0.7, ease: 'power3.out', stagger: 0.1,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviando(true);
    // Simulate send — in production connect to your backend
    setTimeout(() => {
      setEnviando(false);
      setEnviado(true);
      setFormData({ nombre: '', email: '', telefono: '', sucursal: '', mensaje: '' });
    }, 1500);
  };

  const handleWhatsApp = (numero, nombre) => {
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(`Hola, vengo de la página web y tengo una consulta sobre la sucursal ${nombre}.`)}`, '_blank');
  };

  const sucursales = [
    { nombre: 'Viña del Mar', direccion: 'Av. Valparaíso 518, Local 2, Galería Rapallo', fijo: '32-2691515', whatsapp: '56991762935', whatsappDisplay: '+56 9 9176 2935', horario: 'Lun-Vie: 10:00 - 19:00 · Sáb: 10:00 - 14:00', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Av.+Valparaíso+518,+Viña+del+Mar' },
    { nombre: 'Quilpué', direccion: 'Calle Blanco 992-B', fijo: '32-3538907', whatsapp: '56974408675', whatsappDisplay: '+56 9 7440 8675', horario: 'Lun-Vie: 10:00 - 19:00 · Sáb: 10:00 - 14:00', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Blanco+Encalada+992,+Quilpué' },
    { nombre: 'La Calera', direccion: 'Calle Carrera 988, esq. Huici', fijo: '32-33830734', whatsapp: '56967068446', whatsappDisplay: '+56 9 6706 8446', horario: 'Lun-Vie: 10:00 - 19:00 · Sáb: 10:00 - 14:00', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Carrera+988,+La+Calera' },
  ];

  return (
    <div ref={sectionRef} className="pt-24 md:pt-28 pb-16 md:pb-24">
      {/* Header */}
      <ScrollReveal className="max-w-6xl mx-auto px-6 text-center mb-16">
        <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-100 text-emerald-800 text-xs font-data uppercase tracking-widest mb-6 border border-emerald-200">
          Contáctanos
        </span>
        <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-emerald-950 mb-6 tracking-tight">
          Estamos aquí para <span className="font-drama italic text-emerald-700">ayudarte</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto font-light leading-relaxed">
          Escríbenos, llámanos o visítanos en cualquiera de nuestras sucursales. Tu salud visual es nuestra prioridad.
        </p>
      </ScrollReveal>

      {/* Quick Actions */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={onAbrirReserva}
            className="contact-anim-v2 organic-card-v2 p-6 md:p-8 text-center group hover:!border-emerald-300 transition-all flex flex-col items-center justify-center h-full"
          >
            <div className="w-14 h-14 bg-emerald-600 text-white rounded-4xl flex items-center justify-center mb-6 shadow-organic-sm group-hover:scale-105 transition-transform">
              <Clock size={24} />
            </div>
            <h3 className="font-heading font-bold text-emerald-950 mb-2">Reservar Hora</h3>
            <p className="text-sm text-slate-900 font-medium">Agenda tu examen visual</p>
          </button>

          <button
            onClick={() => handleWhatsApp('56991762935', 'Viña del Mar')}
            className="contact-anim-v2 organic-card-v2 p-6 md:p-8 text-center group hover:!border-emerald-300 transition-all flex flex-col items-center justify-center h-full"
          >
            <div className="w-14 h-14 bg-emerald-600 text-white rounded-4xl flex items-center justify-center mb-6 shadow-organic-sm group-hover:scale-105 transition-transform">
              <MessageCircle size={24} />
            </div>
            <h3 className="font-heading font-bold text-emerald-950 mb-2">WhatsApp</h3>
            <p className="text-sm text-slate-900 font-medium">Respuesta inmediata</p>
          </button>

          <a
            href="mailto:contacto@opticasblanco.cl"
            className="contact-anim-v2 organic-card-v2 p-6 md:p-8 text-center group hover:!border-emerald-300 transition-all block flex flex-col items-center justify-center h-full"
          >
            <div className="w-14 h-14 bg-emerald-600 text-white rounded-4xl flex items-center justify-center mb-6 shadow-organic-sm group-hover:scale-105 transition-transform">
              <Mail size={24} />
            </div>
            <h3 className="font-heading font-bold text-emerald-950 mb-2">Email</h3>
            <p className="text-sm text-emerald-950 font-bold">contacto@opticasblanco.cl</p>
          </a>
        </div>
      </div>

      {/* Form + Map Section */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Form */}
            <div className="lg:col-span-3 contact-anim-v2">
              <div className="organic-card-v2 p-8 md:p-10">
              <h2 className="text-2xl font-heading font-bold text-emerald-950 mb-2">Envíanos un mensaje</h2>
              <p className="text-slate-800 font-medium mb-8 text-sm">Completa el formulario y te responderemos a la brevedad.</p>

              {enviado ? (
                <div className="text-center py-12 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-4xl flex items-center justify-center mb-6 border border-emerald-200">
                    <CheckCircle2 size={40} className="text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-emerald-950 mb-3">¡Mensaje enviado!</h3>
                  <p className="text-slate-500 mb-8 max-w-sm mx-auto">Te responderemos a la brevedad. Revisa tu correo electrónico.</p>
                  <button onClick={() => setEnviado(false)} className="text-emerald-600 font-bold hover:text-emerald-700 link-lift">
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-emerald-950 mb-2">Nombre completo</label>
                      <input
                        type="text" required value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Tu nombre"
                        className="w-full bg-slate-50 border border-slate-200 rounded-4xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 outline-none transition-all font-medium text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-emerald-950 mb-2">Correo electrónico</label>
                      <input
                        type="email" required value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="tu@correo.cl"
                        className="w-full bg-slate-50 border border-slate-200 rounded-4xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 outline-none transition-all font-medium text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-emerald-950 mb-2">Teléfono <span className="text-slate-300 font-normal">(opcional)</span></label>
                      <input
                        type="tel" value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        placeholder="+56 9 1234 5678"
                        className="w-full bg-slate-50 border border-slate-200 rounded-4xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 outline-none transition-all font-medium text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-emerald-950 mb-2">Sucursal preferida</label>
                      <select
                        value={formData.sucursal}
                        onChange={(e) => setFormData({ ...formData, sucursal: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-4xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 outline-none transition-all font-medium text-sm appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.2em' }}
                      >
                        <option value="">Selecciona una sucursal</option>
                        <option value="vina">Viña del Mar</option>
                        <option value="quilpue">Quilpué</option>
                        <option value="calera">La Calera</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-emerald-950 mb-2">Mensaje</label>
                    <textarea
                      required value={formData.mensaje} rows={4}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      placeholder="Cuéntanos en qué podemos ayudarte..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-4xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 outline-none transition-all font-medium text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={enviando}
                    className="w-full btn-magnetic btn-slide bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-4xl transition-all shadow-organic-md hover:shadow-organic-lg disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {enviando ? (
                        <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enviando...</>
                      ) : (
                        <><Send size={18} /> Enviar Mensaje</>
                      )}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Info Sidebar */}
            <div className="lg:col-span-2 space-y-6 contact-anim-v2">
              {/* Map embed */}
              <div className="organic-card-v2 overflow-hidden">
              <iframe
                title="Ubicación Ópticas Blanco - Viña del Mar"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3345.8760978849835!2d-71.62424548481775!3d-33.040934080893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9689de6f7f8b1e1f%3A0x2a96b23e516c4f5!2sAv.%20Valpara%C3%ADso%20518%2C%20Vi%C3%B1a%20del%20Mar!5e0!3m2!1ses!2scl!4v1700000000000!5m2!1ses!2scl"
                width="100%" height="220" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-t-4xl"
              />
              <div className="p-5">
                <h3 className="font-heading font-bold text-emerald-950 mb-1">Sucursal Principal</h3>
                <p className="text-sm text-slate-900 font-medium">Av. Valparaíso 518, Viña del Mar</p>
              </div>
            </div>

            {/* Horarios */}
            <div className="organic-card-v2 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-4xl flex items-center justify-center border border-emerald-200">
                  <Clock size={18} className="text-emerald-700" />
                </div>
                <h3 className="font-heading font-bold text-emerald-950">Horarios de Atención</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-700 font-medium">Lunes a Viernes</span>
                  <span className="font-bold text-emerald-950 font-data">10:00 - 19:00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-700 font-medium">Sábado</span>
                  <span className="font-bold text-emerald-950 font-data">10:00 - 14:00</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-700 font-medium">Domingo</span>
                  <span className="font-bold text-slate-300 font-data">Cerrado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Branch Cards */}
      <div className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-emerald-950">
              Nuestras <span className="font-drama italic text-emerald-700">Sucursales</span>
            </h2>
            <p className="text-slate-900 mt-3 font-medium">Elige la más cercana para comunicarte directamente.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sucursales.map((suc, idx) => (
              <ScrollReveal key={idx}>
                <div className="organic-card-v2 p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="bg-emerald-600 text-white p-2.5 rounded-4xl shadow-organic-sm shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-emerald-950">{suc.nombre}</h3>
                      <p className="text-xs text-emerald-600 font-data font-bold">Sucursal</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-start gap-2.5">
                      <MapPin size={14} className="text-slate-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-slate-800">{suc.direccion}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MessageCircle size={14} className="text-slate-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-slate-800">{suc.whatsappDisplay}</span>
                    </div>
                    {suc.fijo && (
                      <div className="flex items-start gap-2.5">
                        <Phone size={14} className="text-slate-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-slate-800">{suc.fijo}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2.5">
                      <Clock size={14} className="text-slate-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-slate-800">{suc.horario}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button
                      onClick={() => handleWhatsApp(suc.whatsapp, suc.nombre)}
                      className="btn-magnetic flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2.5 rounded-4xl text-sm transition-all"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </button>
                    <a
                      href={suc.mapUrl} target="_blank" rel="noopener noreferrer"
                      className="btn-magnetic flex items-center justify-center gap-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold py-2.5 rounded-4xl text-sm border border-slate-200 hover:border-emerald-300 transition-all"
                    >
                      <MapPin size={14} /> Ver Mapa
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
