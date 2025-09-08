"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestUploadPage() {
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ id: string; url: string; name: string }>
  >([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [testContent, setTestContent] = useState("");

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      console.log("Enviando arquivo:", file.name);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Resposta da API:", result);

        if (result.success && result.url && result.url.trim() !== "") {
          const newImage = {
            id: Date.now().toString(),
            url: result.url,
            name: file.name,
          };
          setUploadedImages((prev) => [newImage, ...prev]);
          console.log("Imagem adicionada:", newImage);
        } else {
          setUploadError("URL inválida recebida do servidor");
          console.error("URL inválida:", result);
        }
      } else {
        const errorResult = await response.json();
        setUploadError(errorResult.error || "Erro desconhecido no upload");
        console.error("Erro no upload:", errorResult);
      }
    } catch (error) {
      setUploadError("Erro de conexão. Tente novamente.");
      console.error("Erro ao fazer upload:", error);
    } finally {
      setUploading(false);
    }
  };

  const insertImage = (imageUrl: string) => {
    const imgTag = `<img src="${imageUrl}" alt="Imagem de teste" />`;
    setTestContent((prev) => prev + imgTag);
    console.log("Inserindo imagem:", imgTag);
  };

  const testImageDisplay = () => {
    console.log("Conteúdo de teste:", testContent);
    console.log(
      "Imagens encontradas:",
      (testContent.match(/<img/g) || []).length
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Teste de Upload e Inserção de Imagens
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload de imagens */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload de Imagens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full"
                  disabled={uploading}
                />

                {uploading && (
                  <div className="text-sm text-blue-600">Enviando...</div>
                )}

                {uploadError && (
                  <div className="text-sm text-red-600">❌ {uploadError}</div>
                )}

                {/* Lista de imagens enviadas */}
                {uploadedImages.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Imagens Enviadas:</h3>
                    <div className="space-y-2">
                      {uploadedImages.map((image) => (
                        <div
                          key={image.id}
                          className="flex items-center gap-2 p-2 border rounded"
                        >
                          <span className="text-sm">{image.name}</span>
                          <span className="text-xs text-gray-500">
                            {image.url}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => insertImage(image.url)}
                            className="ml-auto"
                          >
                            Inserir
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teste de renderização */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Teste de Renderização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={testImageDisplay}>Verificar Conteúdo</Button>

                <div className="border rounded p-4 min-h-32 bg-gray-50">
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: testContent }}
                  />
                </div>

                <div className="text-xs text-gray-600">
                  <strong>Debug:</strong> {testContent.length} caracteres
                  {testContent.includes("<img") &&
                    ` - ${(testContent.match(/<img/g) || []).length} imagens`}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
