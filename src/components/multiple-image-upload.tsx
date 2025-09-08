"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  X,
  Image as ImageIcon,
  ExternalLink,
  GripVertical,
  Edit,
  Trash2,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";

interface PageImage {
  id?: number;
  image_url: string;
  alt_text?: string;
  caption?: string;
  order_position: number;
  is_featured: boolean;
}

interface MultipleImageUploadProps {
  images: PageImage[];
  onImagesChange: (images: PageImage[]) => void;
  className?: string;
}

export default function MultipleImageUpload({
  images,
  onImagesChange,
  className = "",
}: MultipleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [editingImage, setEditingImage] = useState<PageImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione apenas arquivos de imagem.");
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const newImage: PageImage = {
            image_url: result.imageUrl,
            alt_text: file.name.replace(/\.[^/.]+$/, ""), // Nome do arquivo sem extensão
            caption: "",
            order_position: images.length,
            is_featured: images.length === 0, // Primeira imagem é destacada por padrão
          };

          const newImages = [...images, newImage];
          onImagesChange(newImages);
        } else {
          alert("Erro ao fazer upload: " + result.error);
        }
      } else {
        alert("Erro ao fazer upload da imagem");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Erro ao fazer upload da imagem");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // Reordenar as posições
    newImages.forEach((img, i) => {
      img.order_position = i;
    });
    onImagesChange(newImages);
  };

  const setFeaturedImage = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_featured: i === index,
    }));
    onImagesChange(newImages);
  };

  const updateImage = (index: number, updates: Partial<PageImage>) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], ...updates };
    onImagesChange(newImages);
    setEditingImage(null);
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);

    // Atualizar posições
    newImages.forEach((img, i) => {
      img.order_position = i;
    });

    onImagesChange(newImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Adicionar Imagens
        </label>

        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Arraste e solte imagens aqui, ou
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={openFileDialog}
                disabled={isUploading}
                className="mx-auto"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Fazendo upload..." : "Selecionar arquivos"}
              </Button>
            </div>

            <p className="text-xs text-gray-500">PNG, JPG, GIF até 5MB</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Images List */}
      {images.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Imagens da Página ({images.length})
          </label>

          <div className="space-y-3">
            {images.map((image, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                {/* Drag Handle */}
                <GripVertical className="h-4 w-4 text-gray-400 cursor-move mt-2" />

                {/* Image Preview */}
                <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                  <Image
                    src={image.image_url}
                    alt={image.alt_text || "Imagem"}
                    fill
                    className="object-cover"
                  />
                  {image.is_featured && (
                    <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                      ★
                    </div>
                  )}
                </div>

                {/* Image Details */}
                <div className="flex-1 min-w-0">
                  {editingImage === image ? (
                    // Edit Mode
                    <div className="space-y-2">
                      <Input
                        placeholder="Texto alternativo (alt)"
                        value={image.alt_text || ""}
                        onChange={(e) =>
                          updateImage(index, { alt_text: e.target.value })
                        }
                        className="text-sm"
                      />
                      <Input
                        placeholder="Legenda da imagem"
                        value={image.caption || ""}
                        onChange={(e) =>
                          updateImage(index, { caption: e.target.value })
                        }
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateImage(index, editingImage)}
                          className="text-green-600"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Salvar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingImage(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {image.alt_text || "Sem texto alternativo"}
                        </span>
                        {image.is_featured && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Destacada
                          </span>
                        )}
                      </div>
                      {image.caption && (
                        <p className="text-xs text-gray-600 truncate">
                          {image.caption}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Posição: {image.order_position + 1}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(image.image_url, "_blank")}
                          className="h-4 w-4 p-0"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {!image.is_featured && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setFeaturedImage(index)}
                      className="h-8 w-8 p-0 text-blue-600"
                      title="Definir como imagem destacada"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingImage(image)}
                    className="h-8 w-8 p-0"
                    title="Editar imagem"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeImage(index)}
                    className="h-8 w-8 p-0 text-red-600"
                    title="Remover imagem"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Reorder Instructions */}
          <p className="text-xs text-gray-500 mt-2">
            💡 Arraste as imagens para reordenar. A primeira imagem será exibida
            como destaque.
          </p>
        </div>
      )}
    </div>
  );
}
