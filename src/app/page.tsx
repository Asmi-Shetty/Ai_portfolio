"use client";
import { useEffect, useRef, useState } from "react";
import VideoIntro from "@/components/VideoIntro/VideoIntro";
import ProjectCarousel from "@/components/ProjectCarousel/ProjectCarousel";
import ExperienceTimeline from "@/components/ExperienceTimeline/ExperienceTimeline";
import styles from "./page.module.css";

export default function Home() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const travelDistance = rect.height - window.innerHeight;
      if (travelDistance <= 0) return;

      // scrolled distance is the negative rect.top relative to the viewport
      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / travelDistance, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const activeIndex = scrollProgress < 0.33 ? 0 : scrollProgress < 0.66 ? 1 : 2;

  const getCardStyle = (index: number) => {
    const diff = activeIndex - index;

    if (diff === 0) {
      // Active card at the front
      return {
        opacity: 1,
        zIndex: 30,
        transform: "translate3d(0, 0, 0) scale(1)",
        pointerEvents: "auto" as const,
      };
    } else if (diff > 0) {
      // Card is in the background stack (previous card)
      return {
        opacity: 0.9 - diff * 0.15,
        zIndex: 30 - diff * 10,
        transform: `translate3d(0, ${-diff * 25}px, ${-diff * 50}px) scale(${1 - diff * 0.04})`,
        pointerEvents: "none" as const,
      };
    } else {
      // Card has not entered yet (in front)
      return {
        opacity: 0,
        zIndex: 40,
        transform: "translate3d(0, 350px, -100px) scale(0.95)",
        pointerEvents: "none" as const,
      };
    }
  };

  return (
    <main className={styles.main}>
      <VideoIntro videoSrc="/hero.mp4" />

      {/* Deck Scrolling Section */}
      <section ref={sectionRef} id="work" className={styles.deckSection}>
        <div className={styles.stickyContainer}>
          <div className={styles.deckInner}>
            <div className={styles.cardStack}>

              {/* Card 1: WHO I AM */}
              <div className={styles.cardWrapper} style={getCardStyle(0)}>
                <div className={styles.card}>
                  <span className={styles.cardHeader}>ABOUT - PROFILE</span>
                  <h3 className={styles.cardTitle}>WHO I AM</h3>

                  <p className={styles.cardBody}>
                    I build <em>Software applications</em>, <em>AI agents</em>, and <em>Blockchain Solutions</em> that transform ideas into scalable products. From <em>intelligent automation</em> and <em>agentic workflows</em> to <em>Full-stack applications</em> and <em>Web3 platforms</em>, I leverage cutting-edge technologies to create innovative and user-centric experiences.
                  </p>

                  <div className={styles.badgeContainer}>
                    {["SOFTWARE DEV", "AI AGENTS", "BLOCKCHAIN", "FULL STACK", "WEB3"].map((badge, idx) => (
                      <span key={idx} className={styles.badge}>{badge}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 2: TECHNICAL SKILLS */}
              <div className={styles.cardWrapper} style={getCardStyle(1)}>
                <div className={styles.card}>
                  <span className={styles.cardHeader}>ABOUT - ARSENAL</span>
                  <h3 className={styles.cardTitle}>TECHNICAL SKILLS</h3>
                  <span className={styles.outlineNumber}>02</span>

                  <div className={styles.skillsGrid}>
                    {/* Column 1 */}
                    <div className={styles.skillsColumn}>
                      <div className={styles.skillsCategory}>
                        <span className={styles.skillsLabel}>TECH STACK</span>
                        <div className={styles.skillsList}>
                          {["Python", "SQL", "C", "C++", "HTML", "CSS", "JavaScript", "React.js", "Node.js", "MongoDB", "MySQL"].map((item, idx) => (
                            <span key={idx} className={styles.skillPill}>{item}</span>
                          ))}
                        </div>
                      </div>

                      <div className={styles.skillsCategory}>
                        <span className={styles.skillsLabel}>OTHER SKILLS</span>
                        <div className={styles.skillsList}>
                          {["Communication", "Teamwork", "Leadership", "Problem-Solving", "Performance management"].map((item, idx) => (
                            <span key={idx} className={styles.skillPill}>{item}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className={styles.skillsColumn}>
                      <div className={styles.skillsCategory}>
                        <span className={styles.skillsLabel}>AI / ML</span>
                        <div className={styles.skillsList}>
                          {["Agentic Systems", "AI Security", "Generative AI Agents", "Generative Model Architectures", "LLM Application Development", "Retrieval-Augmented Generation (RAG)", "Tool Calling"].map((item, idx) => (
                            <span key={idx} className={styles.skillPill}>{item}</span>
                          ))}
                        </div>
                      </div>

                      <div className={styles.skillsCategory}>
                        <span className={styles.skillsLabel}>BLOCKCHAIN</span>
                        <div className={styles.skillsList}>
                          {["Solidity", "Ethereum", "Smart Contracts", "DApps", "DeFi", "Cryptocurrency", "NFTs"].map((item, idx) => (
                            <span key={idx} className={styles.skillPill}>{item}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Column 3 */}
                    <div className={styles.skillsColumn}>
                      <div className={styles.skillsCategory}>
                        <span className={styles.skillsLabel}>TOOLS</span>
                        <div className={styles.skillsList}>
                          {["LangChain", "LangGraph", "OpenAI API", "Vector Databases", "Model Context Protocol (MCP)", "Prompt Engineering", "Agentic Workflows", "GitHub", "Version Control", "ETL", "AWS"].map((item, idx) => (
                            <span key={idx} className={styles.skillPill}>{item}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: EDUCATION */}
              <div className={styles.cardWrapper} style={getCardStyle(2)}>
                <div className={styles.card}>
                  <span className={styles.cardHeader}>ABOUT - JOURNEY</span>
                  <h3 className={styles.cardTitle}>EDUCATION</h3>
                  <span className={styles.outlineNumber}>03</span>

                  <div className={styles.timeline}>
                    <div className={styles.educationItem}>
                      <div className={styles.educationDate}>DEC 2023</div>
                      <div className={styles.educationContent}>
                        <h4 className={styles.educationDegree}>Master of Science in Business Analytics</h4>
                        <span className={styles.educationSchool}>University of North Texas — Denton, TX</span>
                        <span className={styles.educationGpa}>GPA 4.0</span>
                      </div>
                    </div>

                    <div className={styles.educationItem}>
                      <div className={styles.educationDate}>MAY 2019</div>
                      <div className={styles.educationContent}>
                        <h4 className={styles.educationDegree}>Bachelor of Technology</h4>
                        <span className={styles.educationSchool}>JNTU College of Engineering — Jagtial, IN</span>
                        <span className={styles.educationGpa}>GPA 3.8</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Carousel */}
      <ProjectCarousel />

      {/* Work Experience Timeline */}
      <ExperienceTimeline />
    </main>
  );
}
