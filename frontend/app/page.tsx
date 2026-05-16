"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";
import { QUESTIONS } from "@/constants/constants";

import BinaryCanvas from "@/components/BinaryCanvas"
import NameModal from "@/components/NameModal"
import QuestionRow from "@/components/QuestionRow"
import { LoadingOverlay } from "@/components/LoadingOverlay"
import ProgressBar from "@/components/ProgressBar";
import AnalysisPanel from "@/components/AnalysisPanel"


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

      const response = await fetch("/api/analysis/", {
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
      const response = await fetch("/api/users/", {
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
              transition={{ delay: 0.1, duration: 0.8 }}
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