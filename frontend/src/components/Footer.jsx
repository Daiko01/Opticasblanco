import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ChevronRight, Store, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-100 mt-16 relative overflow-hidden rounded-t-[3rem]">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-900/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand */}
          <div className="space-y-6 text-center md:text-left flex flex-col items-center md:items-start">
            <h3 className="text-3xl font-heading font-extrabold text-white tracking-tight">
              Ópticas <span className="font-drama italic text-emerald-300">Blanco</span>
            </h3>
            <p className="text-emerald-200/50 text-sm leading-relaxed md:pr-4 max-w-sm md:max-w-none">
              Tu salud visual es nuestra pasión. Profesionales especializados, tecnología de punta y las mejores marcas internacionales.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <a href="https://www.instagram.com/opticasblanco/" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-200/50 hover:bg-emerald-600 hover:text-white transition-all duration-300 link-lift border border-white/5 hover:border-emerald-600">
                <Instagram size={18} />
              </a>
              <a href="https://www.facebook.com/p/Opticas-Blanco-100030708866709/?locale=es_LA" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-200/50 hover:bg-emerald-600 hover:text-white transition-all duration-300 link-lift border border-white/5 hover:border-emerald-600">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Sucursales */}
          <div className="lg:col-span-2 text-center md:text-left">
            <h4 className="text-white font-heading font-bold text-sm uppercase tracking-widest mb-6 flex items-center justify-center md:justify-start gap-2">
              <Store size={16} className="text-emerald-400" /> Nuestras Sucursales
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="group">
                <h5 className="text-emerald-400 font-bold mb-1 flex items-center gap-1.5"><MapPin size={14} /> Viña del Mar</h5>
                <p className="text-emerald-200/40 text-sm leading-relaxed pl-5 group-hover:text-emerald-200/70 transition-colors">Galería Rapallo<br />Av. Valparaíso 518, Local 2</p>
              </div>
              <div className="group">
                <h5 className="text-emerald-400 font-bold mb-1 flex items-center gap-1.5"><MapPin size={14} /> Quilpué</h5>
                <p className="text-emerald-200/40 text-sm leading-relaxed pl-5 group-hover:text-emerald-200/70 transition-colors">Calle Blanco 992-B</p>
              </div>
              <div className="group">
                <h5 className="text-emerald-400 font-bold mb-1 flex items-center gap-1.5"><MapPin size={14} /> La Calera</h5>
                <p className="text-emerald-200/40 text-sm leading-relaxed pl-5 group-hover:text-emerald-200/70 transition-colors">Carrera 988<br />esq. Huici</p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-heading font-bold text-sm uppercase tracking-widest mb-6">Información</h4>
            <ul className="space-y-4 text-sm flex flex-col items-center md:items-start">
              <li>
                <div className="flex items-start gap-3">
                  <Clock className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <span className="block text-white font-medium mb-0.5">Horarios</span>
                    <span className="text-emerald-200/40">Lun-Vie 9:00 - 19:00<br/>Sáb 10:00 - 14:00</span>
                  </div>
                </div>
              </li>
              <li>
                <a href="mailto:contacto@opticasblanco.cl" className="flex items-center gap-3 group">
                  <Mail className="text-emerald-400 shrink-0 group-hover:text-white transition-colors" size={16} />
                  <span className="text-emerald-200/40 group-hover:text-emerald-300 transition-colors">contacto@opticasblanco.cl</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3">
                  <Phone className="text-emerald-400 shrink-0" size={16} />
                  <span className="text-emerald-200/40">+56 9 7587 9294</span>
                </div>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-white/5 w-full">
              <ul className="space-y-2 text-sm font-medium flex flex-col items-center md:items-start">
                <li><Link to="/" className="text-emerald-200/40 hover:text-emerald-300 transition-colors flex items-center gap-1 group link-lift"><ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /> Inicio</Link></li>
                <li><Link to="/catalogo" className="text-emerald-200/40 hover:text-emerald-300 transition-colors flex items-center gap-1 group link-lift"><ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /> Catálogo</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-emerald-200/25 font-data tracking-wide">
          <p>© {new Date().getFullYear()} Ópticas Blanco. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="font-data text-[10px] uppercase tracking-widest text-emerald-200/35">Sistema Operativo</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
