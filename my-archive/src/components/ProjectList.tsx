"use client";
import { useState } from "react";
import { Project } from "@/types";
import styles from "./ProjectList.module.css";
import PixelFlower from "./PixelFlower";

export default function ProjectList({ projects }: { projects: Project[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [view, setView] = useState<"list" | "index">("list");

  const getScreenshot = (url: string) =>
    `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        

        <h1 className={styles.heading}>
          {view === "index" && hoveredIndex !== null
            ? projects[hoveredIndex].title
            : "page of pages"}
             {/* <PixelFlower /> */}
        </h1>

        <div className={styles.controls}>
          <label className={styles.radio}>
            <input type="radio" name="view" value="list" checked={view === "list"} onChange={() => setView("list")} />
            list
          </label>
          <label className={styles.radio}>
            <input type="radio" name="view" value="index" checked={view === "index"} onChange={() => setView("index")} />
            index
          </label>
        </div>

        {view === "list" ? (
          <ul className={styles.list}>
            {projects.map((project, i) => (
              <li key={i} className={styles.item} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)} onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}>
                <a href={project.link} target="_blank" rel="noopener noreferrer">{project.title}</a>
                <span className={styles.date}>{project.date}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.grid}>
            {projects.map((project, i) => (
              <a key={i} href={project.link} target="_blank" rel="noopener noreferrer" className={styles.gridItem} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)} onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}>
                <img src={getScreenshot(project.link)} alt={project.title} className={styles.screenshot} />
              </a>
            ))}
          </div>
        )}

        {hoveredIndex !== null && (
          <div className={styles.tooltip} style={{ top: mousePos.y + 12, left: mousePos.x + 12 }}>
            {projects[hoveredIndex].bio}
          </div>
        )}
      </main>

      <aside className={styles.sidebar}>
        <div className={styles.sidebarSection}>
          <h2 className={styles.sidebarHeading}>about</h2>
          <p>home is people, place, feeling. i am still finding my home, but in the mean time, all the sites where i tried to build a home are here.</p>
        </div>
        <div className={styles.sidebarSection}>
          <h2 className={styles.sidebarHeading}>bio</h2>
          <p>natasha is a designer and creative technologist based in atlanta. tell her about your sites <a href="mailto:natashavalluri.design@gmail.com">here</a>.</p>
        </div>
      </aside>
    </div>
  );
}