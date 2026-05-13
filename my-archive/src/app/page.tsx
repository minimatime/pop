import { Project } from "@/types";
import ProjectList from "@/components/ProjectList";

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQEoZs6XwzCGKhtFACWQF4Z0dKEPELPIHQIIrgM9-M1_HZEUC1gpejA1JkPMmG06i2V3vhK5Z9xoXD9/pub?gid=0&single=true&output=csv";
function parseCSV(text: string): Project[] {
  const [headerLine, ...rows] = text.trim().split("\n");
  const headers = headerLine.split(",").map((h) => h.trim().toLowerCase());
  return rows.map((row) => {
    const values = row.split(",");
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h] = (values[i] ?? "").trim()));
    return obj as unknown as Project;
  });
}

export default async function Home() {
  const res = await fetch(SHEET_CSV_URL, { next: { revalidate: 3600 } });
  const text = await res.text();
  const projects = parseCSV(text);
  return <ProjectList projects={projects} />;
}
