"use client";
import React from "react";
import { motion } from "framer-motion";
import MagneticWrapper from "../CustomCursor/MagneticWrapper";
import styles from "./SocialDock.module.css";

interface SocialItem {
  name: string;
  url: string;
  ariaLabel: string;
  icon: React.ReactNode;
}

interface SocialDockProps {
  githubUser?: string;
  linkedinUser?: string;
  instagramUser?: string;
  twitterUser?: string;
}

export const SocialDock: React.FC<SocialDockProps> = ({
  githubUser = "yourusername",
  linkedinUser = "yourusername",
  instagramUser = "yourusername",
  twitterUser = "yourusername",
}) => {
  const socialItems: SocialItem[] = [
    {
      name: "GitHub",
      url: `https://github.com/${githubUser}`,
      ariaLabel: "Visit GitHub Profile",
      icon: (
        <svg viewBox="0 0 24 24" className={styles.svgIcon}>
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: `https://linkedin.com/in/${linkedinUser}`,
      ariaLabel: "Visit LinkedIn Profile",
      icon: (
        <svg viewBox="0 0 24 24" className={styles.svgIcon}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      ),
    },

    {
      name: "Instagram",
      url: `https://instagram.com/${instagramUser}`,
      ariaLabel: "Visit Instagram Profile",
      icon: (
        <svg viewBox="0 0 24 24" className={styles.svgIcon}>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      ),
    },
    {
      name: "Twitter",
      url: `https://x.com/${twitterUser}`,
      ariaLabel: "Visit Twitter/X Profile",
      icon: (
        <svg viewBox="0 0 24 24" className={styles.svgIcon}>
          <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
        </svg>
      ),
    },
  ];

  const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Stagger variants for smooth container entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
      <div className={styles.iconList}>
        {socialItems.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{
              y: -8,
              scale: 1.15,
              opacity: 1,
              transition: { type: "spring", stiffness: 300, damping: 12 },
            }}
            style={{ originY: 1 }}
          >
            <MagneticWrapper range={120} strength={0.4}>
              <button
                className={styles.iconLink}
                onClick={() => handleLinkClick(item.url)}
                aria-label={item.ariaLabel}
                title={item.name}
              >
                {item.icon}
              </button>
            </MagneticWrapper>
          </motion.div>
        ))}
      </div>

      {/* Vertical accent line */}
      <motion.div
        className={styles.line}
        variants={lineVariants}
        style={{ originY: 0 }}
      />
    </motion.div>
  );
};

export default SocialDock;
