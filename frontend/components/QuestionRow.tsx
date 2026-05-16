"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { QUESTIONS, ACCENT_COLORS, Question} from "@/constants/constants";

export default function QuestionRow({
  question,
  index,
  value,
  onChange,
}: {
  question: Question;
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