import type { Metadata } from "next";
import { PortfolioEditor } from "@/components/account/portfolio-editor";

export const metadata: Metadata = { title: "Portfolio của tôi" };

export default function Page() {
  return <PortfolioEditor />;
}
