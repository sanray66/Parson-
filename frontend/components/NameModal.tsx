"use client";

import { useEffect, useRef, useState} from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function NameModal({ onSubmit }: { onSubmit: (name: string) => void }) {
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
