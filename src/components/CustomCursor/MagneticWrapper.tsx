"use client";
import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticWrapperProps {
  children: React.ReactElement;
  range?: number;
  strength?: number;
}

export const MagneticWrapper: React.FC<MagneticWrapperProps> = ({
  children,
  range = 150,
  strength = 0.35,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Springs for the element's micro-translation toward the cursor
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.6 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let isAttracted = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < range) {
        isAttracted = true;

        // Pull strength increases as distance decreases
        // Element moves between 8px and 15px max towards cursor
        const pull = (1 - distance / range) * strength;
        x.set(dx * pull);
        y.set(dy * pull);

        // Notify custom cursor about the attraction
        window.dispatchEvent(
          new CustomEvent("magnetic-hover", {
            detail: {
              centerX,
              centerY,
              width: rect.width,
              height: rect.height,
              distance,
              dx,
              dy,
            },
          })
        );
      } else {
        if (isAttracted) {
          isAttracted = false;
          window.dispatchEvent(new CustomEvent("magnetic-leave"));
        }
        x.set(0);
        y.set(0);
      }
    };

    const handleMouseLeave = () => {
      if (isAttracted) {
        isAttracted = false;
        window.dispatchEvent(new CustomEvent("magnetic-leave"));
      }
      x.set(0);
      y.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (element) {
        element.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [range, strength, x, y]);

  // Merge motion styles onto the child element
  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
};

export default MagneticWrapper;
