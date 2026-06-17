"use client";
import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMousePosition } from "./useMousePosition";
import ParticleTrail from "./ParticleTrail";
import styles from "./CustomCursor.module.css";

export const CustomCursor: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [attractionData, setAttractionData] = useState<{
    centerX: number;
    centerY: number;
    width: number;
    height: number;
    distance: number;
    dx: number;
    dy: number;
  } | null>(null);

  // 1. Raw Mouse Coordinates
  const { mouseX, mouseY } = useMousePosition();

  // 2. Cursor target position (follows mouse or locks onto magnetic wrapper centers)
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // 3. Spring interpolation for buttery smooth movement
  const springConfig = { damping: 25, stiffness: 220, mass: 0.6 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  // Background spotlight spring (slightly slower for a premium lazy trailing effect)
  const spotlightX = useSpring(cursorX, { damping: 30, stiffness: 180, mass: 0.8 });
  const spotlightY = useSpring(cursorY, { damping: 30, stiffness: 180, mass: 0.8 });

  // 4. Liquid stretch states during magnetic attraction
  const [stretchScaleX, setStretchScaleX] = useState(1);
  const [stretchScaleY, setStretchScaleY] = useState(1);
  const [rotateAngle, setRotateAngle] = useState(0);

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add("custom-cursor-active");
    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // A. Listen to Custom Magnetic Events
    const handleMagneticHover = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setAttractionData(detail);
      setIsHovered(true);
    };

    const handleMagneticLeave = () => {
      setAttractionData(null);
      setIsHovered(false);
      setStretchScaleX(1);
      setStretchScaleY(1);
      setRotateAngle(0);
    };

    // B. Detect hover on all standard interactive elements in the DOM (A tags, Buttons, Cards)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor='hover']") ||
        target.getAttribute("data-cursor") === "hover";

      if (isInteractive) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isStillInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor='hover']") ||
        target.getAttribute("data-cursor") === "hover";

      if (isStillInteractive) {
        setIsHovered(false);
      }
    };

    window.addEventListener("magnetic-hover", handleMagneticHover);
    window.addEventListener("magnetic-leave", handleMagneticLeave);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("magnetic-hover", handleMagneticHover);
      window.removeEventListener("magnetic-leave", handleMagneticLeave);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [mounted]);

  // C. Animation Frame update loop
  useEffect(() => {
    if (!mounted) return;

    let animationFrameId = 0;

    const tick = () => {
      const currentMouseX = mouseX.get();
      const currentMouseY = mouseY.get();

      // Update global CSS variables for dynamic spotlight text masking
      document.documentElement.style.setProperty("--mouse-viewport-x", `${currentMouseX}px`);
      document.documentElement.style.setProperty("--mouse-viewport-y", `${currentMouseY}px`);

      if (attractionData) {
        // Magnetic Pull logic: Lock on center with a micro offset towards the pointer (stretching effect)
        const { centerX, centerY, dx, dy, distance } = attractionData;
        
        // Attraction strength climbs as distance shrinks
        const influence = Math.max(0, 1 - distance / 150);
        
        const targetX = centerX + dx * (1 - influence * 0.88);
        const targetY = centerY + dy * (1 - influence * 0.88);

        cursorX.set(targetX);
        cursorY.set(targetY);

        // Apply visual liquid stretch deformation
        const angle = Math.atan2(dy, dx);
        const stretch = 1 + (distance / 150) * 0.4; // Max 40% stretch
        
        setStretchScaleX(stretch);
        setStretchScaleY(1 / stretch);
        setRotateAngle(angle * (180 / Math.PI)); // convert to degrees
      } else {
        // Normal state: follow mouse coordinates
        cursorX.set(currentMouseX);
        cursorY.set(currentMouseY);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted, attractionData, mouseX, mouseY]);

  if (!mounted) return null;

  // Render sizes and opacity based on active hover or magnetic states
  const orbSize = attractionData ? 48 : isHovered ? 40 : 16;
  const orbOpacity = attractionData || isHovered ? 0.35 : 0.8;

  return (
    <>
      {/* Background Spotlight Layer (Z-index 2 - behind text content) */}
      <div className={styles.bgSpotlight}>
        <motion.div
          className={styles.spotlightOrb}
          style={{
            x: spotlightX,
            y: spotlightY,
            width: isHovered ? 380 : 250,
            height: isHovered ? 380 : 250,
          }}
        />
      </div>

      {/* Foreground Interactive Cursor Layer (Z-index 99999 - above all) */}
      <div className={styles.cursorContainer}>
        {/* Canvas Particle Trail */}
        <ParticleTrail
          mouseX={mouseX}
          mouseY={mouseY}
          smoothX={smoothX}
          smoothY={smoothY}
        />

        {/* Core Glowing Orb */}
        <motion.div
          className={styles.orb}
          style={{
            x: smoothX,
            y: smoothY,
            width: orbSize,
            height: orbSize,
            opacity: orbOpacity,
            rotate: rotateAngle,
            scaleX: stretchScaleX,
            scaleY: stretchScaleY,
          }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
