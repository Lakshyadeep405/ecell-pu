"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "25+", label: "Members" },
  { value: "3+", label: "Events" },
  { value: "2+", label: "Startups" },
  { value: "2+", label: "Mentors" },
];

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-black px-6 py-16 md:py-24">
      <div className="relative mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="liquid-glass flex flex-col items-center justify-center rounded-3xl p-6 sm:p-8 text-center"
            >
              <span 
                className="text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-serif), serif" }}
              >
                {stat.value}
              </span>
              <span className="mt-3 text-[10px] sm:text-xs uppercase tracking-widest text-white/40 font-semibold font-[family-name:var(--font-outfit)]">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
