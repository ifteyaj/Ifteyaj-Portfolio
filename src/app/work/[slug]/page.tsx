import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkDetail from "@/components/WorkDetail";
import { projects } from "@/data/projects";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Not Found — Ifteyaj" };
  return {
    title: `${project.title} — Ifteyaj`,
    description: project.short,
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return <WorkDetail project={project} />;
}
