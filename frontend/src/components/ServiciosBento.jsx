import { useState, useEffect, useRef } from 'react';
import { Package, Clock, MessageCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* =============================================
   CARD 1 — Diagnostic Shuffler
   ============================================= */
function ShufflerCard() {
  const [cards, setCards] = useState([
    { label: 'Viña del Mar', sub: 'Galería Rapallo · 120+ modelos', color: 'bg-emerald-800' },
    { label: 'Quilpué', sub: 'Calle Blanco 992-B · 95+ modelos', color: 'bg-emerald-700' },
    { label: 'La Calera', sub: 'Carrera 988 · 80+ modelos', color: 'bg-emerald-600' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards(prev => {
        const next = [...prev];
        next.unshift(next.pop());
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <article className="organic-card p-8 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
          <Package className="w-5 h-5 text-emerald-800" />
        </div>
        <span className="font-data text-xs uppercase tracking-wider text-slate-400">Stock en tiempo real</span>
      </div>
      <h3 className="text-xl font-heading font-bold text-emerald-950 mb-2">
        Stock Garantizado
      </h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        Gran variedad de armazones disponibles en nuestras 3 sucursales.
      </p>

      <div className="relative h-32 mt-auto">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className={`absolute inset-x-0 rounded-2xl px-5 py-4 text-white shadow-organic-md ${card.color}`}
            style={{
              top: `${i * 12}px`,
              zIndex: 3 - i,
              opacity: 1 - i * 0.2,
              transform: `scale(${1 - i * 0.04})`,
              transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <p className="font-bold text-sm">{card.label}</p>
            <p className="text-xs text-white/70 font-data">{card.sub}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

/* =============================================
   CARD 2 — Telemetry Typewriter
   ============================================= */
function TypewriterCard() {
  const messages = [
    '> Paciente ingresado — Examen visual HD...',
    '> Autorefractómetro calibrado ✓',
    '> Diagnóstico completo: miopía -1.25',
    '> Receta despachada en 15 min ✓',
    '> Próximamente: Contactología avanzada...',
    '> Sin largas esperas — atención express ✓',
  ];

  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    if (currentLine >= messages.length) {
      const timer = setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLine(0);
        setCurrentChar(0);
        setCurrentText('');
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (currentChar < messages[currentLine].length) {
      const timer = setTimeout(() => {
        setCurrentText(prev => prev + messages[currentLine][currentChar]);
        setCurrentChar(prev => prev + 1);
      }, 35);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setDisplayedLines(prev => [...prev, currentText]);
        setCurrentLine(prev => prev + 1);
        setCurrentChar(0);
        setCurrentText('');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentLine, currentChar]);

  return (
    <article className="organic-card p-8 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-emerald-800" />
          </div>
          <span className="font-data text-xs uppercase tracking-wider text-slate-400">Sistema clínico</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-data text-[10px] uppercase tracking-widest text-emerald-600">Live Feed</span>
        </div>
      </div>
      <h3 className="text-xl font-heading font-bold text-emerald-950 mb-2">
        Revisión Sin Esperas
      </h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        Despacho de recetas rápido. Próximamente contactología.
      </p>

      <div className="mt-auto bg-emerald-950 rounded-2xl p-4 font-data text-xs text-emerald-200 min-h-[128px] overflow-hidden">
        {displayedLines.map((line, i) => (
          <div key={i} className="opacity-50 leading-relaxed">{line}</div>
        ))}
        {currentLine < messages.length && (
          <div className="leading-relaxed">
            {currentText}
            <span className="inline-block w-2 h-3.5 bg-emerald-400 ml-0.5 align-middle" style={{ animation: 'typewriterCursor 0.8s infinite' }} />
          </div>
        )}
      </div>
    </article>
  );
}

/* =============================================
   CARD 3 — Cursor Protocol Scheduler
   ============================================= */
function SchedulerCard() {
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const [activeDay, setActiveDay] = useState(-1);
  const [cursorPos, setCursorPos] = useState({ x: -20, y: -20 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sequence = async () => {
      setCursorVisible(true);
      setSaved(false);
      setActiveDay(-1);
      const targetDay = Math.floor(Math.random() * 5);
      await delay(600);
      setCursorPos({ x: targetDay * 44 + 20, y: 20 });
      await delay(700);
      setActiveDay(targetDay);
      await delay(500);
      setCursorPos({ x: 180, y: 70 });
      await delay(600);
      setSaved(true);
      await delay(1500);
      setCursorVisible(false);
      await delay(1000);
    };

    const runLoop = () => {
      sequence().then(() => {
        timerRef.current = setTimeout(runLoop, 500);
      });
    };

    const timerRef = { current: null };
    timerRef.current = setTimeout(runLoop, 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <article className="organic-card p-8 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-emerald-800" />
        </div>
        <span className="font-data text-xs uppercase tracking-wider text-slate-400">Contacto directo</span>
      </div>
      <h3 className="text-xl font-heading font-bold text-emerald-950 mb-2">
        Asesoría por WhatsApp
      </h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        Asesoría directa y humana con tu local más cercano.
      </p>

      <div className="mt-auto relative bg-slate-50 rounded-2xl p-4 min-h-[120px]">
        {cursorVisible && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#064e3b" className="absolute z-20 transition-all duration-700 ease-out pointer-events-none" style={{ left: cursorPos.x, top: cursorPos.y }}>
            <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.87c.45 0 .67-.54.35-.85L5.85 2.36a.5.5 0 00-.35.85z" />
          </svg>
        )}
        <div className="flex gap-2 mb-4">
          {days.map((day, i) => (
            <div key={i} className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              activeDay === i
                ? 'bg-emerald-600 text-white scale-95'
                : i > 4
                  ? 'bg-slate-100 text-slate-300'
                  : 'bg-white text-slate-500 border border-slate-200'
            }`}>{day}</div>
          ))}
        </div>
        <button className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
          saved ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
        }`}>
          {saved ? '✓ Agenda confirmada' : 'Agendar Consulta'}
        </button>
      </div>
    </article>
  );
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* =============================================
   MAIN
   ============================================= */
export default function ServiciosBento() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-card', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        opacity: 0, y: 60, duration: 0.8, ease: 'power3.out', stagger: 0.15,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} aria-labelledby="features-heading" className="max-w-7xl mx-auto px-6 py-24 md:py-32">
      <div className="text-center mb-16">
        <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-100 text-emerald-800 text-xs font-data uppercase tracking-widest mb-6 border border-emerald-200">
          Por qué elegirnos
        </span>
        <h2 id="features-heading" className="text-4xl md:text-5xl font-heading font-bold text-emerald-950 tracking-tight">
          Cuidado visual{' '}
          <span className="font-drama italic text-emerald-700">integral</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="feature-card"><ShufflerCard /></div>
        <div className="feature-card"><TypewriterCard /></div>
        <div className="feature-card"><SchedulerCard /></div>
      </div>
    </section>
  );
}
