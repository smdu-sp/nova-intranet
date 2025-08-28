import { getPageBySlug } from "@/lib/cms";
import { notFound } from "next/navigation";
import { extractRouteParam } from "@/lib/nextjs-15-utils";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function CMSPage({ params }: PageProps) {
  const slug = await extractRouteParam(params, "slug");
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-[#0a3299]">
          Início
        </a>
        <span className="mx-2">/</span>
        <span>{page.title}</span>
      </nav>

      {/* Conteúdo da página */}
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {/* Cabeçalho */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-[#0a3299] mb-4">
            {page.title}
          </h1>

          {page.meta_description && (
            <p className="text-lg text-gray-600 leading-relaxed">
              {page.meta_description}
            </p>
          )}

          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span>
              Última atualização:{" "}
              {new Date(page.updated_at).toLocaleDateString("pt-BR")}
            </span>
            {page.created_by && <span>• Por: {page.created_by}</span>}
          </div>
        </header>

        {/* Conteúdo HTML */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    </div>
  );
}

// Gerar metadados dinâmicos para SEO
export async function generateMetadata({ params }: PageProps) {
  const slug = await extractRouteParam(params, "slug");
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
