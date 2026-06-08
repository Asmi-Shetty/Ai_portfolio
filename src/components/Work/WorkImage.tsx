"use client";

import { useState } from "react";
import styles from "./Work.module.css";

interface Props {
  image: string;
  alt?: string;
  video?: string;
  link?: string;
}

const WorkImage = (props: Props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [video, setVideo] = useState("");

  const handleMouseEnter = () => {
    if (props.video) {
      setIsVideo(true);
      setVideo(props.video);
    }
  };

  return (
    <div className={styles.workImage}>
      <a
        className={styles.workImageIn}
        href={props.link || "#"}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVideo(false)}
        target={props.link ? "_blank" : undefined}
        rel={props.link ? "noopener noreferrer" : undefined}
        data-cursor="disable"
      >
        {props.link && (
          <div className={styles.workLink}>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 6v2h8.59L5 17.59 6.41 19 16 9.41V18h2V6H6z"></path>
            </svg>
          </div>
        )}
        <img src={props.image} alt={props.alt || ""} />
        {isVideo && <video src={video} autoPlay muted playsInline loop></video>}
      </a>
    </div>
  );
};

export default WorkImage;
