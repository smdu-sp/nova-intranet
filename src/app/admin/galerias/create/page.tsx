"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Upload, X, Plus } from "lucide-react";
import Image from "next/image";

interface GalleryImage {
  file: File;
  preview: string;
  caption: string;
  alt_text: string;
}

export default function CreateGalleryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: GalleryImage[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      caption: "",
      alt_text: "",
    }));
    setGalleryImages((prev) => [...prev, ...newImages]);
    // Limpar o input para permitir selecionar os mesmos arquivos novamente se necessário
    e.target.value = "";
  };

  const handleImageUpdate = (
    index: number,
    field: keyof GalleryImage,
    value: string
  ) => {
    setGalleryImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, [field]: value } : img))
    );
  };

  const handleImageRemove = (index: number) => {
    setGalleryImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      return newImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !coverImage) {
      alert("Título e imagem de capa são obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("is_published", isPublished.toString());
      formData.append("cover_image", coverImage);

      // Adicionar imagens da galeria
      galleryImages.forEach((img, index) => {
        formData.append(`gallery_images[${index}][file]`, img.file);
        formData.append(`gallery_images[${index}][caption]`, img.caption);
        formData.append(`gallery_images[${index}][alt_text]`, img.alt_text);
      });

      const response = await fetch("/api/admin/galleries", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        router.push("/admin/galerias");
      } else {
        alert("Erro ao criar galeria: " + result.message);
      }
    } catch (error) {
      console.error("Erro ao criar galeria:", error);
      alert("Erro ao criar galeria");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Criar Nova Galeria"
      description="Adicione uma nova galeria de fotos à intranet"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Criar Nova Galeria</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Galeria *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: SIPAT 2025 - Fotos do Evento"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o conteúdo da galeria..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Status de Publicação */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
                <Label htmlFor="published">Publicar galeria</Label>
              </div>

              {/* Imagem de Capa */}
              <div className="space-y-2">
                <Label>Imagem de Capa *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {coverPreview ? (
                    <div className="space-y-4">
                      <div className="relative w-full h-48 rounded-lg overflow-hidden">
                        <Image
                          src={coverPreview}
                          alt="Preview da capa"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setCoverImage(null);
                          setCoverPreview("");
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 mx-auto text-gray-400" />
                      <div>
                        <Label htmlFor="cover_image" className="cursor-pointer">
                          <span className="text-blue-600 hover:text-blue-800">
                            Clique para selecionar
                          </span>
                          <input
                            id="cover_image"
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImageChange}
                            className="hidden"
                            required
                          />
                        </Label>
                        <p className="text-sm text-gray-500 mt-1">
                          PNG, JPG, GIF até 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Imagens da Galeria */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Imagens da Galeria</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Selecione múltiplas imagens de uma vez
                    </p>
                  </div>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImageAdd}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Imagens
                    </Button>
                  </div>
                </div>

                {galleryImages.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        {galleryImages.length} imagem
                        {galleryImages.length !== 1 ? "ns" : ""} selecionada
                        {galleryImages.length !== 1 ? "s" : ""}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setGalleryImages([])}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Limpar Todas
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {galleryImages.map((img, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div className="relative h-32">
                            <Image
                              src={img.preview}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => handleImageRemove(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <CardContent className="p-3 space-y-2">
                            <div>
                              <Label className="text-xs">Legenda</Label>
                              <Input
                                value={img.caption}
                                onChange={(e) =>
                                  handleImageUpdate(
                                    index,
                                    "caption",
                                    e.target.value
                                  )
                                }
                                placeholder="Legenda da imagem"
                                className="text-xs"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">
                                Texto Alternativo
                              </Label>
                              <Input
                                value={img.alt_text}
                                onChange={(e) =>
                                  handleImageUpdate(
                                    index,
                                    "alt_text",
                                    e.target.value
                                  )
                                }
                                placeholder="Descrição para acessibilidade"
                                className="text-xs"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/galerias")}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Criando..." : "Criar Galeria"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
