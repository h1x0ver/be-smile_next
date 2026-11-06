"use client";

import { motion } from "framer-motion";

export default function XRayOverlay() {
    return (
        <motion.div
            initial={{ y: "-20%" }}
            animate={{ y: "100%" }}
            transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
        >
            <div className="relative w-full h-full bg-black/18">
                <div className="absolute top-0 left-0 w-full h-px bg-primary/80 shadow-[0_0_8px_rgba(0,180,255,0.35)]" />
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/20 via-white/10 to-transparent sm:h-32" />
            </div>
        </motion.div>
    );
}