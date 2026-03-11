import { CalendarDays, Glasses, Edit3, ShoppingBag, ArrowRight } from 'lucide-react';

export default function PasosCompra({ onAbrirReserva }) {
  const pasos = [
    {
      id: 1,
      titulo: 'Agenda tu hora',
      descripcion: 'Reserva una evaluación visual gratuita con nuestros especialistas.',
      icono: <CalendarDays className="w-8 h-8 text-emerald-500" />
    },
    {
      id: 2,
      titulo: 'Prueba tus lentes',
      descripcion: 'Asesórate y encuentra el armazón perfecto para tu tipo de rostro.',
      icono: <Glasses className="w-8 h-8 text-emerald-500" />
    },
    {
      id: 3,
      titulo: 'Personaliza',
      descripcion: 'Elige los cristales y tratamientos ideales (antirreflejo, filtro azul, etc).',
      icono: <Edit3 className="w-8 h-8 text-emerald-500" />
    },
    {
      id: 4,
      titulo: 'Completa la compra',
      descripcion: 'Lleva tus lentes listos con garantía y excelentes opciones de pago.',
      icono: <ShoppingBag className="w-8 h-8 text-emerald-500" />
    }
  ];

  return (
    <section className="py-20 px-4 md:px-8 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-emerald-500 font-black tracking-widest uppercase text-xs mb-2 block">Cómo funciona</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            Tu visión perfecta, <br className="hidden md:block" /> en 4 simples pasos
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Acompañamos todo tu proceso para garantizar que lleves lentes cómodos, duraderos y con tu receta exacta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 relative">
          {/* Línea conectora (Desktop) */}
          <div className="hidden lg:block absolute top-[2.5rem] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 z-0"></div>

          {pasos.map((paso, i) => (
            <div key={paso.id} className="relative z-10 flex flex-col items-center text-center group cursor-default">
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-6 shadow-sm border-4 border-white dark:border-gray-900 group-hover:scale-110 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 transition-all duration-300">
                {paso.icono}
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-emerald-500 text-white font-black text-sm rounded-full flex items-center justify-center shadow-md">
                  {paso.id}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {paso.titulo}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed px-4">
                {paso.descripcion}
              </p>

              {/* Conector Mobile */}
              {i < pasos.length - 1 && (
                <div className="lg:hidden w-[2px] h-12 bg-emerald-100 dark:bg-gray-800 my-4"></div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={onAbrirReserva}
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold transition-all hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto"
          >
            <CalendarDays size={20} />
            Agendar Evaluación
          </button>
          <a 
            href="/catalogo"
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-8 py-4 rounded-xl font-bold transition-all w-full sm:w-auto border border-gray-200 dark:border-gray-700"
          >
            Ver Catálogo Óptico <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}
