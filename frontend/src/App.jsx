import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, MapPin, Info, Tag, Sun, Moon, CalendarDays, LogOut, X, Menu, Mail } from 'lucide-react';

import HeroSection from './components/HeroSection';
import MarcasCarousel from './components/MarcasCarousel';
import ServiciosBento from './components/ServiciosBento';
import ProductosDestacadosHome from './components/ProductosDestacadosHome';
import ProcesoAtencion from './components/ProcesoAtencion';
import Testimonios from './components/Testimonios';
import BannerEstadisticas from './components/BannerEstadisticas';
import CtaFinal from './components/CtaFinal';
import Catalogo from './components/Catalogo';
import Agendamiento from './components/Agendamiento';
import WhatsAppButton from './components/WhatsAppButton';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import Login from './components/Login';
import ProductoDetalle from './components/ProductoDetalle';
import FloatingActions from './components/FloatingActions';

import QuienesSomos from './components/QuienesSomos';
import NuestrasTiendas from './components/NuestrasTiendas';
import Contacto from './components/Contacto';
import NuestrasMarcas from './components/NuestrasMarcas';
import Breadcrumbs from './components/Breadcrumbs';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function RouteWatcher({ onRouteChange }) {
  const { pathname } = useLocation();
  const prevPathRef = useRef(pathname);
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      if (onRouteChange) onRouteChange();
      prevPathRef.current = pathname;
    }
  }, [pathname]);
  return null;
}

/* ========================================
   ESTADO TIENDA BADGE
   ======================================== */
function EstadoTiendaBadge() {
  const [estado, setEstado] = useState({ abierto: false, texto: '' });

  useEffect(() => {
    const revisarEstado = () => {
      const ahora = new Date();
      const opciones = { timeZone: 'America/Santiago', hour12: false };
      const formatterDia = new Intl.DateTimeFormat('en-US', { ...opciones, weekday: 'short' });
      const formatterHora = new Intl.DateTimeFormat('en-US', { ...opciones, hour: 'numeric' });
      const formatterMin = new Intl.DateTimeFormat('en-US', { ...opciones, minute: 'numeric' });
      const dia = formatterDia.format(ahora);
      const horaStr = formatterHora.format(ahora).replace(/\D/g, '');
      const minStr = formatterMin.format(ahora).replace(/\D/g, '');
      const hora = parseInt(horaStr || '0', 10);
      const min = parseInt(minStr || '0', 10);
      const tiempoDecimal = hora + min / 60;

      let abierto = false;
      let texto = 'Cerrado';

      if (dia === 'Sun') { abierto = false; texto = 'Cerrado'; }
      else if (dia === 'Sat') {
        if (tiempoDecimal >= 10 && tiempoDecimal < 14) { abierto = true; texto = 'Abierto'; }
        else { abierto = false; texto = 'Cerrado'; }
      } else {
        if (tiempoDecimal >= 9.5 && tiempoDecimal < 18.5) { abierto = true; texto = 'Abierto'; }
        else { abierto = false; texto = 'Cerrado'; }
      }
      setEstado({ abierto, texto });
    };
    revisarEstado();
    const id = setInterval(revisarEstado, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase font-data tracking-wider border transition-all duration-300 ${
      estado.abierto
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-slate-50 text-slate-400 border-slate-200'
    }`}>
      <span className="relative flex h-2 w-2 shrink-0">
        {estado.abierto && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${estado.abierto ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
      </span>
      <span className="whitespace-nowrap">{estado.texto}</span>
    </div>
  );
}

/* ========================================
   FLOATING ISLAND NAVBAR
   ======================================== */
function HeaderPublico({ modoOscuro, setModoOscuro, onAbrirReserva }) {
  const [busquedaAbierta, setBusquedaAbierta] = useState(false);
  const [busquedaGlobal, setBusquedaGlobal] = useState('');
  const [productosBusqueda, setProductosBusqueda] = useState([]);
  const [menuMobileAbierto, setMenuMobileAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setBusquedaAbierta(false);
    setBusquedaGlobal('');
    setMenuMobileAbierto(false);
  }, [pathname]);

  useEffect(() => {
    if (!busquedaAbierta) return;
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setBusquedaAbierta(false);
        setBusquedaGlobal('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [busquedaAbierta]);

  useEffect(() => {
    if (busquedaAbierta && productosBusqueda.length === 0) {
      fetch('http://localhost:5000/api/productos')
        .then(r => r.json())
        .then(d => setProductosBusqueda(d))
        .catch(e => console.error(e));
    }
  }, [busquedaAbierta, productosBusqueda.length]);

  const resultadosRapidos = busquedaGlobal.trim().length > 0
    ? productosBusqueda.filter(p => {
        const termino = busquedaGlobal.toLowerCase();
        return (p.nombre || '').toLowerCase().includes(termino) || (p.marca || '').toLowerCase().includes(termino);
      }).slice(0, 5)
    : [];

  const navTransparent = isHome && !scrolled && !menuMobileAbierto;

  const navClasses = navTransparent
    ? 'bg-transparent border-transparent'
    : 'bg-white/70 backdrop-blur-xl border-slate-200/60 shadow-organic-sm';

  const textClasses = navTransparent
    ? 'text-white/80 hover:text-white'
    : 'text-slate-600 hover:text-emerald-700';

  return (
    <header className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl rounded-4xl border transition-all duration-500 ${navClasses}`} role="banner">
      <div className="px-4 py-3 md:px-6 md:py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center shrink-0"
              onClick={(e) => { if (pathname === '/') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
            >
              <img
                src={navTransparent ? '/logoblanco.png' : '/logo.png'}
                alt="Logo Ópticas Blanco"
                className="h-9 md:h-10 object-contain transition-all duration-300"
              />
            </Link>
            <EstadoTiendaBadge />
          </div>

          <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-6">
            <Link to="/catalogo" className={`text-sm font-medium transition-colors link-lift ${textClasses}`}>Catálogo</Link>
            <Link to="/marcas" className={`text-sm font-medium transition-colors link-lift flex items-center gap-1.5 ${textClasses}`}><Tag size={14} /> Marcas</Link>
            <Link to="/tiendas" className={`text-sm font-medium transition-colors link-lift flex items-center gap-1.5 ${textClasses}`}><MapPin size={14} /> Tiendas</Link>
            <Link to="/quienes-somos" className={`text-sm font-medium transition-colors link-lift flex items-center gap-1.5 ${textClasses}`}><Info size={14} /> Nosotros</Link>
            <Link to="/contacto" className={`text-sm font-medium transition-colors link-lift flex items-center gap-1.5 ${textClasses}`}><Mail size={14} /> Contacto</Link>
          </nav>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative flex items-center" ref={searchRef}>
              <button
                onClick={() => { setBusquedaAbierta(!busquedaAbierta); setBusquedaGlobal(''); }}
                className={`p-2 transition-colors rounded-xl ${navTransparent ? 'text-white/70 hover:text-white' : 'text-slate-400 hover:text-emerald-700'}`}
                aria-label="Abrir buscador"
              >
                <Search size={18} />
              </button>
              {busquedaAbierta && (
                <div className="absolute right-0 top-full mt-3 w-80 bg-white shadow-organic-xl rounded-4xl border border-slate-200 p-3 animate-fade-in origin-top-right" role="search">
                  <div className="flex items-center bg-slate-50 rounded-2xl px-3 py-2.5 border border-slate-200 focus-within:ring-2 focus-within:ring-emerald-500/30 transition-shadow">
                    <Search size={16} className="text-slate-300 mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="Buscar lentes, marcas..."
                      className="w-full bg-transparent text-sm text-slate-800 outline-none font-medium"
                      autoFocus
                      value={busquedaGlobal}
                      onChange={(e) => setBusquedaGlobal(e.target.value)}
                    />
                    {busquedaGlobal && (
                      <button onClick={() => setBusquedaGlobal('')} className="text-slate-300 hover:text-slate-500"><X size={14} /></button>
                    )}
                  </div>
                  <div className="mt-2 max-h-72 overflow-y-auto custom-scrollbar">
                    {busquedaGlobal.trim().length === 0 ? (
                      <div className="px-3 py-4 text-center"><p className="text-xs text-slate-400 font-data">Escribe para ver resultados…</p></div>
                    ) : resultadosRapidos.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {resultadosRapidos.map(prod => (
                          <Link key={prod.id} to={`/producto/${prod.id}`} onClick={() => setBusquedaAbierta(false)}
                            className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-2xl transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
                              {prod.imagen_url ? (
                                <img src={prod.imagen_url} alt={prod.nombre} className="w-full h-full object-cover" />
                              ) : (
                                <Search size={16} className="text-slate-200" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-800 truncate group-hover:text-emerald-700 transition-colors">{prod.nombre}</p>
                              <p className="text-xs text-slate-400 truncate font-data">{prod.marca || prod.categoria || '—'}</p>
                            </div>
                            <span className="text-xs font-bold text-emerald-600 whitespace-nowrap">Ver →</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="px-3 py-4 text-center"><p className="text-xs text-slate-400">No encontramos "{busquedaGlobal}"</p></div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onAbrirReserva}
              className="hidden md:flex items-center gap-2 btn-magnetic bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-4xl transition-all shadow-organic-sm hover:shadow-organic-md"
            >
              <CalendarDays size={16} />
              Reservar Hora
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuMobileAbierto(!menuMobileAbierto)}
              className={`p-2 rounded-xl transition-colors lg:hidden ${navTransparent ? 'text-white/60 hover:text-white' : 'text-slate-400 hover:text-emerald-700'}`}
              aria-label={menuMobileAbierto ? 'Cerrar menú' : 'Abrir menú'}
            >
              {menuMobileAbierto ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuMobileAbierto && (
          <nav className="lg:hidden mt-4 bg-white rounded-4xl p-5 flex flex-col gap-3 border border-slate-200 animate-fade-in shadow-organic-md">
            <Link onClick={() => setMenuMobileAbierto(false)} to="/catalogo" className="text-slate-800 hover:text-emerald-700 font-bold text-lg border-b border-slate-100 pb-3 link-lift">Catálogo</Link>
            <Link onClick={() => setMenuMobileAbierto(false)} to="/marcas" className="text-slate-800 hover:text-emerald-700 font-bold text-lg flex items-center gap-2 border-b border-slate-100 pb-3 link-lift"><Tag size={16} /> Marcas</Link>
            <Link onClick={() => setMenuMobileAbierto(false)} to="/tiendas" className="text-slate-800 hover:text-emerald-700 font-bold text-lg flex items-center gap-2 border-b border-slate-100 pb-3 link-lift"><MapPin size={16} /> Tiendas</Link>
            <Link onClick={() => setMenuMobileAbierto(false)} to="/quienes-somos" className="text-slate-800 hover:text-emerald-700 font-bold text-lg flex items-center gap-2 border-b border-slate-100 pb-3 link-lift"><Info size={16} /> Nosotros</Link>
            <Link onClick={() => setMenuMobileAbierto(false)} to="/contacto" className="text-slate-800 hover:text-emerald-700 font-bold text-lg flex items-center gap-2 border-b border-slate-100 pb-3 link-lift"><Mail size={16} /> Contacto</Link>
            <button
              onClick={() => { setMenuMobileAbierto(false); onAbrirReserva(); }}
              className="w-full mt-2 btn-magnetic flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-4xl transition-all shadow-organic-md text-lg"
            >
              <CalendarDays size={18} /> Reservar Hora
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

/* ========================================
   PAGE LAYOUT
   ======================================== */
const PageLayout = ({ children, modoOscuro, setModoOscuro, onAbrirReserva }) => {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-white transition-colors duration-300 font-sans flex flex-col">
      <HeaderPublico modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} onAbrirReserva={onAbrirReserva} />
      <Breadcrumbs />
      <main id="main-content" key={pathname} className="flex-1 animate-fade-in" tabIndex={-1}>{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

/* ========================================
   HOMEPAGE
   ======================================== */
function PaginaInicio({ onAbrirReserva }) {
  return (
    <div className="flex flex-col overflow-hidden">
      <HeroSection onAbrirReserva={onAbrirReserva} />
      <ServiciosBento />
      <ProductosDestacadosHome />
      <ProcesoAtencion />
      <MarcasCarousel />
      <Testimonios />
      <BannerEstadisticas />
    </div>
  );
}

/* ========================================
   ADMIN VIEW
   ======================================== */
function VistaAdmin({ modoOscuro, setModoOscuro }) {
  const [autenticado, setAutenticado] = useState(false);

  if (!autenticado) {
    return <Login onLoginExitoso={() => setAutenticado(true)} />;
  }

  return (
    <div className="min-h-screen bg-white transition-colors duration-300 font-sans flex flex-col">
      <header className="bg-white shadow-organic-sm sticky top-0 z-40 transition-colors duration-300 border-b border-slate-100">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo Ópticas Blanco - Panel Admin" className="h-10 object-contain" />
            <span className="hidden md:inline text-sm font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 font-data">
              Panel Admin
            </span>
          </div>
          <nav className="flex items-center gap-2 md:gap-4">
            <Link to="/" className="text-sm font-medium text-slate-400 hover:text-emerald-700 transition-colors flex items-center gap-2">← Tienda</Link>
            <button onClick={() => setAutenticado(false)} className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-2 px-3 py-2 bg-red-50 rounded-xl transition-colors">
              <LogOut size={16} /> Salir
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-8 animate-fade-in"><AdminPanel /></main>
      <Footer />
    </div>
  );
}

/* ========================================
   APP ROOT
   ======================================== */
function App() {
  const [modoOscuro, setModoOscuro] = useState(false);
  const [modalReservaAbierto, setModalReservaAbierto] = useState(false);

  useEffect(() => {
    if (modalReservaAbierto) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [modalReservaAbierto]);

  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
      <ScrollToTop />
      <RouteWatcher onRouteChange={() => setModalReservaAbierto(false)} />

      <FloatingActions onAbrirReserva={() => setModalReservaAbierto(true)} />
      <Agendamiento abierto={modalReservaAbierto} onCerrar={() => setModalReservaAbierto(false)} />

      <Routes>
        <Route path="/" element={
          <PageLayout modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} onAbrirReserva={() => setModalReservaAbierto(true)}>
            <PaginaInicio onAbrirReserva={() => setModalReservaAbierto(true)} />
            <CtaFinal onAbrirReserva={() => setModalReservaAbierto(true)} />
          </PageLayout>
        } />

        <Route path="/catalogo" element={
          <PageLayout modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} onAbrirReserva={() => setModalReservaAbierto(true)}>
            <Catalogo />
          </PageLayout>
        } />

        <Route path="/producto/:id" element={
          <PageLayout modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} onAbrirReserva={() => setModalReservaAbierto(true)}>
            <ProductoDetalle onAbrirReserva={() => setModalReservaAbierto(true)} />
          </PageLayout>
        } />

        <Route path="/quienes-somos" element={
          <PageLayout modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} onAbrirReserva={() => setModalReservaAbierto(true)}>
            <QuienesSomos />
          </PageLayout>
        } />
        <Route path="/tiendas" element={
          <PageLayout modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} onAbrirReserva={() => setModalReservaAbierto(true)}>
            <NuestrasTiendas />
          </PageLayout>
        } />
        <Route path="/marcas" element={
          <PageLayout modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} onAbrirReserva={() => setModalReservaAbierto(true)}>
            <NuestrasMarcas />
          </PageLayout>
        } />
        <Route path="/contacto" element={
          <PageLayout modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} onAbrirReserva={() => setModalReservaAbierto(true)}>
            <Contacto onAbrirReserva={() => setModalReservaAbierto(true)} />
          </PageLayout>
        } />

        <Route path="/admin" element={<VistaAdmin modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;