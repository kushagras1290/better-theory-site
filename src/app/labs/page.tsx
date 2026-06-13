import type { Metadata } from "next";
import { EditorialPage } from "@/components/EditorialPage";
import { pageCopy } from "@/data/pages";

export const metadata: Metadata = { title: "Labs" };

export default function LabsPage() {
  return <EditorialPage {...pageCopy.labs} />;
}
