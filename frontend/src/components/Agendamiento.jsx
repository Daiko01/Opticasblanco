import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Calendar as CalendarIcon, Clock, MapPin, Navigation, User, Phone, Mail, CheckCircle, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import API_BASE_URL from '../config';

export default function Agendamiento({ abierto, onCerrar }) {
  const [sucursales, setSucursales] = useState([]);
  const [paso, setPaso] = useState(1); // 1: Datos y Fecha, 2: Resumen
  const [datosFormulario, setDatosFormulario] = useState({
    sucursal_id: '', fecha: new Date().toISOString().split('T')[0], hora: '', cliente_nombre: '', rut: '', telefono: '', email: '', motivo: 'Revisión oftalmológica'
  });
  const [errores, setErrores] = useState({});
  const [horasOcupadas, setHorasOcupadas] = useState([]);

  // Variables para información extra de las sucursales
  const infoSucursales = {
    '1': { dir: 'Av. Valparaíso 518 local 2 galería rapallo', map: 'Av.+Valparaíso+518,+Viña+del+Mar,+Valparaíso,+Chile' }, // Viña
    '2': { dir: 'Calle Blanco 992-B', map: 'Blanco+Encalada+992,+Quilpué,+Valparaíso,+Chile' }, // Quilpue
    '3': { dir: 'Calle carrera 988 esq. Huici', map: 'Carrera+988,+La+Calera,+Valparaíso,+Chile' }  // La Calera
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/sucursales`)
      .then(respuesta => respuesta.json())
      .then(datos => setSucursales(datos))
      .catch(error => console.error("Error al cargar sucursales:", error));
  }, []);

  useEffect(() => {
    if (datosFormulario.fecha && datosFormulario.sucursal_id) {
      fetch(`${API_BASE_URL}/citas/ocupadas?fecha=${datosFormulario.fecha}&sucursal_id=${datosFormulario.sucursal_id}`)
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) setHorasOcupadas(data);
          else setHorasOcupadas([]);
        })
        .catch(e => console.error("Error cargando horas ocupadas:", e));
    } else {
      setHorasOcupadas([]);
    }
  }, [datosFormulario.fecha, datosFormulario.sucursal_id]);

  // Generación de bloques de 30 minutos
  const obtenerBloquesHorario = (fechaStr, tipo) => {
    if (!fechaStr) return [];
    
    const partes = fechaStr.split('-');
    if (partes.length !== 3) return [];
    
    const fechaObj = new Date(partes[0], partes[1] - 1, partes[2]);
    if (fechaObj.getDay() === 0) return []; // Domingo cerrado

    let inicio, fin;
    if (tipo === 'mañana') {
      inicio = 10 * 60; // 10:00
      fin = 12 * 60 + 30; // 12:30
    } else {
      inicio = 13 * 60; // 13:00
      fin = 18 * 60; // 18:00 (para llegar hasta 18:30)
    }

    const ahora = new Date();
    if (
      fechaObj.getFullYear() === ahora.getFullYear() &&
      fechaObj.getMonth() === ahora.getMonth() &&
      fechaObj.getDate() === ahora.getDate()
    ) {
      const minActual = ahora.getHours() * 60 + ahora.getMinutes();
      const proxBloque = Math.ceil(minActual / 30) * 30;
      if (proxBloque > inicio) {
        inicio = proxBloque;
      }
    }

    const horas = [];
    for (let m = inicio; m <= fin; m += 30) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      horas.push(`${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
    }
    return horas;
  };

  const filtrarPorOcupacion = (horas) => {
    if (datosFormulario.motivo !== 'Revisión oftalmológica') return horas;
    return horas.filter(h => !horasOcupadas.includes(h));
  };

  const horasManana = filtrarPorOcupacion(obtenerBloquesHorario(datosFormulario.fecha, 'mañana'));
  const horasTarde = filtrarPorOcupacion(obtenerBloquesHorario(datosFormulario.fecha, 'tarde'));

  const formatearRut = (rut) => {
    let valor = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    if (valor.length > 9) valor = valor.slice(0, 9);
    if (valor.length <= 1) return valor;
    const cuerpo = valor.slice(0, -1);
    const dv = valor.slice(-1);
    return `${cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-${dv}`;
  };

  const formatearTelefono = (tel) => {
    let valor = tel.replace(/[^\d+]/g, '');
    if (!valor.startsWith('+56')) valor = '+56' + valor.replace('+', '').replace(/^56/, '');
    if (valor.length > 12) valor = valor.slice(0, 12);
    return valor;
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    let valorCorregido = value;
    if (name === 'rut') valorCorregido = formatearRut(value);
    else if (name === 'telefono') valorCorregido = formatearTelefono(value);

    setDatosFormulario(prev => {
      const nuevos = { ...prev, [name]: valorCorregido };
      if (name === 'fecha') nuevos.hora = '';
      if (name === 'sucursal_id') nuevos.hora = '';
      return nuevos;
    });
    if (errores[name] || errores.general) setErrores({ ...errores, [name]: '', general: '' });
  };

  const manejarBlur = (e) => {
    const { name, value } = e.target;
    let err = '';
    if (name === 'rut' && value && !/^\d{1,2}\.\d{3}\.\d{3}-[0-9Kk]$/.test(value)) err = "RUT inválido";
    if (name === 'telefono' && value && !/^\+569\d{8}$/.test(value)) err = "Teléfono inválido";
    if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) err = "Email inválido";

    if (err) {
      setErrores(prev => ({ ...prev, [name]: err }));
    }
  };

  const avanzarDia = () => {
    if (!datosFormulario.fecha) return;
    const [year, month, day] = datosFormulario.fecha.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() + 1); // Suma un día
    
    // Salta el domingo
    if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    
    setDatosFormulario({ ...datosFormulario, fecha: `${yyyy}-${mm}-${dd}`, hora: '' });
  };

  const seleccionarHora = (h) => {
    setDatosFormulario({ ...datosFormulario, hora: h });
    setErrores({ ...errores, hora: '' });
  };

  const validarPaso1 = () => {
    let errs = {};
    if (!datosFormulario.sucursal_id) errs.sucursal_id = "Selecciona una sucursal";
    if (!datosFormulario.fecha) errs.fecha = "Selecciona una fecha";
    if (!datosFormulario.hora) errs.hora = "Selecciona un bloque horario";
    if (!datosFormulario.cliente_nombre) errs.cliente_nombre = "Ingresa tu nombre";
    if (!/^\d{1,2}\.\d{3}\.\d{3}-[0-9Kk]$/.test(datosFormulario.rut)) errs.rut = "RUT inválido";
    if (!/^\+569\d{8}$/.test(datosFormulario.telefono)) errs.telefono = "Teléfono inválido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosFormulario.email)) errs.email = "Email inválido";

    setErrores(errs);
    if (Object.keys(errs).length === 0) {
      setPaso(2);
    }
  };

  const enviarReserva = async () => {
    const payload = {
      ...datosFormulario,
      fecha_hora: `${datosFormulario.fecha}T${datosFormulario.hora}`
    };
    delete payload.fecha;
    delete payload.hora;

    try {
      const respuesta = await fetch(`${API_BASE_URL}/citas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const resultado = await respuesta.json();
      if (respuesta.ok) {
        Swal.fire({ icon: 'success', title: '¡Reserva Confirmada!', text: resultado.mensaje, confirmButtonColor: '#10b981', timer: 3000 });
        setDatosFormulario({ sucursal_id: '', fecha: new Date().toISOString().split('T')[0], hora: '', cliente_nombre: '', rut: '', telefono: '', email: '', motivo: 'Revisión oftalmológica' });
        setPaso(1);
        onCerrar();
      } else {
        Swal.fire({ icon: 'error', title: 'Oops...', text: resultado.mensaje });
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error de conexión' });
    }
  };

  if (!abierto) return null;

  const sucursalSeleccionada = sucursales.find(s => String(s.id) === String(datosFormulario.sucursal_id));
  const infoExtraSucursal = infoSucursales[datosFormulario.sucursal_id] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCerrar}></div>

      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 sm:px-10 flex flex-col sm:flex-row sm:items-center justify-between text-white shrink-0 gap-4">
          <div>
            <h2 className="text-2xl font-bold">Agenda tu Cita</h2>
            <p className="text-emerald-100/90 text-sm mt-1">{paso === 1 ? 'Paso 1: Completa tus datos y horario' : 'Paso 2: Revisa y Confirma'}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl text-xs sm:text-sm border border-white/20">
            <span className="block font-bold text-amber-300">🎁 20% Dcto. extra si agendaste</span>
            <span className="block text-emerald-50">Evaluación <span className="font-bold border-b border-emerald-50">GRATIS</span> por compra de ópticos</span>
          </div>
          <button onClick={onCerrar} className="absolute top-4 right-4 sm:static w-10 h-10 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors">✕</button>
        </div>

        {/* Body scrollable */}
        <div className="overflow-y-auto custom-scrollbar flex-1 p-6 sm:px-10 bg-gray-50/50 dark:bg-gray-900/50">
          
          {paso === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Columna Izquierda: Datos Personales y Sucursal */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <MapPin size={18} className="text-emerald-500"/> 1. Selecciona Local
                  </h3>
                  <select name="sucursal_id" value={datosFormulario.sucursal_id} onChange={manejarCambio} className={`w-full bg-gray-50 dark:bg-gray-900 border ${errores.sucursal_id ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow`}>
                    <option value="">Elegir sucursal...</option>
                    {sucursales.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                  </select>
                  
                  {sucursalSeleccionada && infoExtraSucursal && (
                    <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800 border-dashed animate-fade-in">
                      <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400 flex items-start gap-2">
                        <MapPin size={16} className="mt-0.5 shrink-0" />
                        {infoExtraSucursal.dir}
                      </p>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${infoExtraSucursal.map}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-xs font-bold bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg shadow-sm hover:shadow transition-shadow">
                        <Navigation size={14} /> Cómo llegar
                      </a>
                    </div>
                  )}
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <User size={18} className="text-emerald-500"/> 2. Tus Datos
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <input type="text" name="cliente_nombre" value={datosFormulario.cliente_nombre} onChange={manejarCambio} placeholder="Nombre Completo" className={`w-full bg-gray-50 dark:bg-gray-900 border ${errores.cliente_nombre ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500`} />
                      {errores.cliente_nombre && <p className="text-xs text-red-500 mt-1">{errores.cliente_nombre}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <input type="text" name="rut" value={datosFormulario.rut} onChange={manejarCambio} onBlur={manejarBlur} placeholder="RUT" className={`w-full bg-gray-50 dark:bg-gray-900 border ${errores.rut ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500`} />
                        {!errores.rut && datosFormulario.rut.length > 8 && <Check size={16} className="absolute right-3 top-3.5 text-emerald-500" />}
                        {errores.rut && <p className="text-xs text-red-500 mt-1">{errores.rut}</p>}
                      </div>
                      <div className="relative">
                        <input type="tel" name="telefono" value={datosFormulario.telefono} onChange={manejarCambio} onBlur={manejarBlur} placeholder="+569..." className={`w-full bg-gray-50 dark:bg-gray-900 border ${errores.telefono ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500`} />
                        {!errores.telefono && datosFormulario.telefono.length === 12 && <Check size={16} className="absolute right-3 top-3.5 text-emerald-500" />}
                        {errores.telefono && <p className="text-xs text-red-500 mt-1">{errores.telefono}</p>}
                      </div>
                    </div>
                    <div className="relative">
                      <input type="email" name="email" value={datosFormulario.email} onChange={manejarCambio} onBlur={manejarBlur} placeholder="Correo Electrónico" className={`w-full bg-gray-50 dark:bg-gray-900 border ${errores.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500`} />
                      {!errores.email && datosFormulario.email.includes('@') && <Check size={16} className="absolute right-3 top-3.5 text-emerald-500" />}
                      {errores.email && <p className="text-xs text-red-500 mt-1">{errores.email}</p>}
                    </div>
                  </div>
                </div>

              </div>

              {/* Columna Derecha: Calendario y Horas */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <CalendarIcon size={18} className="text-emerald-500"/> 3. Cuándo nos visitas
                  </h3>
                  
                  {/* Selector de Fecha estilizado */}
                  <div className="relative mb-6">
                    <input type="date" name="fecha" value={datosFormulario.fecha} min={new Date().toISOString().split('T')[0]} onChange={manejarCambio} className={`w-full relative z-10 bg-transparent border-2 ${errores.fecha ? 'border-red-500' : 'border-emerald-100 dark:border-gray-700 focus:border-emerald-500'} rounded-xl px-4 py-4 text-emerald-900 dark:text-white font-bold text-lg outline-none cursor-pointer text-center`} style={{ colorScheme: 'auto' }} />
                  </div>

                  {/* Selector de Motivo */}
                  <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg mb-6">
                    <button type="button" onClick={() => setDatosFormulario({...datosFormulario, motivo: 'Revisión oftalmológica', hora: ''})} className={`flex-1 text-xs font-bold py-2 px-2 rounded-md transition-all ${datosFormulario.motivo === 'Revisión oftalmológica' ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm' : 'text-gray-500'}`}>Consulta Especialista</button>
                    <button type="button" onClick={() => setDatosFormulario({...datosFormulario, motivo: 'Despacho de receta médica', hora: ''})} className={`flex-1 text-xs font-bold py-2 px-2 rounded-md transition-all ${datosFormulario.motivo === 'Despacho de receta médica' ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm' : 'text-gray-500'}`}>Traigo mi Receta</button>
                  </div>

                  {/* Filtros de bloque horario */}
                  {datosFormulario.sucursal_id ? (
                    <div className="space-y-5">
                      {/* Mañana */}
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1"><Clock size={12}/> Mañana</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {horasManana.length > 0 ? horasManana.map(h => (
                            <button key={h} type="button" onClick={() => seleccionarHora(h)} className={`py-2 px-1 text-sm font-bold rounded-lg transition-all border ${datosFormulario.hora === h ? 'bg-emerald-500 border-emerald-500 text-white shadow-md transform scale-105' : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 hover:text-emerald-500'}`}>
                              {h}
                            </button>
                          )) : <p className="text-xs text-gray-500 col-span-full">Agotado / Sin atención.</p>}
                        </div>
                      </div>
                      <hr className="border-dashed border-gray-200 dark:border-gray-700"/>
                      {/* Tarde */}
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1"><Clock size={12}/> Tarde</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {horasTarde.length > 0 ? horasTarde.map(h => (
                            <button key={h} type="button" onClick={() => seleccionarHora(h)} className={`py-2 px-1 text-sm font-bold rounded-lg transition-all border ${datosFormulario.hora === h ? 'bg-emerald-500 border-emerald-500 text-white shadow-md transform scale-105' : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 hover:text-emerald-500'}`}>
                              {h}
                            </button>
                          )) : <p className="text-xs text-gray-500 col-span-full">Agotado / Sin atención.</p>}
                        </div>
                      </div>
                      
                      {/* Sugerencia de próximo día si no hay horas en todo el día */}
                      {horasManana.length === 0 && horasTarde.length === 0 && (
                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 p-4 rounded-xl text-center animate-fade-in">
                          <p className="text-amber-700 dark:text-amber-500 text-sm font-medium mb-3">No hay más disponibilidad para este día.</p>
                          <button type="button" onClick={avanzarDia} className="text-sm font-bold bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 py-2 px-4 rounded-lg shadow-sm border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 transition-colors">
                            Buscar horas en el día siguiente →
                          </button>
                        </div>
                      )}
                      {errores.hora && <p className="text-xs text-red-500 font-medium text-center bg-red-50 dark:bg-red-900/10 p-2 rounded-lg">{errores.hora}</p>}
                    </div>
                  ) : (
                    <div className="text-center py-10 px-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-500 text-sm">
                      <MapPin className="mx-auto mb-2 opacity-50" size={24}/>
                      Selecciona una sucursal primero para ver las horas disponibles.
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* PASO 2: Resumen */}
          {paso === 2 && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in py-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Confirma tu Reserva</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Revisa que tus datos sean correctos antes de enviar la reserva.</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                <div className="pb-6">
                  <h4 className="text-xs uppercase tracking-widest text-emerald-500 font-bold mb-4 flex items-center gap-2"><CalendarIcon size={14}/> Tu Agendamiento</h4>
                  <div className="grid grid-cols-2 gap-y-6">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Día</p>
                      <p className="font-bold text-gray-900 dark:text-white text-lg mt-1">{datosFormulario.fecha.split('-').reverse().join('/')}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Hora</p>
                      <p className="font-bold text-gray-900 dark:text-white text-lg mt-1">{datosFormulario.hora}</p>
                    </div>
                    <div className="col-span-2 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                      <p className="text-xs font-bold text-gray-400 uppercase">Lugar</p>
                      <p className="font-bold text-gray-900 dark:text-white mt-1">{sucursalSeleccionada?.nombre}</p>
                      <p className="text-sm text-gray-500 flex items-start gap-1.5 mt-2">
                        <MapPin size={16} className="shrink-0 mt-0.5 text-emerald-500"/>
                        {infoExtraSucursal?.dir}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-6 space-y-5">
                  <h4 className="text-xs uppercase tracking-widest text-emerald-500 font-bold flex items-center gap-2"><User size={14}/> Datos del Paciente</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 shrink-0"><User size={20}/></div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{datosFormulario.cliente_nombre}</p>
                      <p className="text-sm text-gray-500 mt-0.5">RUT: {datosFormulario.rut}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Phone size={16} className="text-gray-400"/> {datosFormulario.telefono}</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Mail size={16} className="text-gray-400"/> {datosFormulario.email}</p>
                  </div>
                </div>

                <div className="pt-6">
                  <p className="text-xs font-bold text-gray-400 uppercase">Motivo de visita</p>
                  <p className="font-bold text-emerald-700 dark:text-emerald-400 inline-block bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl text-sm mt-2 border border-emerald-100 dark:border-emerald-800/50">
                    {datosFormulario.motivo}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer actions sticky */}
        <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
          {paso === 1 ? (
            <>
              <button type="button" onClick={onCerrar} className="text-gray-500 font-bold hover:text-gray-900 dark:hover:text-white px-4 py-2 transition-colors">Cancelar</button>
              <button type="button" onClick={validarPaso1} className="bg-optica-dark hover:bg-optica-light text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-all flex items-center gap-2 group">
                Continuar <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => setPaso(1)} className="text-gray-500 font-bold hover:text-gray-900 dark:hover:text-white px-4 py-2 transition-colors flex items-center gap-2 group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Volver
              </button>
              <button type="button" onClick={enviarReserva} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 scale-100 hover:scale-[1.02]">
                <CheckCircle size={18} /> Confirmar Reserva
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}