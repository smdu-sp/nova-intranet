"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
} from "lucide-react";
import { useState } from "react";
import ClientOnly from "./client-only";

interface SimpleRichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function SimpleRichTextEditor({
  content,
  onChange,
  placeholder = "Digite seu conteúdo aqui...",
}: SimpleRichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4",
        placeholder,
      },
    },
    // Configurações para evitar problemas de SSR
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <ClientOnly
      fallback={
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-2">
            <div className="text-gray-500 text-sm">Carregando editor...</div>
          </div>
          <div className="min-h-[300px] p-4 bg-gray-50 flex items-center justify-center">
            <div className="text-gray-500">Inicializando editor...</div>
          </div>
        </div>
      }
    >
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* Toolbar simplificada */}
        <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-2">
          <Button
            variant={editor.isActive("bold") ? "default" : "outline"}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive("italic") ? "default" : "outline"}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={
              editor.isActive("heading", { level: 1 }) ? "default" : "outline"
            }
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className="h-8 px-2 text-xs"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant={
              editor.isActive("heading", { level: 2 }) ? "default" : "outline"
            }
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className="h-8 px-2 text-xs"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive("bulletList") ? "default" : "outline"}
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive("orderedList") ? "default" : "outline"}
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="h-8 w-8 p-0"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        {/* Editor content */}
        <EditorContent editor={editor} className="min-h-[300px]" />
      </div>
    </ClientOnly>
  );
}
