"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SLIDER_IMAGES = [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1740979142180-c7aba7a038f4?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop"
];

export const Hero: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDER_IMAGES.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative w-full min-h-[92vh] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-zinc-950">
            {/* The Centered Image Container */}
            <div className="relative w-full max-w-7xl min-h-[80vh] py-16 rounded-3xl overflow-hidden shadow-2xl bg-zinc-950 flex items-center justify-center">

                {/* Background Image Slider with Framer Motion */}
                <AnimatePresence>
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0"
                    >
                        <img
                            src={SLIDER_IMAGES[currentSlide]}
                            alt="Fashion showcase"
                            className="w-full h-full object-cover object-center"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Gradient overlay to make text highly readable */}
                <div className="absolute inset-0 bg-black/40 dark:bg-black/50 z-10" />

                {/* Centered Content with Staggered Framer Motion */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative z-20 px-6 py-8 sm:px-12 sm:py-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-6 sm:space-y-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
                >

                    {/* Elegant Eyebrow */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-1.5 text-sm text-white backdrop-blur-md shadow-sm"
                    >
                        <span className="relative flex h-2 w-2 mr-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        <span className="uppercase tracking-[0.2em] text-xs font-semibold">Autumn Collection '26</span>
                    </motion.div>

                    {/* Main Typography */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-6"
                    >
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] font-light leading-none tracking-tighter text-white" style={{ fontFamily: "Georgia, serif", textShadow: "0 10px 40px rgba(0,0,0,0.3)" }}>
                            Anvika <br /> Fashions
                        </h1>
                        <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-white/90 font-light leading-relaxed drop-shadow-sm px-4">
                            Discover the essence of modern elegance. Curated pieces designed for the contemporary wardrobe, blending timeless aesthetics with premium craftsmanship.
                        </p>
                    </motion.div>

                    {/* Call to Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4"
                    >
                        <button className="inline-flex h-14 items-center justify-center rounded-none bg-white px-10 text-sm font-semibold uppercase tracking-[0.15em] text-black transition-all hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                            Shop Collection
                        </button>
                        <button className="inline-flex h-14 items-center justify-center rounded-none border border-white bg-transparent px-10 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-all hover:bg-white/10 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                            Explore Lookbook
                        </button>
                    </motion.div>
                </motion.div>

                {/* Slider Indicators positioned at the absolute bottom */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3"
                >
                    {SLIDER_IMAGES.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-1.5 rounded-full transition-all duration-500 ease-out ${index === currentSlide ? "w-12 bg-white" : "w-3 bg-white/50 hover:bg-white/80"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
