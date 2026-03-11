import { useState } from 'react';

export default function Login({ onLoginExitoso }) {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarLogin = (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    // Simulamos un pequeño delay para que se sienta real
    setTimeout(() => {
      if (usuario === 'admin' && clave === 'blanco2026') {
        onLoginExitoso();
      } else {
        setError('Usuario o contraseña incorrectos');
        setCargando(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-optica-dark via-emerald-700 to-optica-light px-4">
      {/* Círculos decorativos */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Card de login */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-10 border border-white/20">
          
          {/* Logo / Título */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-optica-dark/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔒</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">
              Panel de Administración
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Ópticas <span className="text-optica-dark font-bold">Blanco</span>
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={manejarLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Usuario
              </label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                placeholder="Ingresa tu usuario"
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-optica-light focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-optica-light focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                <span>❌</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-optica-dark hover:bg-optica-light disabled:opacity-60 disabled:cursor-wait text-white font-bold text-lg py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {cargando ? '⏳ Verificando...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Link para volver */}
          <div className="text-center mt-6">
            <a href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-optica-dark dark:hover:text-emerald-400 transition-colors">
              ← Volver a la tienda
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
