import type { Metadata } from "next";
import { EditorialPage } from "@/components/EditorialPage";
import { pageCopy } from "@/data/pages";

export const metadata: Metadata = { title: "Manifesto" };

export default function ManifestoPage() {
  return <EditorialPage {...pageCopy.manifesto} />;
}
