"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type MowerAvatarProps = {
  onComplete?: () => void;
};

export function MowerAvatar({ onComplete }: MowerAvatarProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div
        className="pointer-events-none absolute bottom-[10%] right-[4%] z-20 w-[min(58vw,320px)] sm:bottom-[12%] sm:right-[8%]"
        aria-hidden
      >
        <MowerArt />
      </div>
    );
  }

  return (
    <motion.div
      className="pointer-events-none absolute bottom-[8%] z-20 w-[min(62vw,340px)] sm:bottom-[10%]"
      initial={{ x: "-40vw", opacity: 0 }}
      animate={{ x: "115vw", opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 2.35,
        ease: [0.22, 0.61, 0.36, 1],
        opacity: { times: [0, 0.1, 0.86, 1], duration: 2.35 },
      }}
      onAnimationComplete={() => onComplete?.()}
      aria-hidden
    >
      <div className="mower-vibrate relative">
        <div className="absolute bottom-2 left-[20%] right-[15%] h-3 rounded-full bg-black/30 blur-[3px]" />
        <MowerArt />
        <GrassClips />
      </div>
    </motion.div>
  );
}

function MowerArt() {
  return (
    <div className="relative aspect-[16/9] w-full">
      <Image
        src="/avatar/owner-mower.webp"
        alt=""
        fill
        priority
        sizes="340px"
        className="object-contain object-bottom drop-shadow-2xl"
      />
    </div>
  );
}

function GrassClips() {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="absolute bottom-4 left-4 h-1.5 w-1.5 rounded-full bg-moss"
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 0.9, 0],
            x: -20 - i * 9,
            y: [0, -8 - i, 5],
          }}
          transition={{
            duration: 0.55,
            repeat: Infinity,
            delay: i * 0.08,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}
