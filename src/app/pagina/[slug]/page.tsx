import { getPageBySlug } from "@/lib/cms";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CMSPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  // Redirecionar para o layout principal
  redirect(`/?page=${slug}`);
}

// Gerar metadados dinâmicos para SEO
export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: "Página não encontrada",
    };
  }

  return {
    title: `${page.title} - Intranet`,
    description: page.meta_description || `Página sobre ${page.title}`,
    openGraph: {
      title: page.title,
      description: page.meta_description || `Página sobre ${page.title}`,
      type: "article",
    },
  };
}
