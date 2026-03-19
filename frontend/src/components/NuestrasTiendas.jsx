import { MapPin, Phone, Clock, Navigation, LocateFixed, MessageCircle } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function NuestrasTiendas() {
  const tiendas = [
    { nombre: "Sucursal Viña del Mar", direccion: "Av. Valparaíso 518 local 2 galería rapallo.", comuna: "Viña del Mar, Región de Valparaíso", horario: "Lun a Vie: 10:00 - 19:00 | Sáb: 10:00 - 14:00", fijo: "32-2691515", whatsapp: "+56 9 9176 2935", imagen: "https://lh3.googleusercontent.com/p/AF1QipPhh_vJHzrlUcL9eVjGoC1claDG8NVrF_SJBMcQ=w408-h406-k-no", mapQuery: "Av.+Valparaíso+518,+Viña+del+Mar,+Valparaíso,+Chile" },
    { nombre: "Sucursal Quilpué", direccion: "Calle Blanco 992-B", comuna: "Quilpué, Región de Valparaíso", horario: "Lun a Vie: 10:00 - 19:00 | Sáb: 10:00 - 14:00", fijo: "32-3538907", whatsapp: "+56 9 7440 8675", imagen: "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=PuZTT4xM4-_hgvmqvfVWGg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=185.20148&pitch=0&thumbfov=100", mapQuery: "Blanco+Encalada+992,+Quilpué,+Valparaíso,+Chile" },
    { nombre: "Sucursal La Calera", direccion: "Calle carrera 988 esq. Huici.", comuna: "La Calera, Región de Valparaíso", horario: "Lun a Vie: 10:00 - 19:00 | Sáb: 10:00 - 14:00", fijo: "32-33830734", whatsapp: "+56 9 6706 8446", imagen: "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=MYyV8HKf7RzBnpYPANWD4w&cb_client=search.gws-prod.gps&w=408&h=240&yaw=141.82297&pitch=0&thumbfov=100", mapQuery: "Carrera+988,+La+Calera,+Valparaíso,+Chile" },
  ];

  return (
    <div className="pt-24 md:pt-28 pb-16 md:pb-24 max-w-7xl mx-auto px-6">
      <ScrollReveal className="text-center mb-16">
        <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-100 text-emerald-800 text-xs font-data uppercase tracking-widest mb-6 border border-emerald-200">Nuestra Presencia en la V Región</span>
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-emerald-950 mb-6 tracking-tight">
          Nuestras <span className="font-drama italic text-emerald-700">Sucursales</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light">Encuentra la sucursal más cercana.</p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiendas.map((tienda, idx) => (
          <ScrollReveal key={idx} className="organic-card-v2 overflow-hidden flex flex-col">
            <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url('${tienda.imagen}')` }}></div>
            <div className="p-8 flex flex-col flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-600 text-white p-2.5 rounded-4xl shadow-organic-sm"><MapPin size={22} /></div>
                <div>
                  <h2 className="text-xl font-heading font-bold text-emerald-950 leading-tight">{tienda.nombre}</h2>
                  <p className="text-emerald-600 font-bold text-sm font-data">{tienda.comuna}</p>
                </div>
              </div>
              <div className="space-y-5 flex-1 mb-8">
                <div className="flex items-start gap-3"><MapPin size={18} className="text-emerald-700 mt-1 shrink-0" /><div><p className="text-xs text-slate-900 uppercase tracking-wider font-bold font-data mb-1">Dirección</p><p className="text-slate-800 font-bold">{tienda.direccion}</p></div></div>
                <div className="flex items-start gap-3"><Clock size={18} className="text-emerald-700 mt-1 shrink-0" /><div><p className="text-xs text-slate-900 uppercase tracking-wider font-bold font-data mb-1">Horario</p><p className="text-slate-800 font-bold">{tienda.horario}</p></div></div>
                <div className="flex items-start gap-3"><MessageCircle size={18} className="text-emerald-700 mt-1 shrink-0" /><div><p className="text-xs text-slate-900 uppercase tracking-wider font-bold font-data mb-1">WhatsApp</p><p className="text-slate-800 font-bold">{tienda.whatsapp}</p></div></div>
                {tienda.fijo && (
                  <div className="flex items-start gap-3"><Phone size={18} className="text-emerald-700 mt-1 shrink-0" /><div><p className="text-xs text-slate-900 uppercase tracking-wider font-bold font-data mb-1">Teléfono Fijo</p><p className="text-slate-800 font-bold">{tienda.fijo}</p></div></div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <a href={`https://www.google.com/maps/search/?api=1&query=${tienda.mapQuery}`} target="_blank" rel="noopener noreferrer"
                  className="btn-magnetic flex items-center justify-center gap-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold py-3 px-2 rounded-4xl transition-all text-sm border border-slate-200 hover:border-emerald-300">
                  <Navigation size={16} className="text-emerald-600" /> Maps
                </a>
                <a href={`https://waze.com/ul?q=${tienda.mapQuery}`} target="_blank" rel="noopener noreferrer"
                  className="btn-magnetic flex items-center justify-center gap-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold py-3 px-2 rounded-4xl transition-all text-sm border border-slate-200 hover:border-emerald-300">
                  <LocateFixed size={16} className="text-emerald-600" /> Waze
                </a>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
