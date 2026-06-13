import type { Metadata } from "next";
import { EditorialPage } from "@/components/EditorialPage";
import { pageCopy } from "@/data/pages";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return <EditorialPage {...pageCopy.contact} />;
}
