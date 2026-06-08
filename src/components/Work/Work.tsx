"use client";

import WorkImage from "./WorkImage";
import styles from "./Work.module.css";

interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tech: string[];
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "AetherAgent",
    subtitle: "Autonomous AI Agent Orchestration",
    description: "An advanced multi-agent framework orchestrating collaborative workflows. Features high-performance semantic memory caching, real-time tool-calling protocols, and secure validation loops.",
    image: "/project_ai.png",
    tech: ["Python", "LangGraph", "OpenAI API", "Vector Databases", "MCP"]
  },
  {
    id: 2,
    title: "NovaDeFi",
    subtitle: "Web3 Yield Optimizer & Swap",
    description: "A gas-optimized liquidity pool and lending vault protocol on Ethereum. Achieves lower transaction fees with mathematical yield curve matching and custom gas optimizations.",
    image: "/project_defi.png",
    tech: ["Solidity", "Ethereum", "Smart Contracts", "DApps", "React.js"]
  },
  {
    id: 3,
    title: "SpecterShield",
    subtitle: "AI Cybersecurity Contract Auditor",
    description: "An automated real-time contract auditor and endpoint shield. Evaluates smart contracts for logical vulnerabilities and guards LLM endpoints against prompt injection attacks.",
    image: "/project_security.png",
    tech: ["Python", "PyTorch", "Node.js", "Next.js", "AI Security"]
  },
  {
    id: 4,
    title: "HeliosIoT",
    subtitle: "Decentralized Edge Telemetry Console",
    description: "An immersive real-time geographic telemetry console monitoring global IoT swarms. Secures device authentication using Web3 cryptographic signatures and decentralized identity.",
    image: "/project_iot.png",
    tech: ["React.js", "Rust", "WebAssembly", "Web3.js", "AWS"]
  }
];

interface WorkProps {
  sectionRef: React.RefObject<HTMLDivElement>;
  flexRef: React.RefObject<HTMLDivElement>;
}

const Work = ({ sectionRef, flexRef }: WorkProps) => {
  return (
    <div ref={sectionRef} className={styles.workSection} id="projects">
      <div className={`${styles.workContainer} section-container`}>
        <h2 className="spotlight-text">
          My <span>Work</span>
        </h2>
        <div ref={flexRef} className={styles.workFlex}>
          {PROJECTS.map((project, index) => (
            <div className={styles.workBox} key={project.id} data-cursor="hover">
              <div className={styles.workInfo}>
                <div className={styles.workTitle}>
                  <h3 className="spotlight-text">0{index + 1}</h3>

                  <div>
                    <h4 className="spotlight-text">{project.title}</h4>
                    <p>{project.subtitle}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.tech.join(", ")}</p>
              </div>
              <WorkImage image={project.image} alt={project.title} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
