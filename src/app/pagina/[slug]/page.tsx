import { getPageBySlug } from "@/lib/cms";
import { notFound } from "next/navigation";
import { extractRouteParam } from "@/lib/nextjs-15-utils";
import Link from "next/link";
import Image from "next/image";

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#0a3299]">
          Início
        </Link>
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

        {/* Imagens da página */}
        {page.images && page.images.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[#0a3299] mb-4">
              Galeria de Imagens
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {page.images.map((image, index) => (
                <div key={index} className="space-y-2">
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || `Imagem ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {image.is_featured && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        ★ Destaque
                      </div>
                    )}
                  </div>
                  {image.caption && (
                    <p className="text-sm text-gray-600 text-center">
                      {image.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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
