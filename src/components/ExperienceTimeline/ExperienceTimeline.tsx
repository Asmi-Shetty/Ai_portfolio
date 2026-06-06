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
    role: "Lead AI Engineer & Agentic Workflows Developer",
    company: "Aether AI Labs",
    duration: "Jan 2024 — Present",
    type: "ai",
    description: "Led the development of autonomous multi-agent orchestration frameworks for enterprise workflows. Spearheaded agentic tool-calling modules and optimized context-window efficiency for low-latency executions.",
    tech: ["Python", "LangChain", "LangGraph", "OpenAI API", "Vector Databases", "MCP", "Prompt Engineering", "AWS", "Agentic Workflows"],
    achievements: [
      "Built a multi-agent system that automated code reviews and unit test generation, cutting QA validation time by 45%.",
      "Implemented advanced RAG architectures with hybrid semantic-keyword search, achieving 93% accuracy on unstructured query retrieval.",
      "Formulated secure prompting guidelines and guardrail systems to mitigate LLM injection vulnerabilities across core endpoints."
    ]
  },
  {
    id: 2,
    role: "Blockchain & Web3 Developer",
    company: "Decentralized Labs",
    duration: "Jun 2021 — Dec 2023",
    type: "blockchain",
    description: "Designed and implemented high-performance DeFi protocols and smart contracts on EVM-compatible networks. Built secure multi-sig vault systems and dynamic NFT minting engines.",
    tech: ["Solidity", "Ethereum", "Smart Contracts", "DApps", "DeFi", "Cryptocurrency", "NFTs", "React.js", "Ethers.js"],
    achievements: [
      "Authored and audited Solidity smart contracts securing over $4M in Total Value Locked (TVL) with zero security breaches.",
      "Optimized gas consumption across complex liquidity pool contracts, reducing execution costs for end-users by 25%.",
      "Engineered a gas-efficient dynamic NFT project with on-chain metadata rendering and automated royalties distribution."
    ]
  },
  {
    id: 3,
    role: "Full Stack Software Engineer",
    company: "OmniTech Solutions",
    duration: "Jun 2019 — May 2021",
    type: "software",
    description: "Developed robust and scalable web applications, microservices, and relational/NoSQL databases. Configured containerized environments and automated CI/CD pipelines to streamline deployments.",
    tech: ["Node.js", "React.js", "JavaScript", "HTML", "CSS", "C", "C++", "SQL", "MongoDB", "MySQL", "GitHub", "Version Control"],
    achievements: [
      "Redesigned a core legacy dashboard into a single-page React application, improving client-side page load speed by 60%.",
      "Built and optimized high-throughput REST APIs handling 500,000+ daily requests with less than 120ms average response time.",
      "Implemented CI/CD pipelines using GitHub Actions, reducing deployment release cycles from 2 weeks to under 15 minutes."
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
