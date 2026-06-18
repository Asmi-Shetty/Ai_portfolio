"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import usePreloader from "./usePreloader";
import styles from "./Preloader.module.css";

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [showEnterBtn, setShowEnterBtn] = useState(false);
  const { progress, complete } = usePreloader(10000);

  useEffect(() => {
    if (complete) {
      setShowEnterBtn(true);
    }
  }, [complete]);

  const handleEnter = () => {
    setIsExiting(true);
    // Delay unmounting to allow the 1-second slide up & fade out transitions to play
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  // Lock body scroll while loader is active
  useEffect(() => {
    if (!isExiting) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isExiting]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className={styles.preloader}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Background Text Marquee */}
          <motion.div
            className={styles.bgTextWrapper}
            initial={{ y: 0, opacity: 1 }}
            animate={isExiting ? { y: "-100vh", opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className={styles.bgText}>
              CREATIVE DEVELOPER • A CREATIVE DEVELOPER • CREATIVE DEVELOPER • A CREATIVE DEVELOPER •
            </div>
          </motion.div>

          {/* Pill-shaped Black Loader Container */}
          <motion.div
            className={styles.loaderPill}
            initial={{ scale: 1, opacity: 1 }}
            animate={isExiting ? { scale: 0.84, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            {!showEnterBtn ? (
              <>
                <span className={styles.label}>LOADING</span>
                <span className={styles.percentage}>{progress}%</span>

                {/* Thin White Loading Bar */}
                <div
                  className={styles.progressBar}
                  style={{ width: `${progress}%` }}
                />
              </>
            ) : (
              <button
                className={styles.enterBtn}
                onClick={handleEnter}
                data-cursor="hover"
              >
                ENTER PORTFOLIO
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
