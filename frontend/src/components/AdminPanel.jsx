import { useState, useEffect, useRef, useCallback } from 'react';
import Swal from 'sweetalert2';
import { 
  Calendar, Glasses, Package, Check, X, Plus, Edit2, Trash2, 
  Search, Menu, Tag, Users, LayoutDashboard, ChevronRight, Upload, 
  Image as ImageIcon, Star, Sparkles, Flame, Loader2
} from 'lucide-react';
import DataTable from 'react-data-table-component';

export default function AdminPanel() {
  const [pestanaActiva, setPestanaActiva] = useState('dashboard');
  const [menuAbierto, setMenuAbierto] = useState(true);

  // Layout Dashboard
  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      
      {/* Sidebar Navigation */}
      <aside className={`${menuAbierto ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 shadow-xl z-20 transition-all duration-300 flex flex-col border-r border-gray-200 dark:border-gray-700`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50">
          {menuAbierto && <span className="font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-sm">Menú Admin</span>}
          <button onClick={() => setMenuAbierto(!menuAbierto)} className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 rounded-lg transition-colors mx-auto">
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar">
          <NavItem active={pestanaActiva === 'dashboard'} onClick={() => setPestanaActiva('dashboard')} icon={<LayoutDashboard size={20} />} text="Vista General" isOpen={menuAbierto} />
          <NavItem active={pestanaActiva === 'citas'} onClick={() => setPestanaActiva('citas')} icon={<Calendar size={20} />} text="Agendamientos" isOpen={menuAbierto} />
          <div className="pt-4 pb-1">
            {menuAbierto && <p className="px-3 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Inventario</p>}
          </div>
          <NavItem active={pestanaActiva === 'productos'} onClick={() => setPestanaActiva('productos')} icon={<Glasses size={20} />} text="Catálogo de Lentes" isOpen={menuAbierto} />
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto animate-fade-in">
          {pestanaActiva === 'dashboard' && <VistaGeneral setPestanaActiva={setPestanaActiva} />}
          {pestanaActiva === 'citas' && <PanelCitas />}
          {pestanaActiva === 'productos' && <PanelProductos />}
        </div>
      </main>
    </div>
  );
}

// Subcomponente Sidebar Item
function NavItem({ active, onClick, icon, text, isOpen }) {
  return (
    <button
      onClick={onClick}
      title={!isOpen ? text : ''}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 font-medium ${
        active 
          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      <span className={active ? 'text-white' : 'text-gray-500 dark:text-gray-400'}>{icon}</span>
      {isOpen && <span className="text-sm whitespace-nowrap">{text}</span>}
      {isOpen && active && <ChevronRight size={16} className="ml-auto opacity-70" />}
    </button>
  );
}

/* ============================================================
   VISTA GENERAL (Mini Dashboard)
   ============================================================ */
function VistaGeneral({ setPestanaActiva }) {
  const [stats, setStats] = useState({ citasHoy: 0, citasPendientes: 0, prodTotal: 0, prodOferta: 0 });

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/citas').then(r => r.json()),
      fetch('http://localhost:5000/api/productos').then(r => r.json())
    ]).then(([citas, prod]) => {
      const hoy = new Date().toISOString().split('T')[0];
      const citasHoy = citas.filter(c => c.fecha_hora.startsWith(hoy)).length;
      const pendientes = citas.filter(c => c.estado === 'Pendiente').length;
      const ofertas = prod.filter(p => p.oferta === 1).length;
      setStats({ citasHoy, citasPendientes: pendientes, prodTotal: prod.length, prodOferta: ofertas });
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Bienvenido al Panel</h1>
        <p className="text-gray-500 dark:text-gray-400">Resumen rápido del estado de tu óptica hoy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Calendar />} title="Citas Hoy" value={stats.citasHoy} color="blue" onClick={() => setPestanaActiva('citas')} />
        <StatCard icon={<Users />} title="Pendientes" value={stats.citasPendientes} color="amber" onClick={() => setPestanaActiva('citas')} />
        <StatCard icon={<Glasses />} title="Total Lentes" value={stats.prodTotal} color="emerald" onClick={() => setPestanaActiva('productos')} />
        <StatCard icon={<Tag />} title="En Oferta" value={stats.prodOferta} color="rose" onClick={() => setPestanaActiva('productos')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
           <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Accesos Rápidos</h3>
           <div className="space-y-3">
             <button onClick={() => setPestanaActiva('productos')} className="w-full text-left bg-gray-50 hover:bg-emerald-50 dark:bg-gray-700/50 dark:hover:bg-emerald-900/20 p-4 rounded-2xl flex items-center justify-between transition-colors group">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl"><Plus size={20} /></div>
                 <div>
                   <p className="font-bold text-gray-900 dark:text-white">Añadir Nuevo Producto</p>
                   <p className="text-xs text-gray-500">Sube lentes, agrega imágenes WebP y destácalos.</p>
                 </div>
               </div>
               <ChevronRight className="text-gray-300 group-hover:text-emerald-500" />
             </button>
             <button onClick={() => setPestanaActiva('citas')} className="w-full text-left bg-gray-50 hover:bg-blue-50 dark:bg-gray-700/50 dark:hover:bg-blue-900/20 p-4 rounded-2xl flex items-center justify-between transition-colors group">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl"><Check size={20} /></div>
                 <div>
                   <p className="font-bold text-gray-900 dark:text-white">Revisar Citas Pendientes</p>
                   <p className="text-xs text-gray-500">Confirma o rechaza reservas nuevas.</p>
                 </div>
               </div>
               <ChevronRight className="text-gray-300 group-hover:text-blue-500" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color, onClick }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-800/50',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-800/50',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 border-rose-100 dark:border-rose-800/50',
  };
  return (
    <button onClick={onClick} className="text-left bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 transition-transform group-hover:scale-110 ${colors[color].split(' ')[0]}`}></div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-1">{title}</p>
      <h4 className="text-3xl font-black text-gray-900 dark:text-white">{value}</h4>
    </button>
  );
}


/* ============================================================
   PANEL DE CITAS (Igual pero adaptado al nuevo layout padding)
   ============================================================ */
function PanelCitas() {
  const [citas, setCitas] = useState([]);
  const [filtro, setFiltro] = useState('');

  const cargarCitas = () => {
    fetch('http://localhost:5000/api/citas')
      .then(r => r.json())
      .then(d => setCitas(d))
      .catch(e => console.error("Error:", e));
  };

  useEffect(() => { cargarCitas(); }, []);

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const r = await fetch(`http://localhost:5000/api/citas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (r.ok) {
        cargarCitas();
        Swal.fire({ icon: 'success', title: 'Estado Actualizado', showConfirmButton: false, timer: 1500 });
      }
      else Swal.fire({ icon: 'error', title: 'Oops...', text: 'Error al actualizar status' });
    } catch { Swal.fire({ icon: 'error', title: 'Error', text: 'Error de conexión' }); }
  };

  const badgeEstado = (estado) => {
    const estilos = {
      Pendiente:  'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      Confirmada: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      Cancelada:  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    };
    return <span className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border shadow-sm ${estilos[estado] || estilos.Pendiente}`}>{estado}</span>;
  };

  const columns = [
    {
      name: 'Fecha',
      selector: row => new Date(row.fecha_hora).getTime(),
      format: row => new Date(row.fecha_hora).toLocaleString('es-CL', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }),
      sortable: true,
      width: '160px'
    },
    { name: 'Paciente', selector: row => row.cliente_nombre, sortable: true, wrap: true },
    { name: 'RUT', selector: row => row.rut, sortable: true, width: '120px' },
    { name: 'Teléfono', selector: row => row.telefono, width: '130px' },
    { name: 'Sucursal', selector: row => row.sucursal_nombre, sortable: true, wrap: true },
    { name: 'Estado', selector: row => row.estado, sortable: true, cell: row => badgeEstado(row.estado), width: '140px' },
    {
      name: 'Acciones',
      button: true,
      width: '240px',
      cell: row => (
        <div className="flex gap-2 justify-center py-2">
          {row.estado === 'Pendiente' && (
            <>
              <button onClick={() => cambiarEstado(row.id, 'Confirmada')} className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-transform hover:scale-105 shadow-sm flex items-center gap-1">
                <Check size={14}/> Confirmar
              </button>
              <button onClick={() => cambiarEstado(row.id, 'Cancelada')} className="bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-3 py-2 rounded-lg transition-transform hover:scale-105 shadow-sm flex items-center gap-1">
                <X size={14}/> Rechazar
              </button>
            </>
          )}
        </div>
      )
    },
  ];

  /* Estilos DataTable Modernos */
  const customStyles = {
    headRow: { style: { backgroundColor: 'transparent', borderBottom: '2px solid #f3f4f6' } },
    rows: { style: { backgroundColor: 'transparent', '&:hover': { backgroundColor: '#f9fafb', cursor: 'pointer' } } },
    pagination: { style: { borderTop: 'none' } }
  };
  // Para modo oscuro en datatable habría que usar createTheme de styled-components (opcional, dejamos este style general)

  // ORDENAR POR DEFECTO POR FECHA DESCENDENTE
  const citasFiltradas = [...citas].sort((a,b) => new Date(b.fecha_hora) - new Date(a.fecha_hora)).filter(c => {
    return c.cliente_nombre.toLowerCase().includes(filtro.toLowerCase()) || 
           c.rut.toLowerCase().includes(filtro.toLowerCase()) || 
           c.estado.toLowerCase().includes(filtro.toLowerCase());
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Agendamientos</h2>
            <p className="text-sm text-gray-500">Revisa y gestiona las reservas de evaluación visual.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar paciente, RUT..." 
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <DataTable
            columns={columns}
            data={citasFiltradas}
            pagination
            paginationPerPage={10}
            highlightOnHover
            customStyles={customStyles}
            noDataComponent={<div className="p-12 text-center text-gray-500 font-medium">No hay reservas que mostrar.</div>}
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PANEL DE PRODUCTOS (Rediseñado con WebP upload y Flags)
   ============================================================ */
function PanelProductos() {
  const [productos, setProductos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [archivosSeleccionados, setArchivosSeleccionados] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    nombre: '', marca: '', descripcion: '', categoria: '',
    material: '', colores: '', medidas: '', sku: '',
    estilo: '', edad: '', genero: '',
    oferta: false, destacado: false, nuevo: false,
    imagen_url_existente: '', imagenes_secundarias_existentes: ''
  });

  const cargarProductos = () => {
    fetch('http://localhost:5000/api/productos')
      .then(r => r.json())
      .then(d => setProductos(d.sort((a,b) => b.id - a.id)))
      .catch(e => console.error("Error:", e));
  };

  useEffect(() => { cargarProductos(); }, []);

  const limpiarForm = () => {
    setForm({ 
      nombre: '', marca: '', descripcion: '', categoria: '', 
      material: '', colores: '', medidas: '', sku: '',
      estilo: '', edad: '', genero: '',
      oferta: false, destacado: false, nuevo: false,
      imagen_url_existente: '', imagenes_secundarias_existentes: ''
    });
    setEditandoId(null);
    setMostrarForm(false);
    setArchivosSeleccionados([]);
    setPreviews([]);
  };

  const manejarCambio = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  // Manejador de Arrastrar y Soltar Imágenes
  const manejarArchivos = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files);
    if (!files.length) return;
    
    // Limitar a 5 max
    const newFiles = [...archivosSeleccionados, ...files].slice(0, 5);
    setArchivosSeleccionados(newFiles);

    // Generar previews locales rápidos
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removerArchivo = (idx) => {
    const nf = [...archivosSeleccionados]; nf.splice(idx, 1);
    const np = [...previews]; np.splice(idx, 1);
    setArchivosSeleccionados(nf);
    setPreviews(np);
  };

  const hacerPrincipal = (idx) => {
    if (idx === 0) return;
    if (archivosSeleccionados.length > 0) {
      const nf = [...archivosSeleccionados]; const np = [...previews];
      const tempF = nf[0]; nf[0] = nf[idx]; nf[idx] = tempF;
      const tempP = np[0]; np[0] = np[idx]; np[idx] = tempP;
      setArchivosSeleccionados(nf);
      setPreviews(np);
    } else {
      // Estamos editando productos previos sin nuevos archivos subidos
      const np = [...previews];
      const tempP = np[0]; np[0] = np[idx]; np[idx] = tempP;
      setPreviews(np);
      setForm(prev => ({
         ...prev,
         imagen_url_existente: np[0],
         imagenes_secundarias_existentes: np.slice(1).join(',')
      }));
    }
  };

  const enviarProducto = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });
    
    archivosSeleccionados.forEach(file => {
      formData.append('imagenes', file);
    });

    const url = editandoId
      ? `http://localhost:5000/api/productos/${editandoId}`
      : 'http://localhost:5000/api/productos';
    const method = editandoId ? 'PUT' : 'POST';

    try {
      const r = await fetch(url, { method, body: formData }); // Fetch sabe que es form-data automáticamente
      const data = await r.json();
      if (r.ok) {
        cargarProductos();
        limpiarForm();
        Swal.fire({ icon: 'success', title: 'Producto Publicado', text: 'Imágenes procesadas a WebP', timer: 2000, showConfirmButton: false });
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: data.mensaje || 'Revisa los campos requeridos.' });
      }
    } catch { 
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error de red.' }); 
    } finally {
      setIsLoading(false);
    }
  };

  const editarProducto = (p) => {
    setForm({
      nombre: p.nombre || '', marca: p.marca || '', descripcion: p.descripcion || '', categoria: p.categoria || '',
      material: p.material || '', colores: p.colores || '', medidas: p.medidas || '', sku: p.sku || '',
      estilo: p.estilo || '', edad: p.edad || '', genero: p.genero || '',
      oferta: !!p.oferta, destacado: !!p.destacado, nuevo: !!p.nuevo,
      imagen_url_existente: p.imagen_url || '',
      imagenes_secundarias_existentes: p.imagenes_secundarias || ''
    });
    setEditandoId(p.id);
    setMostrarForm(true);
    // Mostrar imagenes actuales como preview visual (no se subirán de nuevo a menos que adjunten archivos locales)
    const prevs = [];
    if (p.imagen_url) prevs.push(p.imagen_url);
    if (p.imagenes_secundarias) prevs.push(...p.imagenes_secundarias.split(','));
    setPreviews(prevs);
    setArchivosSeleccionados([]); // Vaciamos para no reenviar string URLs como archivos
  };

  const eliminarProducto = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar producto del catálogo?', text: "Se borrará permanentemente.", icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar'
    });
    if (!result.isConfirmed) return;
    
    try {
      const r = await fetch(`http://localhost:5000/api/productos/${id}`, { method: 'DELETE' });
      if (r.ok) {
        cargarProductos();
        Swal.fire({ icon: 'success', title: 'Eliminado', showConfirmButton: false, timer: 1000 });
      }
    } catch {}
  };

  // Obtener arrays únicos para datalists
  const marcasUnicas = [...new Set(productos.map(p => p.marca).filter(m => m))];
  const categoriasUnicas = [...new Set(productos.map(p => p.categoria).filter(c => c))];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-100 dark:border-gray-700 pb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Catálogo de Productos</h2>
            <p className="text-sm text-gray-500">Administra inventario, fotos y categorías especiales.</p>
          </div>
          <button
            onClick={() => { limpiarForm(); setMostrarForm(!mostrarForm); }}
            className={`font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2 transform hover:-translate-y-0.5 ${
              mostrarForm 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200' 
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            {mostrarForm ? <><X size={18}/> Cancelar Edición</> : <><Plus size={18}/> Agregar Lentes</>}
          </button>
        </div>

        {/* Formulario de crear/editar */}
        {mostrarForm && (
          <form onSubmit={enviarProducto} className="bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl p-6 md:p-8 mb-10 border border-gray-200/50 dark:border-gray-700/50 animate-fade-in">
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              {editandoId ? <><Edit2 className="text-emerald-500" /> Editando: {form.nombre}</> : <><Package className="text-emerald-500"/> Nuevo Producto en Catálogo</>}
            </h3>

            {/* ZONA DE DROP - IMÁGENES */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Fotografías del Producto (Max 5)</label>
              
              <div 
                className="w-full border-2 border-dashed border-emerald-300 dark:border-emerald-700/50 bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer text-center relative group"
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); manejarArchivos(e); }}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-sm text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
                  <Upload size={28} />
                </div>
                <p className="font-bold text-emerald-800 dark:text-emerald-400 mb-1">Haz clic para subir fotos o arrástralas aquí</p>
                <p className="text-xs text-gray-500">Subiremos tus imágenes y las convertiremos a .WEBP automáticamente en el servidor para que tu página web vuele. ⚡</p>
                <input type="file" multiple accept="image/*" ref={fileInputRef} className="hidden" onChange={manejarArchivos} />
              </div>

              {/* Previews Visules */}
              {previews.length > 0 && (
                <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                  {previews.map((src, i) => (
                    <div 
                       key={i} 
                       onClick={() => hacerPrincipal(i)}
                       className={`relative w-24 h-24 shrink-0 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-800 group cursor-pointer transition-all hover:scale-105 ${i === 0 ? 'border-2 border-emerald-500 ring-2 ring-emerald-200' : 'border border-gray-200 opacity-80 hover:opacity-100'}`}
                    >
                      <img src={src} alt="preview" className="w-full h-full object-contain p-2" />
                      {i === 0 && <div className="absolute top-0 left-0 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-br-lg">PRINCIPAL</div>}
                      {i !== 0 && <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px] font-bold text-center p-1 transition-opacity">Hacer<br/>Principal</div>}
                      <button type="button" onClick={(e) => { e.stopPropagation(); removerArchivo(i); }} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110 shadow-md">
                         <X size={12} />
                      </button>
                    </div>
                  ))}
                  {editandoId && archivosSeleccionados.length === 0 && (
                     <p className="text-xs text-amber-600 dark:text-amber-400 font-medium italic py-2">Mostrando fotos actuales.<br/>Clickea para cambiar la principal.<br/>Subir nuevas fotos las reemplazará.</p>
                  )}
                </div>
              )}
            </div>

            <datalist id="lista-marcas">{marcasUnicas.map((m, idx) => <option key={idx} value={m}>{m}</option>)}</datalist>
            <datalist id="lista-categorias">{categoriasUnicas.map((c, idx) => <option key={idx} value={c}>{c}</option>)}</datalist>

            {/* CAMPOS BASICOS */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-8">
              <div className="md:col-span-8">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nombre Comercial *</label>
                <input type="text" name="nombre" value={form.nombre} onChange={manejarCambio} required placeholder="Montura óptica..." className="w-full bg-white dark:bg-gray-800 border-none shadow-sm rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-lg" />
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Marca</label>
                <input type="text" name="marca" list="lista-marcas" value={form.marca} onChange={manejarCambio} placeholder="Ej: Ray-Ban" className="w-full bg-white dark:bg-gray-800 border-none shadow-sm rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Categoría Principal</label>
                <select name="categoria" value={form.categoria} onChange={manejarCambio} className="w-full bg-white dark:bg-gray-800 border-none shadow-sm rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="">Selecciona...</option>
                  <option value="Óptico">Lente Óptico / Marco</option>
                  <option value="Lente de Sol">Lente de Sol</option>
                  <option value="General">Otro / Accesorios</option>
                </select>
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Código SKU</label>
                <input type="text" name="sku" value={form.sku} onChange={manejarCambio} placeholder="RB-1020" className="w-full font-mono bg-white dark:bg-gray-800 border-none shadow-sm rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none uppercase" />
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Estilo</label>
                <select name="estilo" value={form.estilo} onChange={manejarCambio} className="w-full bg-white dark:bg-gray-800 border-none shadow-sm rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="">Selecciona...</option>
                  <option value="Clásico">Clásico</option>
                  <option value="Deportivo">Deportivo</option>
                  <option value="Fashion">Fashion</option>
                </select>
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Público / Edad</label>
                <select name="edad" value={form.edad} onChange={manejarCambio} className="w-full bg-white dark:bg-gray-800 border-none shadow-sm rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="">Selecciona...</option>
                  <option value="Adultos">Adultos</option>
                  <option value="Adolescentes">Adolescentes</option>
                  <option value="Niños">Niños</option>
                </select>
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Género</label>
                <select name="genero" value={form.genero} onChange={manejarCambio} className="w-full bg-white dark:bg-gray-800 border-none shadow-sm rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="">Selecciona...</option>
                  <option value="Hombre">Hombre</option>
                  <option value="Mujer">Mujer</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
            </div>

            {/* DISTINTIVOS / FLAGS */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-8 shadow-sm border border-emerald-100 dark:border-emerald-800/30">
               <h4 className="text-sm font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4 items-center flex gap-2"><Star size={16}/> Badges Visibles en Tienda</h4>
               <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-3 cursor-pointer group bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 px-4 py-3 rounded-xl transition-colors shrink-0">
                    <input type="checkbox" name="oferta" checked={form.oferta} onChange={manejarCambio} className="w-5 h-5 rounded border-rose-300 text-rose-500 focus:ring-rose-500 bg-white" />
                    <span className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1"><Flame size={16}/> En Oferta</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 px-4 py-3 rounded-xl transition-colors shrink-0">
                    <input type="checkbox" name="destacado" checked={form.destacado} onChange={manejarCambio} className="w-5 h-5 rounded border-amber-300 text-amber-500 focus:ring-amber-500 bg-white" />
                    <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1"><Star size={16} className="fill-current"/> Destacado</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 px-4 py-3 rounded-xl transition-colors shrink-0">
                    <input type="checkbox" name="nuevo" checked={form.nuevo} onChange={manejarCambio} className="w-5 h-5 rounded border-blue-300 text-blue-500 focus:ring-blue-500 bg-white" />
                    <span className="font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1"><Sparkles size={16}/> Nuevo Ingreso</span>
                  </label>
               </div>
            </div>

            {/* DETALLES TECNICOS Y DESCRIPCIÓN */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
               <div className="md:col-span-12">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Descripción (Atractiva para el cliente)</label>
                <textarea name="descripcion" value={form.descripcion} onChange={manejarCambio} rows="3" placeholder="Diseñados en Nueva York..." className="w-full bg-white dark:bg-gray-800 border-none shadow-sm rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-y" />
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Material</label>
                <input type="text" name="material" value={form.material} onChange={manejarCambio} placeholder="Ej: Acetato Premium" className="w-full bg-white dark:bg-gray-800 border-none shadow-sm rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Variantes / Colores</label>
                <input type="text" name="colores" value={form.colores} onChange={manejarCambio} placeholder="Negro Carey, Azul" className="w-full bg-white dark:bg-gray-800 border-none shadow-sm rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Calibre / Medidas</label>
                <input type="text" name="medidas" value={form.medidas} onChange={manejarCambio} placeholder="53-19-145" className="w-full bg-white dark:bg-gray-800 border-none shadow-sm rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            </div>

            <div className="flex gap-4 mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button disabled={isLoading} type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg px-8 py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 flex-1 md:flex-none flex justify-center items-center gap-2">
                {isLoading ? <Loader2 className="animate-spin" /> : editandoId ? 'Guardar Cambios' : 'Publicar Producto'}
              </button>
            </div>
          </form>
        )}

        {/* Tabla de productos (Rediseñada estilo lista premium) */}
        {!mostrarForm && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map(p => (
              <div key={p.id} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col">
                {/* Cabecera Tarjeta: Foto + Badges */}
                <div className="relative aspect-square bg-[#f8f9fa] dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-center p-6 pb-2 overflow-hidden">
                  {p.imagen_url ? (
                    <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transform group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <Glasses size={48} className="text-gray-300" />
                  )}
                  
                  {/* Contenedor de Badges Flotantes */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                    {p.oferta === 1 && <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-rose-500 text-white shadow-sm ring-1 ring-rose-400">Oferta</span>}
                    {p.nuevo === 1 && <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-blue-500 text-white shadow-sm ring-1 ring-blue-400">Nuevo</span>}
                    {p.destacado === 1 && <span className="text-[10px] items-center gap-1 font-black uppercase tracking-wider px-2 py-1 rounded-md bg-amber-400 text-amber-900 shadow-sm ring-1 ring-amber-300 flex"><Star size={10} className="fill-current"/> Top</span>}
                  </div>
                  
                  {/* Categoría Badge Inferior Derecha */}
                  <div className="absolute bottom-4 right-4 relative">
                     <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{p.categoria || 'Gen'}</span>
                  </div>
                </div>

                {/* Info Card */}
                <div className="p-5 flex-1 flex flex-col">
                   <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight line-clamp-2 mb-1">{p.nombre}</h3>
                   <p className="font-medium text-emerald-500 text-sm uppercase tracking-widest mb-3">{p.marca || 'S/M'}</p>
                   
                   <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                     <span className="text-xs font-mono text-gray-400 font-bold">{p.sku || '#000'}</span>
                     <div className="flex gap-2">
                       <button onClick={() => editarProducto(p)} className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors rounded-xl border border-transparent hover:border-blue-200 dark:hover:border-blue-800 focus:outline-none">
                         <Edit2 size={16} />
                       </button>
                       <button onClick={() => eliminarProducto(p.id)} className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/40 text-gray-600 dark:text-gray-300 hover:text-red-600 transition-colors rounded-xl border border-transparent hover:border-red-200 dark:hover:border-red-800 focus:outline-none">
                         <Trash2 size={16} />
                       </button>
                     </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!mostrarForm && productos.length === 0 && (
          <div className="text-center py-20 px-4 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
             <Glasses size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tu Catálogo está Vacío</h3>
             <p className="text-gray-500">Agrega tu primer modelo de lentes para presentarlo en la tienda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
