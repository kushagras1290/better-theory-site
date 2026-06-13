import type { Metadata } from "next";
import { EditorialPage } from "@/components/EditorialPage";
import { pageCopy } from "@/data/pages";

export const metadata: Metadata = { title: "Studio" };

export default function StudioPage() {
  return <EditorialPage {...pageCopy.studio} />;
}
