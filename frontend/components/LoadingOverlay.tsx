"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LOADING_PHRASES } from "@/constants/constants";

export function LoadingOverlay() {
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

export function parseAnalysis(text: string) {
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

