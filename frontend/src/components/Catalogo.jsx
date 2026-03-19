import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Glasses, LayoutGrid, Grid3X3, Grid2X2, Filter, X, CheckSquare, Square, ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import API_BASE_URL from '../config';

const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 py-1.5 cursor-pointer group">
    <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
    <div className={`${checked ? 'text-emerald-600' : 'text-slate-300'} group-hover:text-emerald-500 transition-colors`}>
      {checked ? <CheckSquare size={18} /> : <Square size={18} />}
    </div>
    <span className={`text-sm ${checked ? 'text-emerald-950 font-semibold' : 'text-slate-500'}`}>{label}</span>
  </label>
);

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [stock, setStock] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [soloConStock, setSoloConStock] = useState(false);
  const [estilosSeleccionados, setEstilosSeleccionados] = useState([]);
  const [edadesSeleccionadas, setEdadesSeleccionadas] = useState([]);
  const [generosSeleccionados, setGenerosSeleccionados] = useState([]);
  const [searchParams] = useSearchParams();
  const marcaPorUrl = searchParams.get('marca');
  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState(marcaPorUrl ? [marcaPorUrl] : []);
  const [orden, setOrden] = useState('recientes');
  const [columnas, setColumnas] = useState(3);
  const [mostrarFiltrosMobile, setMostrarFiltrosMobile] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 12;

  useEffect(() => { if (marcaPorUrl) setMarcasSeleccionadas(prev => prev.includes(marcaPorUrl) ? prev : [marcaPorUrl]); }, [marcaPorUrl]);
  useEffect(() => { setPaginaActual(1); }, [busqueda, categoriasSeleccionadas, marcasSeleccionadas, estilosSeleccionados, edadesSeleccionadas, generosSeleccionados, soloConStock, orden]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/productos`).then(r => r.json()).then(d => { setProductos(d); setCargando(false); }).catch(() => setCargando(false));
    fetch(`${API_BASE_URL}/stock`).then(r => r.json()).then(d => setStock(d)).catch(() => {});
  }, []);

  const stockPorProducto = useMemo(() => { const m = {}; stock.forEach(s => { if (!m[s.producto_id]) m[s.producto_id] = 0; m[s.producto_id] += s.cantidad; }); return m; }, [stock]);
  const categoriasUnicas = useMemo(() => [...new Set(productos.map(p => p.categoria || 'General'))], [productos]);
  const marcasUnicas = useMemo(() => [...new Set(productos.map(p => p.marca).filter(Boolean))], [productos]);

  const toggleArray = (setter, item) => setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);

  const productosProcesados = useMemo(() => {
    let f = productos.filter(p => {
      const sl = busqueda.toLowerCase();
      return ((p.nombre || '').toLowerCase().includes(sl) || (p.marca || '').toLowerCase().includes(sl))
        && (categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(p.categoria || 'General'))
        && (marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(p.marca))
        && (estilosSeleccionados.length === 0 || estilosSeleccionados.includes(p.estilo))
        && (edadesSeleccionadas.length === 0 || edadesSeleccionadas.includes(p.edad))
        && (generosSeleccionados.length === 0 || generosSeleccionados.includes(p.genero))
        && (!soloConStock || (stockPorProducto[p.id] || 0) > 0);
    });
    if (orden === 'az') f.sort((a, b) => a.nombre.localeCompare(b.nombre));
    return f;
  }, [productos, busqueda, categoriasSeleccionadas, marcasSeleccionadas, estilosSeleccionados, edadesSeleccionadas, generosSeleccionados, soloConStock, orden, stockPorProducto]);

  const gridClasses = { 2: 'grid-cols-2', 3: 'grid-cols-2 lg:grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' }[columnas];
  const indexUltimo = paginaActual * productosPorPagina;
  const productosPaginados = productosProcesados.slice(indexUltimo - productosPorPagina, indexUltimo);
  const totalPaginas = Math.ceil(productosProcesados.length / productosPorPagina);

  return (
    <div id="catalogo" className="max-w-7xl mx-auto p-4 md:p-8 scroll-mt-28 pt-24 md:pt-28">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-emerald-950 mb-2 tracking-tight">
            Nuestro <span className="font-drama italic text-emerald-700">Catálogo</span>
          </h2>
          <p className="text-slate-500 font-light">Encuentra el estilo perfecto para ti</p>
        </div>
        <div className="w-full md:w-96 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"><Search size={18} /></span>
          <input type="text" placeholder="Buscar por nombre o marca..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-4xl pl-12 pr-4 py-3 text-slate-800 focus:ring-2 focus:ring-emerald-500/30 outline-none shadow-organic-sm transition-all font-medium" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <button className="md:hidden flex items-center justify-center gap-2 bg-white text-slate-700 py-3 rounded-4xl font-bold border border-slate-200"
          onClick={() => setMostrarFiltrosMobile(!mostrarFiltrosMobile)}>
          <Filter size={18} /> {mostrarFiltrosMobile ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>

        <div className={`w-full md:w-64 shrink-0 space-y-4 md:sticky md:top-28 md:h-[calc(100vh-8rem)] md:overflow-y-auto custom-scrollbar md:pr-4 ${mostrarFiltrosMobile ? 'block' : 'hidden md:block'}`}>
          <div className="organic-card !rounded-4xl p-5">
            <h3 className="font-heading font-bold text-emerald-950 mb-3 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">Disponibilidad</h3>
            <Checkbox label="Solo en stock" checked={soloConStock} onChange={() => setSoloConStock(!soloConStock)} />
          </div>
          {categoriasUnicas.length > 0 && (
            <div className="organic-card !rounded-4xl p-5">
              <h3 className="font-heading font-bold text-emerald-950 mb-3 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">Categorías</h3>
              <div className="space-y-0.5">{categoriasUnicas.map(c => <Checkbox key={c} label={c} checked={categoriasSeleccionadas.includes(c)} onChange={() => toggleArray(setCategoriasSeleccionadas, c)} />)}</div>
            </div>
          )}
          {marcasUnicas.length > 0 && (
            <div className="organic-card !rounded-4xl p-5">
              <h3 className="font-heading font-bold text-emerald-950 mb-3 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">Marcas</h3>
              <div className="space-y-0.5 max-h-64 overflow-y-auto pr-2 custom-scrollbar">{marcasUnicas.map(m => <Checkbox key={m} label={m} checked={marcasSeleccionadas.includes(m)} onChange={() => toggleArray(setMarcasSeleccionadas, m)} />)}</div>
            </div>
          )}
          {['Estilo', 'Público', 'Género'].map((title, gi) => {
            const items = [['Clásico','Deportivo','Fashion'],['Adultos','Adolescentes','Niños'],['Hombre','Mujer','Unisex']][gi];
            const [sel, setter] = [[estilosSeleccionados, setEstilosSeleccionados],[edadesSeleccionadas, setEdadesSeleccionadas],[generosSeleccionados, setGenerosSeleccionados]][gi];
            return (
              <div key={title} className="organic-card !rounded-4xl p-5">
                <h3 className="font-heading font-bold text-emerald-950 mb-3 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">{title}</h3>
                <div className="space-y-0.5">{items.map(item => <Checkbox key={item} label={item} checked={sel.includes(item)} onChange={() => toggleArray(setter, item)} />)}</div>
              </div>
            );
          })}
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 organic-card !rounded-4xl p-4">
            <div className="text-sm text-slate-400 font-data">Mostrando <span className="text-emerald-950 font-bold">{productosProcesados.length}</span> productos</div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <select value={orden} onChange={(e) => setOrden(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-2xl focus:ring-emerald-500 block w-full sm:w-auto p-2.5 outline-none font-medium appearance-none pr-8"
                style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.2em' }}>
                <option value="recientes">Más Recientes</option>
                <option value="az">Alfabético (A-Z)</option>
              </select>
              <div className="hidden md:flex bg-slate-50 p-1 rounded-2xl border border-slate-200">
                {[2,3,4].map(n => (
                  <button key={n} onClick={() => setColumnas(n)} className={`p-1.5 rounded-xl transition-colors ${columnas === n ? 'bg-white text-emerald-600 shadow-organic-sm' : 'text-slate-300 hover:text-slate-500'}`}>
                    {n === 2 ? <LayoutGrid size={18} /> : n === 3 ? <Grid3X3 size={18} /> : <Grid2X2 size={18} className="scale-125" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`grid ${gridClasses} gap-4 sm:gap-6`}>
            {cargando ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="organic-card overflow-hidden">
                <div className="aspect-[4/3] w-full skeleton"></div>
                <div className="p-5 space-y-3"><div className="h-5 skeleton w-3/4"></div><div className="h-4 skeleton w-1/2"></div></div>
              </div>
            )) : productosPaginados.map(producto => (
              <ScrollReveal key={producto.id} className="h-full">
                <Link to={`/producto/${producto.id}`} className="group organic-card overflow-hidden block flex flex-col h-full">
                  <div className="relative overflow-hidden aspect-[4/3] bg-slate-50">
                    {producto.imagen_url ? (
                      <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200"><Glasses size={64} opacity={0.5} /></div>
                    )}
                    {producto.categoria && (
                      <span className="absolute top-3 left-3 bg-emerald-100 text-emerald-800 text-xs font-data uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-200 z-20">{producto.categoria}</span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex-1">
                      <h3 className="text-lg font-heading font-bold text-emerald-950 mb-1 line-clamp-1">{producto.nombre}</h3>
                      {producto.marca && <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2 font-data">{producto.marca}</p>}
                      {producto.material && <p className="text-xs text-slate-400 mb-1">{producto.material}</p>}
                    </div>
                    <div className="flex justify-between items-end pt-4 border-t border-slate-100">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-full font-data border border-emerald-200">Consultar disponibilidad</span>
                      <div className="bg-slate-50 text-slate-400 p-2 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Search size={18} /></div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button onClick={() => { setPaginaActual(p => Math.max(1, p - 1)); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                disabled={paginaActual === 1} className="p-2.5 organic-card text-slate-400 hover:text-emerald-600 disabled:opacity-40 transition-all"><ChevronLeft size={20} /></button>
              <span className="text-sm font-bold text-slate-500 min-w-[100px] text-center font-data">{paginaActual} / {totalPaginas}</span>
              <button onClick={() => { setPaginaActual(p => Math.min(totalPaginas, p + 1)); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                disabled={paginaActual === totalPaginas} className="p-2.5 organic-card text-slate-400 hover:text-emerald-600 disabled:opacity-40 transition-all"><ChevronRight size={20} /></button>
            </div>
          )}

          {!cargando && productosProcesados.length === 0 && (
            <div className="text-center py-20 organic-card border-dashed !border-slate-300 mt-6">
              <Search size={32} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-heading font-bold text-emerald-950 mb-2">No se encontraron productos</h3>
              <p className="text-slate-400 max-w-sm mx-auto">Intenta ajustar o eliminar los filtros seleccionados.</p>
              <button onClick={() => { setBusqueda(''); setCategoriasSeleccionadas([]); setMarcasSeleccionadas([]); setSoloConStock(false); }}
                className="mt-6 font-bold text-emerald-600 hover:text-emerald-700 link-lift">Limpiar todos los filtros</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}