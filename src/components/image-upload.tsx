"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Image as ImageIcon, ExternalLink } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  currentImage?: string | null;
  onImageChange: (imageUrl: string | null) => void;
  placeholder?: string;
  className?: string;
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  placeholder = "URL da imagem ou faça upload",
  className = "",
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(currentImage || "");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    onImageChange(url || null);
  };

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
          setImageUrl(result.imageUrl);
          onImageChange(result.imageUrl);
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

  const removeImage = () => {
    setImageUrl("");
    onImageChange(null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* URL Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          URL da Imagem
        </label>
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder={placeholder}
            value={imageUrl}
            onChange={(e) => handleImageUrlChange(e.target.value)}
            className="flex-1"
          />
          {imageUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open(imageUrl, "_blank")}
              className="px-3"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Upload Area */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Ou faça upload de uma imagem
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
                Arraste e solte uma imagem aqui, ou
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={openFileDialog}
                disabled={isUploading}
                className="mx-auto"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Fazendo upload..." : "Selecionar arquivo"}
              </Button>
            </div>

            <p className="text-xs text-gray-500">
              PNG, JPG, GIF até 5MB
            </p>
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

      {/* Image Preview */}
      {imageUrl && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Preview da Imagem
          </label>
          <div className="relative inline-block">
            <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={imageUrl}
                alt="Preview"
                fill
                className="object-cover"
                onError={() => {
                  // Fallback para imagem quebrada
                  setImageUrl("");
                  onImageChange(null);
                }}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeImage}
              className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-white border border-gray-300 hover:bg-red-50 hover:border-red-300"
            >
              <X className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
