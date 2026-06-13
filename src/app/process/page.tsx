import type { Metadata } from "next";
import { EditorialPage } from "@/components/EditorialPage";
import { pageCopy } from "@/data/pages";

export const metadata: Metadata = { title: "Process" };

export default function ProcessPage() {
  return <EditorialPage {...pageCopy.process} />;
}
