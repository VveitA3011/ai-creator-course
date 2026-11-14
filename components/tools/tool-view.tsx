"use client";

import { Checklist, IncomeCalc } from "@/components/lesson-interactive";
import { qcItems } from "@/lib/tools";
import { BeatBuilder } from "./beat-builder";
import { PromptLibrary } from "./prompt-library";
import { StoryboardBoard } from "./storyboard-board";

export function ToolView({ slug }: { slug: string }) {
  switch (slug) {
    case "kich-ban":
      return <BeatBuilder />;
    case "storyboard":
      return <StoryboardBoard />;
    case "prompt":
      return <PromptLibrary />;
    case "checklist":
      return <Checklist id="qc-12" items={qcItems} />;
    case "thu-nhap":
      return <IncomeCalc />;
    default:
      return null;
  }
}
