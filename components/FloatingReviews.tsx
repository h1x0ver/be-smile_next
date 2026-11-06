"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

const reviews = [
  { text: "Perfect veneers result.", author: "Nigar", rating: 5 },
  { text: "Absolutely painless treatment.", author: "Aygun", rating: 5 },
  { text: "Best clinic experience ever.", author: "Elvin", rating: 5 },
  { text: "Felt safe and calm for the first time.", author: "David", rating: 5 },
  { text: "Modern equipment and great doctors.", author: "Kamran", rating: 5 },
  { text: "Outstanding professionalism.", author: "Leyla", rating: 5 },
  { text: "I finally love my smile.", author: "Anna", rating: 5 },
  { text: "Very gentle dentist.", author: "John", rating: 5 },
];

export default function FloatingReviews() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-[900px] overflow-hidden bg-white pt-32 pb-24">
      {/* Background glow */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="w-[1100px] h-[1100px] rounded-full bg-[radial-gradient(closest-side,rgba(146,239,231,0.262),transparent)] scale-[1.6]" />
      </div>

      <h2 className="relative z-20 text-center text-4xl md:text-6xl font-light mb-24">
        What Our Patients Say
      </h2>

      <div className="relative w-full h-[600px]">
        {reviews.map((review, i) => {
          const orbitRadius = 80 + (i % 4) * 70;
          const baseAngle = (i / reviews.length) * Math.PI * 2;

          const x = useTransform(mouseX, (v) => {
            const angle = baseAngle + v * 0.00025;
            return Math.cos(angle) * orbitRadius + window.innerWidth / 2 - 150;
          });

          const y = useTransform(mouseY, (v) => {
            const angle = baseAngle + v * 0.00025;
            return Math.sin(angle) * orbitRadius + 350;
          });

          return (
            <motion.div
              key={i}
              style={{ x, y }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: i * 0.15 }}
              whileHover={{
                scale: 1.15,
                rotate: 1,
                transition: { type: "spring", stiffness: 200 },
                zIndex: 20,
              }}
              className="absolute backdrop-blur-xl bg-white/80 border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-2xl p-6 w-[280px]"
            >
              <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                “{review.text}”
              </p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{review.author}</span>
                <span>{"⭐".repeat(review.rating)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-20 text-center text-[10px] uppercase tracking-[0.35em] text-gray-400">
        created with open ai team
      </p>
    </section>
  );
}
