"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./ExperienceTimeline.module.css";

interface ExperienceItem {
  id: number;
  role: string;
  company: string;
  duration: string;
  description: string;
  type: "ai" | "blockchain" | "software";
  tech: string[];
  achievements: string[];
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: 1,
    role: "Software AI Developer Intern",
    company: "Arithwise Solutions",
    duration: "Dec 2025 – Apr 2026",
    type: "ai",
    description: "Upgraded a full-stack AI platform integrating 4 core modules: professional networking, collaborative coding, structured learning, and gamified assessments in a single ecosystem.",
    tech: ["React.js", "Node.js", "Socket.io", "PostgreSQL", "Prisma", "Geolocation API"],
    achievements: [
      "Created Loops, a real-time social networking module supporting 1:1 messaging, user connections, and interest-based public channels for community-driven interaction.",
      "Built a geolocation-based event discovery system supporting radius-based search and location tagging for 100+ events, improving event discoverability and user participation."
    ]
  },
  {
    id: 2,
    role: "Software Engineer Intern",
    company: "Avijo Healthcare",
    duration: "Apr 2025 – July 2025",
    type: "software",
    description: "Refactored backend architecture and integrated ABDM-aligned healthcare portal enabling registrations and facility management.",
    tech: ["Node.js", "Express", "MongoDB", "REST APIs", "ABDM SDK", "Docker"],
    achievements: [
      "Developed ABDM-aligned healthcare portal that can enable 10,000+ patient registrations and empower 1,000+ professionals.",
      "Refactored backend architecture and developed 10+ REST APIs, models, and controllers for user and facility management."
    ]
  },
  {
    id: 3,
    role: "AI Developer",
    company: "Freelancer",
    duration: "Present",
    type: "ai",
    description: "A real estate platform that helps users discover, compare, and evaluate properties with personalized recommendations. Combines smart search, interactive maps, and market insights to simplify buying and renting.",
    tech: ["React.js", "Tailwind CSS", "FastAPI", "SQLAlchemy", "SQLite", "PostgreSQL"],
    achievements: [
      "Built property comparison modules and smart search tools, simplifying property buying and renting.",
      "Integrated interactive maps and market data insights for property valuation and personalized recommendations.",
      "Created owner dashboard enabling easy property listing and management for faster search experiences."
    ]
  },
  {
    id: 4,
    role: "Co Lead",
    company: "Google Developer's Group",
    duration: "GDG on Campus",
    type: "software",
    description: "As Co-Lead of the Google Developer Groups (GDG) on Campus, I helped organize technical workshops, coding events, and community-building activities for students.",
    tech: ["Leadership", "Public Speaking", "Event Management", "Community Building", "Technical Workshops"],
    achievements: [
      "Collaborated with team members to drive student engagement and coordinate community-building activities.",
      "Fostered a campus culture of learning and innovation, empowering peers to explore emerging technologies."
    ]
  }
];

export default function ExperienceTimeline() {
  const [visibleRows, setVisibleRows] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -150px 0px", // Trigger slightly before the item reaches center viewport
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute("data-index"));
          if (!isNaN(index)) {
            setVisibleRows((prev) => (prev.includes(index) ? prev : [...prev, index]));
          }
        }
      });
    }, observerOptions);

    rowRefs.current.forEach((row) => {
      if (row) observer.observe(row);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const getIcon = (type: "ai" | "blockchain" | "software") => {
    switch (type) {
      case "ai":
        return (
          <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {/* Brain/Network Nodes */}
            <path d="M12 2v4M12 18v4M4 12H2M22 12h-2M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" strokeLinecap="round" />
            <circle cx="12" cy="12" r="4" strokeWidth="2" />
            <circle cx="12" cy="2" r="1" fill="currentColor" />
            <circle cx="12" cy="22" r="1" fill="currentColor" />
            <circle cx="2" cy="12" r="1" fill="currentColor" />
            <circle cx="22" cy="12" r="1" fill="currentColor" />
          </svg>
        );
      case "blockchain":
        return (
          <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {/* Isometric Cubes / Connected Blocks */}
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 22V12M2 7v10M22 7v10" strokeLinecap="round" />
          </svg>
        );
      case "software":
        return (
          <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {/* Terminal / Code Console */}
            <rect x="2" y="3" width="20" height="18" rx="2" strokeWidth="2" />
            <path d="M6 8l4 4-4 4M12 16h6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
    }
  };

  return (
    <section ref={containerRef} id="experience" className={styles.timelineSection}>
      {/* Background glow effects */}
      <div className={styles.bgGlowPurple} />
      <div className={styles.bgGlowCyan} />
      
      <div className={styles.container}>
        {/* Header Block */}
        <div className={styles.headerBlock}>
          <span className={styles.badge}>EXPERIENCE</span>
          <h2 className={styles.title}>My Work Experience</h2>
          <p className={styles.subtitle}>
            Building software, AI, and blockchain solutions that solve real-world problems
          </p>
        </div>

        {/* Timeline Roadmap */}
        <div className={styles.roadmap}>
          {EXPERIENCES.map((item, idx) => {
            const isLeft = idx % 2 === 0;
            const isVisible = visibleRows.includes(idx);
            
            // Accent Color determination
            let themeClass = styles.cyanTheme;
            if (item.type === "blockchain") themeClass = styles.purpleTheme;
            if (item.type === "software") themeClass = styles.blueTheme;

            return (
              <div
                key={item.id}
                ref={(el) => { rowRefs.current[idx] = el; }}
                data-index={idx}
                className={`${styles.row} ${isLeft ? styles.leftRow : styles.rightRow} ${
                  isVisible ? styles.rowVisible : ""
                } ${themeClass}`}
              >
                {/* 1. Card container */}
                <div className={styles.cardContainer}>
                  <div className={styles.card}>
                    {/* Glowing card border background */}
                    <div className={styles.cardBorderGlow} />

                    <div className={styles.cardHeader}>
                      <div className={styles.iconWrapper}>
                        {getIcon(item.type)}
                      </div>
                      <div className={styles.titleInfo}>
                        <h3 className={styles.cardRole}>{item.role}</h3>
                        <span className={styles.cardCompany}>{item.company}</span>
                      </div>
                      <span className={styles.cardDuration}>{item.duration}</span>
                    </div>

                    <p className={styles.cardDesc}>{item.description}</p>

                    {/* Achievements */}
                    <div className={styles.achievementsBlock}>
                      <span className={styles.blockTitle}>Key Contributions</span>
                      <ul className={styles.achievementsList}>
                        {item.achievements.map((ach, aIdx) => (
                          <li key={aIdx} className={styles.achItem}>
                            <span className={styles.bullet} />
                            {ach}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Badges */}
                    <div className={styles.badgeList}>
                      {item.tech.map((badge, bIdx) => (
                        <span key={bIdx} className={styles.techPill}>
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Timeline central node checkpoint */}
                <div className={styles.nodeColumn}>
                  <div className={styles.verticalTrack} />
                  <div className={styles.nodeWrapper}>
                    <div className={styles.pulseRing} />
                    <div className={styles.nodeCircle}>
                      <div className={styles.nodeInner} />
                    </div>
                  </div>
                </div>

                {/* 3. Dotted curve connector SVG */}
                <div className={styles.connectorContainer}>
                  <svg className={styles.connectorSvg} viewBox="0 0 100 80" fill="none" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`grad-cyan-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#4facfe" stopOpacity="0.2" />
                      </linearGradient>
                      <linearGradient id={`grad-purple-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#b92be2" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#ea00d9" stopOpacity="0.2" />
                      </linearGradient>
                      <linearGradient id={`grad-blue-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0066ff" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                    <path
                      className={styles.dottedPath}
                      d={isLeft ? "M 100,20 C 60,20 40,60 0,60" : "M 0,20 C 40,20 60,60 100,60"}
                      stroke={
                        item.type === "ai"
                          ? `url(#grad-cyan-${item.id})`
                          : item.type === "blockchain"
                          ? `url(#grad-purple-${item.id})`
                          : `url(#grad-blue-${item.id})`
                      }
                      strokeWidth="2.5"
                      strokeDasharray="6 6"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
