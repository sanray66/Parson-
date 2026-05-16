"use client";

import { motion } from "framer-motion";
import { parseAnalysis } from "@/components/LoadingOverlay"
import { SECTION_ACCENTS } from "@/constants/constants"
import { Eye } from "lucide-react";


export default function AnalysisPanel({ name, analysis, onClose }: { name: string; analysis: string | null; onClose: () => void }) {
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