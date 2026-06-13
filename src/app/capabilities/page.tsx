import type { Metadata } from "next";
import { EditorialPage } from "@/components/EditorialPage";
import { pageCopy } from "@/data/pages";

export const metadata: Metadata = { title: "Capabilities" };

export default function CapabilitiesPage() {
  return <EditorialPage {...pageCopy.capabilities} />;
}
