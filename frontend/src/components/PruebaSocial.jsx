import { Star } from 'lucide-react';

const resenas = [
  {
    nombre: 'María González',
    texto: 'Excelente atención. Me ayudaron a elegir los lentes perfectos para mi cara y el examen visual fue súper completo. ¡100% recomendados!',
    estrellas: 5,
    iniciales: 'MG',
    gradiente: 'from-emerald-400 to-emerald-600',
    tiempo: 'Hace 2 semanas',
  },
  {
    nombre: 'Carlos Muñoz',
    texto: 'Llevo años con Ópticas Blanco. El servicio técnico es rápido y profesional, me dejaron los lentes como nuevos en 20 minutos.',
    estrellas: 5,
    iniciales: 'CM',
    gradiente: 'from-blue-400 to-blue-600',
    tiempo: 'Hace 1 mes',
  },
  {
    nombre: 'Andrea Soto',
    texto: 'Me encantó la asesoría. La chica que me atendió fue muy paciente y me probé como 15 modelos hasta encontrar el ideal. Gran experiencia.',
    estrellas: 5,
    iniciales: 'AS',
    gradiente: 'from-purple-400 to-purple-600',
    tiempo: 'Hace 3 semanas',
  },
];

export default function PruebaSocial() {
  return (
    <section aria-labelledby="testimonios-heading" className="bg-gray-50 dark:bg-gray-900/50 py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <p className="text-optica-dark dark:text-emerald-400 text-sm font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
            <span aria-hidden="true" className="w-8 h-[2px] bg-emerald-500" />
            Testimonios
            <span aria-hidden="true" className="w-8 h-[2px] bg-emerald-500" />
          </p>
          <h2 id="testimonios-heading" className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white mb-4">
            Lo que dicen nuestros clientes
          </h2>
          {/* Rating global */}
          <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-5 py-2 shadow-sm">
            <div className="flex gap-0.5" aria-label="Calificación 5 de 5 estrellas">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-800 dark:text-white">5.0</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">· +127 reseñas</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="list">
          {resenas.map((r, i) => (
            <article
              key={i}
              role="listitem"
              itemScope
              itemType="https://schema.org/Review"
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-1 flex flex-col"
            >
              {/* Estrellas */}
              <div
                className="flex gap-1 mb-4"
                aria-label={`${r.estrellas} de 5 estrellas`}
                itemProp="reviewRating"
                itemScope
                itemType="https://schema.org/Rating"
              >
                <meta itemProp="ratingValue" content={String(r.estrellas)} />
                <meta itemProp="bestRating" content="5" />
                {Array.from({ length: r.estrellas }).map((_, j) => (
                  <Star key={j} aria-hidden="true" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Texto */}
              <p
                itemProp="reviewBody"
                className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5 italic flex-1"
              >
                "{r.texto}"
              </p>

              {/* Persona */}
              <div
                className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700"
                itemProp="author"
                itemScope
                itemType="https://schema.org/Person"
              >
                <div
                  aria-hidden="true"
                  className={`w-10 h-10 bg-gradient-to-br ${r.gradiente} rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md`}
                >
                  {r.iniciales}
                </div>
                <div>
                  <p itemProp="name" className="text-sm font-bold text-gray-800 dark:text-white">{r.nombre}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{r.tiempo}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
