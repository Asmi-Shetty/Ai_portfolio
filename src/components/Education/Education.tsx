"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./Education.module.css";

interface EducationItem {
  id: number;
  institution: string;
  degree: string;
  duration: string;
  details?: string;
}

const EDUCATION_DATA: EducationItem[] = [
  {
    id: 1,
    institution: "Shri Guru Gobind Singh Ji Institute of Engineering and Technology (SGGS), Nanded",
    degree: "B.Tech in Computer Science Engineering",
    duration: "2022 – 2026",
    details: "Focused on core computing systems, algorithm design, software engineering, and AI agent frameworks."
  },
  {
    id: 2,
    institution: "Gyan Mata Vidya Vihar, Nanded",
    degree: "SSC (Secondary School Certificate)",
    duration: "2020",
    details: "Completed secondary school education with academic distinction."
  }
];

export default function Education() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -100px 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, observerOptions);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={containerRef} id="education" className={styles.educationSection}>
      <div className={styles.bgGlow} />
      <div className={styles.container}>
        {/* Header Block */}
        <div className={`${styles.headerBlock} ${isVisible ? styles.visible : ""}`}>
          <h2 className={`${styles.title} spotlight-text`}>My Education</h2>
          <p className={styles.subtitle}>
            My academic foundation and educational milestones
          </p>
        </div>

        {/* Timeline container */}
        <div className={`${styles.timeline} ${isVisible ? styles.visible : ""}`}>
          {EDUCATION_DATA.map((item, idx) => (
            <div key={item.id} className={styles.timelineItem} style={{ animationDelay: `${idx * 0.25}s` }}>
              <div className={styles.timelineDateColumn}>
                <span className={styles.durationBadge}>{item.duration}</span>
              </div>
              <div className={styles.timelineNodeColumn}>
                <div className={styles.pulseRing} />
                <div className={styles.nodeCircle}>
                  <div className={styles.nodeInner} />
                </div>
              </div>
              <div className={styles.timelineContentCard}>
                <div className={styles.cardBorderGlow} />
                <h3 className={styles.degreeTitle}>{item.degree}</h3>
                <h4 className={styles.institutionName}>{item.institution}</h4>
                {item.details && <p className={styles.detailsText}>{item.details}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
