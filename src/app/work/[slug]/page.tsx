import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkDetail from "@/components/WorkDetail";
import { projects } from "@/data/projects";
import { resolveProjectImages } from "@/lib/projectImages";

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
  const images = resolveProjectImages(project);
  return {
    title: `${project.title} — Ifteyaj`,
    description: project.short,
    keywords: [project.title, project.category, project.secondaryCategory, project.industry].filter(
      Boolean
    ) as string[],
    openGraph: {
      title: `${project.title} — Ifteyaj`,
      description: project.short,
      images: images[0] ? [{ url: images[0] }] : undefined,
    },
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return <WorkDetail project={{ ...project, images: resolveProjectImages(project) }} />;
}
