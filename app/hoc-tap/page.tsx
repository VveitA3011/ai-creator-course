import type { Metadata } from "next";
import { Dashboard } from "@/components/progress-ui";

export const metadata: Metadata = { title: "Học tập" };

export default function Learning() {
  return (
    <div className="stack">
      <h1>Học tập</h1>
      <Dashboard />
    </div>
  );
}
