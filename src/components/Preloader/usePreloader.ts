"use client";
import { useState, useEffect } from "react";

// Ease-out cubic formula for natural, smooth loading deceleration
const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

export const usePreloader = (duration = 2500, onComplete?: () => void) => {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let startTimestamp: number | null = null;
    let animationFrameId = 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progressRatio = Math.min(elapsed / duration, 1);

      // Interpolate progress smoothly using ease-out cubic
      const easedRatio = easeOutCubic(progressRatio);
      const currentProgress = Math.floor(easedRatio * 100);
      setProgress(currentProgress);

      if (progressRatio < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setComplete(true);
        onComplete?.();
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [duration, onComplete]);

  return { progress, complete };
};

export default usePreloader;
