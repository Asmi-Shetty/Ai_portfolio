"use client";
import React from "react";
import styles from "./Navbar.module.css";
import MagneticWrapper from "../CustomCursor/MagneticWrapper";

interface NavbarProps {
  onNavigate: (section: string) => void;
  visible: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, visible }) => {
  const navItems = [
    { number: "01.", label: "About", id: "about" },
    { number: "02.", label: "Experience", id: "experience" },
    { number: "03.", label: "Projects", id: "projects" },
    { number: "04.", label: "Skills", id: "skills" },
    { number: "05.", label: "Contact", id: "contact" }
  ];

  return (
    <nav className={`${styles.navbar} ${visible ? styles.visible : styles.hidden}`}>
      <div className={styles.navLinks}>
        {navItems.map((item) => (
          <MagneticWrapper key={item.id} strength={0.15}>
            <button 
              className={styles.navItem} 
              onClick={() => onNavigate(item.id)}
              data-cursor="hover"
            >
              <span className={styles.navNumber}>{item.number}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          </MagneticWrapper>
        ))}
        
        <MagneticWrapper strength={0.25}>
          <a 
            href="/ASMI-S-RESUME.pdf" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.resumeBtn}
            data-cursor="disable"
          >
            Resume
          </a>
        </MagneticWrapper>
      </div>
    </nav>
  );
};

export default Navbar;
