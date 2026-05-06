"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown, Eye } from "lucide-react";

const QUESTIONS = [
  { id: "1", label: "Идентификация", prompt: "Кто ты?" },
  { id: "2", label: "Гордость", prompt: "Чем ты по-настоящему гордишься?" },
  { id: "3", label: "Триггеры", prompt: "Что тебя может вывести из себя за секунду?" },
  { id: "4", label: "Ценности", prompt: "На что тебе никогда не жалко денег и времени?" },
  { id: "5", label: "Превосходство", prompt: "В чем ты лучше большинства окружающих?" },
  { id: "6", label: "Свобода", prompt: "Опиши свой идеальный выходной" },
  { id: "7", label: "Опыт", prompt: "Какую главную ошибку в жизни ты бы не стал исправлять?" },
  { id: "8", label: "Этика", prompt: "Что для тебя справедливость?" },
  { id: "9", label: "Рестарт", prompt: "Кем бы ты стал, если бы пришлось начать жизнь с чистого листа в другой стране?" },
  { id: "10", label: "Цель", prompt: "Зачем ты здесь?" },
];

const LOADING_PHRASES = [
  "Ты уже исправил оценки за пас?",
  "Твои ответы прекрасны...",
  "Я Глеб, а ты?",
  "Ты сегодня выглядишь прекрасно",
  "Игрок в доту",
  "Нейросеть думает о тебе",
  "Подождите, я почти понял вас",
  "Анализирую глубины подсознания",
  "Это сложнее, чем я думал",
  "Квантовый психоанализ в процессе",
  "Ваш мозг интереснее среднего",
  "Считаю синапсы...",
  "Три, два, один... почти",
  "Не спите — это важно",
];

const ACCENT_COLORS = [
  "rgba(147, 114, 255, 0.7)",  
  "rgba(255, 142, 107, 0.7)",  
  "rgba(80, 200, 180, 0.7)",   
  "rgba(255, 107, 142, 0.7)",  
  "rgba(107, 179, 255, 0.7)",  
  "rgba(147, 114, 255, 0.7)",
  "rgba(255, 142, 107, 0.7)",
  "rgba(80, 200, 180, 0.7)",
  "rgba(255, 107, 142, 0.7)",
  "rgba(107, 179, 255, 0.7)",
];

// ─── Фоновый Canvas ────────────────────────────────────────────────────────────
function BinaryCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const cells = useRef<{ val: string; opacity: number; hover: number; hoverColor: number }[]>([]);
  const rafId = useRef<number>(0);
  const CELL = 26;
  const RADIUS = 140;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cols = Math.ceil(canvas.width / CELL);
      const rows = Math.ceil(canvas.height / CELL);
      cells.current = Array.from({ length: cols * rows }, () => ({
        val: Math.random() > 0.5 ? "1" : "0",
        opacity: Math.random() * 0.06 + 0.02,
        hover: 0,
        hoverColor: Math.random(),
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const draw = () => {
      rafId.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = Math.ceil(canvas.width / CELL);
      ctx.font = `${CELL - 10}px 'Courier New', monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowBlur = 0;

      cells.current.forEach((cell, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = col * CELL + CELL / 2;
        const cy = row * CELL + CELL / 2;
        const dx = cx - mouse.current.x;
        const dy = cy - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < RADIUS) {
          if (Math.random() < 0.06) cell.val = Math.random() > 0.5 ? "1" : "0";
          cell.hover = Math.min(cell.hover + 0.1, 1);
        } else {
          cell.hover = Math.max(cell.hover - 0.03, 0);
        }

        const alpha = cell.opacity + cell.hover * 0.22;

        if (cell.hover > 0.01) {
          const h = cell.hover;
          const hc = cell.hoverColor;
          let r: number, g: number, b: number;
          if (hc < 0.33) { r = 147; g = 114; b = 255; }      
          else if (hc < 0.66) { r = 80; g = 200; b = 180; }   
          else { r = 255; g = 142; b = 107; }                 

          const base = 60;
          const bright = base + h * 90;
          ctx.fillStyle = `rgba(${Math.round(base + (r - base) * h)},${Math.round(base + (g - base) * h)},${Math.round(base + (b - base) * h)},${alpha})`;
        } else {
          const base = 60;
          const bright = base + cell.hover * 130;
          ctx.fillStyle = `rgba(${bright},${bright},${bright},${alpha})`;
        }

        ctx.fillText(cell.val, cx, cy);
      });
    };

    rafId.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "#080810" }}
    />
  );
}

// ─── Модал ввода имени ────────────────────────────────────────────────────────
function NameModal({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [val, setVal] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 500);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = () => {
    const trimmed = val.trim();
    if (trimmed) onSubmit(trimmed);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ backgroundColor: "rgba(8,8,16,0.88)", backdropFilter: "blur(8px)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div
          className="px-10 py-14 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #0f0f1a 0%, #111118 100%)",
            border: "1px solid rgba(147,114,255,0.12)",
          }}
        >
          {/* Метка */}
          <p
            className="text-[10px] tracking-[0.5em] uppercase mb-10"
            style={{ color: "rgba(147,114,255,0.5)", fontFamily: "'Courier New', monospace" }}
          >
            Психологический профайлер
          </p>

          {/* Заголовок */}
          <h2
            className="text-4xl font-light mb-2"
            style={{
              fontFamily: "'Georgia', serif",
              color: "rgba(255,255,255,0.95)",
              letterSpacing: "-0.02em",
            }}
          >
            Кто вы?
          </h2>
          <p className="text-sm mb-12" style={{ color: "rgba(200,195,230,0.45)", fontFamily: "sans-serif" }}>
            Просто имя. Остальное откроется само.
          </p>

          {/* Поле ввода */}
          <div className="mb-12">
            <input
              ref={inputRef}
              type="text"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ваше имя…"
              className="w-full bg-transparent outline-none text-2xl pb-3 font-light"
              style={{
                fontFamily: "'Georgia', serif",
                color: "rgba(255,255,255,0.92)",
                borderBottom: "none",
              }}
            />
            <div className="relative h-px">
              <div style={{ position: "absolute", inset: 0, background: "rgba(147,114,255,0.15)" }} />
              <motion.div
                animate={{ scaleX: isFocused ? 1 : 0, opacity: isFocused ? 1 : 0 }}
                initial={{ scaleX: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(147,114,255,0.8)",
                  transformOrigin: "left",
                  height: "1px",
                }}
              />
            </div>
          </div>

          {/* Кнопка */}
          <motion.button
            onClick={handleSubmit}
            disabled={!val.trim()}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <span
              className="text-xs tracking-[0.35em] uppercase font-semibold"
              style={{
                color: val.trim() ? "rgba(147,114,255,0.9)" : "rgba(255,255,255,0.3)",
                fontFamily: "sans-serif",
                transition: "color 0.3s",
              }}
            >
              Войти
            </span>
            <ArrowRight size={13} style={{ color: val.trim() ? "rgba(147,114,255,0.6)" : "rgba(255,255,255,0.2)" }} />
          </motion.button>

          <p className="mt-10 text-[10px] tracking-wide" style={{ color: "rgba(255,255,255,0.15)", fontFamily: "sans-serif" }}>
            Я не храню ваши данные. Всё, что здесь происходит, остается между вами и алгоритмом
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Строка вопроса ───────────────────────────────────────────────────────────
function QuestionRow({
  question,
  index,
  value,
  onChange,
}: {
  question: (typeof QUESTIONS)[0];
  index: number;
  value: string;
  onChange: (val: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  const autoResize = useCallback(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => { autoResize(); }, [value, autoResize]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* Левая цветная полоса при фокусе */}
      <motion.div
        animate={{ opacity: focused ? 1 : 0, scaleY: focused ? 1 : 0.4 }}
        initial={{ opacity: 0, scaleY: 0.4 }}
        transition={{ duration: 0.35 }}
        style={{
          position: "absolute",
          left: 0,
          top: "2.5rem",
          bottom: "2.5rem",
          width: "2px",
          background: accent,
          transformOrigin: "center",
          borderRadius: "2px",
        }}
      />

      <div
        className="pl-7 py-10 border-b transition-colors duration-500"
        style={{
          borderColor: focused ? "rgba(147,114,255,0.08)" : "rgba(255,255,255,0.04)",
          background: focused ? "rgba(147,114,255,0.03)" : "transparent",
        }}
      >
        {/* Метка */}
        <div className="flex items-center gap-4 mb-5">
          <span
            className="text-[10px] font-mono tabular-nums"
            style={{ color: focused ? accent : "rgba(255,255,255,0.15)" }}
          >
            {String(question.id).padStart(2, "0")}
          </span>
          <div
            style={{
              height: "1px",
              width: "24px",
              background: focused ? accent.replace("0.7)", "0.25)") : "rgba(255,255,255,0.05)",
              transition: "background 0.4s",
            }}
          />
          <span
            className="text-[9px] tracking-[0.45em] uppercase font-semibold"
            style={{
              fontFamily: "'Courier New', monospace",
              color: focused ? accent : "rgba(255,255,255,0.18)",
              transition: "color 0.4s",
            }}
          >
            {question.label}
          </span>
        </div>

        {/* Вопрос */}
        <p
          className="text-lg leading-snug mb-7"
          style={{
            fontFamily: "'Georgia', serif",
            fontStyle: "italic",
            color: focused ? "rgba(255,255,255,0.88)" : "rgba(220,215,240,0.65)",
            letterSpacing: "-0.01em",
            transition: "color 0.4s ease",
          }}
        >
          {question.prompt}
        </p>

        {/* Поле ответа */}
        <div className="relative">
          <textarea
            ref={taRef}
            value={value}
            onChange={(e) => { onChange(e.target.value); autoResize(); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Начните здесь…"
            rows={1}
            className="w-full bg-transparent outline-none resize-none text-sm leading-relaxed overflow-hidden"
            style={{
              fontFamily: "'Georgia', serif",
              minHeight: "32px",
              border: "none",
              color: "rgba(230,225,255,0.75)",
            }}
          />
          <div className="relative h-px mt-2">
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.06)" }} />
            <motion.div
              animate={{
                scaleX: focused ? 1 : value.trim() ? 0.25 : 0,
                opacity: focused ? 1 : value.trim() ? 0.5 : 0,
              }}
              initial={{ scaleX: 0 }}
              transition={{ duration: 0.45 }}
              style={{
                position: "absolute",
                inset: 0,
                background: accent,
                transformOrigin: "left",
                height: "1px",
              }}
            />
          </div>
          {value.trim() && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute font-mono"
              style={{ bottom: "-20px", right: 0, fontSize: "10px", color: accent.replace("0.7)", "0.4)") }}
            >
              {value.trim().split(/\s+/).filter(Boolean).length} сл.
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Панель анализа ────────────────────────────────────────────────────────────
function LoadingOverlay() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setPhraseIndex((i) => (i + 1) % LOADING_PHRASES.length);
        setVisible(true);
      }, 420);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: "rgba(8,8,16,0.97)", backdropFilter: "blur(12px)" }}
    >
      <div className="text-center max-w-xs w-full">
        {/* Орб */}
        <motion.div
          animate={{ boxShadow: ["0 0 20px rgba(147,114,255,0.1)", "0 0 35px rgba(147,114,255,0.25)", "0 0 20px rgba(147,114,255,0.1)"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-full mx-auto mb-10 flex items-center justify-center"
          style={{ border: "1px solid rgba(147,114,255,0.2)", background: "rgba(147,114,255,0.05)", position: "relative" }}
        >
          {/* Пульсирующее кольцо */}
          <motion.div
            animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: "50%",
              border: "1px solid rgba(147,114,255,0.12)",
            }}
          />
          {/* Три точки */}
          <div className="flex gap-1.5 items-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(147,114,255,0.7)" }}
              />
            ))}
          </div>
        </motion.div>

        {/* Лейбл */}
        <p className="text-[9px] tracking-[0.45em] uppercase mb-6"
          style={{ fontFamily: "'Courier New', monospace", color: "rgba(147,114,255,0.3)" }}>
          Алгоритм изучает вас
        </p>

        {/* Фраза */}
        <motion.p
          key={phraseIndex}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -6 }}
          transition={{ duration: 0.4 }}
          className="text-lg font-light mb-8 leading-snug min-h-[3.5rem] flex items-center justify-center px-4"
          style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", color: "rgba(200,195,230,0.7)", letterSpacing: "-0.01em" }}
        >
          {LOADING_PHRASES[phraseIndex]}
        </motion.p>

        {/* Бегущая линия */}
        <div className="mx-auto overflow-hidden" style={{ width: 120, height: 1, background: "rgba(147,114,255,0.1)" }}>
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ height: "100%", width: "60%", background: "linear-gradient(90deg, rgba(147,114,255,0.7), rgba(80,200,180,0.7))" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

const SECTION_ACCENTS = [
  "rgba(147,114,255,0.6)",
  "rgba(255,142,107,0.6)",
  "rgba(80,200,180,0.6)",
  "rgba(255,107,142,0.6)",
];

function parseAnalysis(text: string) {
  const sections: { title: string; body: string }[] = [];
  const parts = text.split(/##\s+/);
  parts.forEach((part) => {
    if (!part.trim()) return;
    const lines = part.trim().split("\n");
    const title = lines[0].trim();
    const body = lines.slice(1).join("\n").trim();
    if (title && body) sections.push({ title, body });
  });
  return sections;
}

function AnalysisPanel({ name, analysis, onClose }: { name: string; analysis: string | null; onClose: () => void }) {
  const sections = analysis ? parseAnalysis(analysis) : [];
  const isMessage = (title: string) =>
    title.toLowerCase().includes("послани") || title.toLowerCase().includes("message");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: "rgba(8,8,16,0.97)", backdropFilter: "blur(12px)" }}
    >
      <div className="min-h-full flex items-start justify-center px-4 sm:px-6 py-12 sm:py-16">
        <div className="w-full max-w-lg">

          {/* Шапка */}
          <div className="text-center mb-10">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ border: "1px solid rgba(147,114,255,0.25)", background: "rgba(147,114,255,0.07)" }}
            >
              <Eye size={18} style={{ color: "rgba(147,114,255,0.7)" }} />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-light mb-2"
              style={{ fontFamily: "'Georgia', serif", color: "rgba(255,255,255,0.92)", letterSpacing: "-0.02em" }}
            >
              Профиль: <span style={{ color: "rgba(147,114,255,0.8)", fontStyle: "italic" }}>{name}</span>
            </h2>
            <p className="text-[9px] tracking-[0.45em] uppercase"
              style={{ fontFamily: "'Courier New', monospace", color: "rgba(147,114,255,0.3)" }}>
              Психологический анализ
            </p>
          </div>

          {/* Секции */}
          {sections.length > 0 ? (
            <div className="flex flex-col gap-0.5">
              {sections.map((sec, i) => {
                const msg = isMessage(sec.title);
                const accent = SECTION_ACCENTS[i % SECTION_ACCENTS.length];

                if (msg) {
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className="px-6 sm:px-8 py-7 sm:py-8"
                      style={{
                        background: "rgba(147,114,255,0.04)",
                        border: "1px solid rgba(147,114,255,0.1)",
                        borderLeft: "2px solid rgba(147,114,255,0.6)",
                        borderRadius: "0 8px 8px 0",
                        marginTop: "0.5rem",
                      }}
                    >
                      <p className="text-[9px] tracking-[0.45em] uppercase mb-4"
                        style={{ fontFamily: "'Courier New', monospace", color: "rgba(147,114,255,0.4)" }}>
                        Послание
                      </p>
                      <p
                        className="text-base sm:text-lg font-light leading-relaxed"
                        style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", color: "rgba(220,215,250,0.85)", letterSpacing: "-0.01em" }}
                      >
                        {sec.body}
                      </p>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="px-5 sm:px-7 py-6 sm:py-7"
                    style={{
                      background: "rgba(255,255,255,0.015)",
                      border: "1px solid rgba(255,255,255,0.04)",
                      borderLeft: `2px solid ${accent}`,
                      borderRadius: "0 4px 4px 0",
                      transition: "background 0.3s",
                    }}
                  >
                    <p className="text-[9px] tracking-[0.45em] uppercase mb-2"
                      style={{ fontFamily: "'Courier New', monospace", color: accent, opacity: 0.7 }}>
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3
                      className="text-base sm:text-lg font-light mb-3 leading-snug"
                      style={{ fontFamily: "'Georgia', serif", color: "rgba(255,255,255,0.85)", letterSpacing: "-0.01em" }}
                    >
                      {sec.title}
                    </h3>
                    <p className="text-sm leading-relaxed"
                      style={{ fontFamily: "sans-serif", color: "rgba(200,195,230,0.58)", fontWeight: 300 }}>
                      {sec.body}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "sans-serif" }}>
              Данные отсутствуют...
            </p>
          )}

          {/* Кнопка назад */}
          <div className="text-center pt-10 pb-4">
            <button
              onClick={onClose}
              className="text-[10px] uppercase tracking-[0.4em] transition-all duration-300"
              style={{ fontFamily: "sans-serif", color: "rgba(147,114,255,0.3)", background: "none", border: "none", cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(147,114,255,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(147,114,255,0.3)")}
            >
              ← Вернуться назад
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
// ─── Прогресс-бар ─────────────────────────────────────────────────────────────
function ProgressBar({ answered, total }: { answered: number; total: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-30" style={{ height: "1px", background: "rgba(255,255,255,0.04)" }}>
      <motion.div
        animate={{ width: `${(answered / total) * 100}%` }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: "100%",
          background: "linear-gradient(90deg, rgba(147,114,255,0.7) 0%, rgba(80,200,180,0.7) 100%)",
        }}
      />
    </div>
  );
}

// ─── Главный компонент ─────────────────────────────────────────────────────────
export default function PsychologicalProfiler() {
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const answered = Object.values(answers).filter((v) => v.trim()).length;

  const handleGetAnalysis = async () => {
    setIsLoading(true); 
    
    try {
      const formattedAnswers: Record<string, string> = {};
      Object.entries(answers).forEach(([id, val]) => {
        formattedAnswers[`question_${id}`] = val;
      });

      const response = await fetch("http://localhost:8000/analysis/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId, 
          answers: formattedAnswers
        }),
      });

      if (!response.ok) throw new Error("Ошибка анализа");

      const data = await response.json();
      console.log("Пришло от нейронки:", data.full_analysis);

      setAnalysisText(data.full_analysis);
      setShowAnalysis(true); 
      
    } catch (err) {
      console.error("Ошибка при получении анализа:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStart = async (username: string) => {
    try {
      const response = await fetch("http://localhost:8000/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username 
        }),
      });

      if (!response.ok) throw new Error("Ошибка при создании пользователя");

      const data = await response.json();
      
      setUserId(data.id); 
      setName(data.name); 
      
      console.log("Пользователь создан в БД. ID:", data.id);
    } catch (err) {
      console.error("Ошибка:", err);
      setName(username); 
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setShowScrollHint(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#080810", color: "rgba(230,225,255,0.75)", fontFamily: "'Georgia', serif" }}>
      <BinaryCanvas />

      {name && <ProgressBar answered={answered} total={QUESTIONS.length} />}

      <AnimatePresence>
        {!name && <NameModal onSubmit={(n) => handleStart(n)} />}
      </AnimatePresence>

      <AnimatePresence>
        {isLoading && <LoadingOverlay />}
      </AnimatePresence>

      <AnimatePresence>
        {showAnalysis && name && (
          <AnalysisPanel
            name={name}
            analysis={analysisText}
            onClose={() => setShowAnalysis(false)}
          />
        )}
      </AnimatePresence>

      {/* Основной контент */}
      <div
        className={`relative z-10 transition-all duration-1000 ${
          name ? "opacity-100 blur-0" : "opacity-0 blur-xl pointer-events-none"
        }`}
      >
        {/* ─── Шапка ─── */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: name ? 1 : 0, y: name ? 0 : -16 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="max-w-2xl mx-auto px-6 sm:px-10 pt-20 sm:pt-28 pb-16"
        >
          <p
            className="text-[9px] tracking-[0.55em] uppercase mb-12"
            style={{ color: "rgba(147,114,255,0.45)", fontFamily: "'Courier New', monospace" }}
          >
            Психологический профайлер
          </p>

          <h1
            className="text-4xl sm:text-5xl font-light mb-5 leading-tight"
            style={{ letterSpacing: "-0.025em", color: "rgba(255,255,255,0.95)" }}
          >
            Добро пожаловать - {" "}
            <span style={{ color: "rgba(147,114,255,0.8)", fontStyle: "italic" }}>{name}</span>
          </h1>

          <p
            className="text-sm leading-relaxed max-w-md"
            style={{ color: "rgba(200,195,230,0.48)", fontFamily: "sans-serif", fontWeight: 300 }}
          >
            Отвечайте честно — или молчите. Будьте собой. Спасибо что посетили мой сайт, я действительно вам благодарен, этот проект создан с душой специально для вас. 
            Если возникли идеи или что-то пошло не так, пишите мне в tg:{" "}
            <a 
              href="https://t.me/alwayswannafly9" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-indigo-300 underline underline-offset-4"
              style={{ color: "rgba(200,195,230,0.8)" }}
            >
              @alwayswannafly9
            </a>
          </p>

          {/* Счётчики */}
          <div className="flex items-center gap-5 mt-8">
            <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
              {QUESTIONS.length} вопросов
            </span>
            <span style={{ color: "rgba(147,114,255,0.25)" }}>·</span>
            <span
              className="text-xs font-mono"
              style={{ color: answered > 0 ? "rgba(147,114,255,0.7)" : "rgba(255,255,255,0.2)" }}
            >
              {answered} ответов
            </span>
          </div>
        </motion.header>

        {/* Подсказка прокрутки */}
        <AnimatePresence>
          {name && showScrollHint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >
              <span className="text-[9px] font-mono tracking-[0.4em] uppercase" style={{ color: "rgba(147,114,255,0.3)" }}>
                Прокрутите
              </span>
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown size={14} style={{ color: "rgba(147,114,255,0.25)" }} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Вопросы ─── */}
        <main className="max-w-2xl mx-auto px-6 sm:px-10 pb-10">
          <div style={{ borderTop: "1px solid rgba(147,114,255,0.07)" }}>
            {QUESTIONS.map((q, i) => (
              <QuestionRow
                key={q.id}
                question={q}
                index={i}
                value={answers[q.id] ?? ""}
                onChange={(val) => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
              />
            ))}
          </div>

          {/* ─── Кнопка отправки ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: name ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="py-24 flex flex-col items-center text-center gap-4"
          >
            <span className="text-[9px] font-mono tracking-[0.4em] uppercase mb-2" style={{ color: "rgba(147,114,255,0.35)" }}>
              {answered} из {QUESTIONS.length} вопросов
            </span>

            {/* Мини прогресс */}
            <div
              className="w-28 overflow-hidden mb-6"
              style={{ height: "1px", background: "rgba(147,114,255,0.1)" }}
            >
              <motion.div
                animate={{ width: `${(answered / QUESTIONS.length) * 100}%` }}
                transition={{ duration: 0.6 }}
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, rgba(147,114,255,0.7), rgba(80,200,180,0.7))",
                }}
              />
            </div>

            <motion.button
                onClick={handleGetAnalysis}
                disabled={isLoading || answered < 1} 
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.97 } : {}}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="group relative flex items-center gap-4 px-10 py-4 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: "rgba(147,114,255,0.07)",
                  border: "1px solid rgba(147,114,255,0.18)",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(147,114,255,0.12)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(147,114,255,0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(147,114,255,0.07)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(147,114,255,0.18)";
                }}
              >
              <span
                className="text-xs tracking-[0.3em] uppercase font-semibold"
                style={{ fontFamily: "sans-serif", color: "rgba(200,185,255,0.8)" }}
              >
                {isLoading ? "Алгоритм изучает вас..." : "Получить анализ"}
              </span>

              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={13} style={{ color: "rgba(147,114,255,0.8)" }} />
                </motion.div>
              ) : (
                <Sparkles size={13} style={{ color: "rgba(147,114,255,0.5)" }} />
              )}
            </motion.button>

            <p className="text-[10px] mt-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.15)", fontFamily: "sans-serif" }}>
              Данные не сохраняются.
            </p>
          </motion.div>
        </main>

        {/* ─── Подвал ─── */}
        <footer className="pb-12 text-center">
          <span
            className="text-[9px] font-mono tracking-[0.5em] uppercase"
            style={{ color: "rgba(147,114,255,0.18)" }}
          >
            Психологический профайлер &mdash; {new Date().getFullYear()}
          </span>
        </footer>
      </div>
    </div>
  );
}