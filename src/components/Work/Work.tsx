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
  github?: string;
  website?: string;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "AI Meeting Intelligence and RAG Assistant",
    subtitle: "Meeting transcription & conversational RAG insights",
    description: "AI-powered meeting assistant transcribing English/Hindi meetings from URLs or files. Built with LangChain and ChromaDB for conversational query retrieval, automated summaries, and exported PDF reports.",
    image: "/project_ai.png",
    tech: ["Python", "LangChain LCEL", "OpenAI Whisper", "Sarvam AI", "Mistral AI", "ChromaDB", "Hugging Face Embeddings", "RAG", "Streamlit"],
    github: "https://github.com/Asmi-Shetty/Video_Agent.git"
  },
  {
    id: 2,
    title: "Adaptive RAG: Agentic AI Chatbot",
    subtitle: "LangGraph multi-agent routing & semantic document search",
    description: "Adaptive RAG system dynamically routing queries between Qdrant document search and web search. Implements a multi-agent LangGraph workflow for relevance grading, chunking, and query rewriting.",
    image: "/project_security.png",
    tech: ["Python", "LangGraph", "FastAPI", "Qdrant", "MongoDB", "OpenAI API", "Streamlit", "REST APIs"],
    github: "https://github.com/Asmi-Shetty/Adaptive_Rag_AI.git"
  },
  
 {
    id: 3,
    title: "Loops: Full-Stack AI Platform",
    subtitle: "Networking, collaborative coding & structured learning ecosystem",
    description: "Upgraded a full-stack AI platform integrating collaborative coding, networking, learning, and assessments. Built Loops real-time messaging and geolocation event discovery.",
    image: "/project_defi.png",
    tech: ["React.js", "Node.js", "Python", "MERN", "Socket.io", "PostgreSQL", "Prisma", "Geolocation API"],
    website: "https://hexabeta.com/login"
  },
  {
    id: 4,
    title: "Ayushman Bharat Health Portal",
    subtitle: "ABDM-aligned digital healthcare scaling platform",
    description: "ABDM-aligned portal enabling 10,000+ patient registrations and empowering 1,000+ professionals. Refactored backend architecture with 10+ REST APIs for facility management.",
    image: "/project_iot.png",
    tech: ["Node.js", "Express", "MongoDB", "REST APIs", "ABDM SDK", "Docker"]
  },
  {
    id: 5,
    title: "Real Estate Platform",
    subtitle: "Property discovery, locality insights & smart search portal",
    description: "Full-stack property discovery platform across Nagpur. Features property listings, locality insights, and an intuitive search experience with FastAPI and PostgreSQL.",
    image: "/project_estates.png",
    tech: ["React.js", "Tailwind CSS", "FastAPI", "SQLAlchemy", "SQLite", "PostgreSQL"],
    website: "https://parthdeveloper.com/"
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
                <p className={styles.workDescription}>{project.description}</p>
                <h4>Tools and features</h4>
                <p>{project.tech.join(", ")}</p>

                {(project.github || project.website) && (
                  <div className={styles.projectLinks}>
                    {project.github && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.projectLinkBtn}
                        data-cursor="disable"
                      >
                        <svg className={styles.projectLinkIcon} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
                        </svg>
                        <span>GitHub</span>
                      </a>
                    )}
                    {project.website && (
                      <a 
                        href={project.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.projectLinkBtn}
                        data-cursor="disable"
                      >
                        <svg className={styles.projectLinkIcon} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        <span>Visit Website</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
              <WorkImage image={project.image} alt={project.title} link={project.github || project.website} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
