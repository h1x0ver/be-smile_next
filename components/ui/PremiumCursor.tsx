"use client";

import { useEffect, useRef, useState } from "react";

export default function PremiumCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;

    let ringX = 0;
    let ringY = 0;

    const speed = 0.12; // плавность

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      ringX += (mouseX - ringX) * speed;
      ringY += (mouseY - ringY) * speed;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      requestAnimationFrame(animate);
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;

      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor='hover']")
      ) {
        setHovered(true);
      }
    };

    const handleMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement;

      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor='hover']")
      ) {
        setHovered(false);
      }
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseover", handleMouseEnter);
    document.addEventListener("mouseout", handleMouseLeave);

    animate();

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", handleMouseEnter);
      document.removeEventListener("mouseout", handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* DOT */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#111111",
          transform: "translate3d(-50%, -50%, 0)",
        }}
      />

      {/* RING */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none transition-all duration-300"
        style={{
          width: hovered ? 42 : 28,
          height: hovered ? 42 : 28,
          borderRadius: "50%",
          border: "1px solid rgba(17,17,17,0.2)",
          transform: "translate3d(-50%, -50%, 0)",
          backdropFilter: "blur(2px)",
          background: hovered
            ? "radial-gradient(circle, rgba(217,199,162,0.25), transparent 70%)"
            : "transparent",
        }}
      />
    </>
  );
}