"use client";
import React from "react";
import { motion } from "framer-motion";
import MagneticWrapper from "../CustomCursor/MagneticWrapper";
import styles from "./EmailDock.module.css";

interface EmailDockProps {
  email: string;
}

export const EmailDock: React.FC<EmailDockProps> = ({ email }) => {
  // Stagger variants for smooth container entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.4,
      },
    },
  } as const;

  // Stagger item entrance sliding up from 30px
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 0.8,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 14,
      },
    },
  } as const;

  // Vertical line entrance
  const lineVariants = {
    hidden: { opacity: 0, scaleY: 0 },
    show: {
      opacity: 0.8,
      scaleY: 1,
      transition: {
        delay: 0.8,
        duration: 0.5,
        ease: "easeOut",
      },
    },
  } as const;

  return (
    <motion.div
      className={styles.dock}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div
        variants={itemVariants}
        whileHover={{
          y: -8,
          opacity: 1,
          transition: { type: "spring", stiffness: 300, damping: 12 },
        }}
        style={{ originY: 1 }}
      >
        <MagneticWrapper range={120} strength={0.4}>
          <a
            href={`mailto:${email}`}
            className={styles.emailLink}
            aria-label={`Send email to ${email}`}
            title={email}
          >
            {email}
          </a>
        </MagneticWrapper>
      </motion.div>

      {/* Vertical accent line */}
      <motion.div
        className={styles.line}
        variants={lineVariants}
        style={{ originY: 0 }}
      />
    </motion.div>
  );
};

export default EmailDock;
