import type { Metadata } from "next";
import { EditorialPage } from "@/components/EditorialPage";
import { pageCopy } from "@/data/pages";

export const metadata: Metadata = { title: "Proof" };

export default function AwardsPage() {
  return <EditorialPage {...pageCopy.awards} />;
}
