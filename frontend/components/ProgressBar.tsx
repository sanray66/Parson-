"use client";

import { motion } from "framer-motion";

export default function ProgressBar({ answered, total }: { answered: number; total: number }) {
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