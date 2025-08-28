"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import { Bold, Italic } from "lucide-react";
import ClientOnly from "./client-only";
import { tiptapConfig } from "@/lib/tiptap-config";

interface BasicEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function BasicEditor({ content, onChange }: BasicEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    ...tiptapConfig.editorConfig,
    editorProps: {
      ...tiptapConfig.editorConfig.editorProps,
      attributes: {
        class:
          "min-h-[300px] p-4 border border-gray-300 rounded focus:outline-none",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <ClientOnly
      fallback={
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-300 p-2">
            <div className="text-gray-500 text-sm">Carregando editor...</div>
          </div>
          <div className="min-h-[300px] p-4 bg-gray-50 flex items-center justify-center">
            <div className="text-gray-500">Inicializando editor...</div>
          </div>
        </div>
      }
    >
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-2">
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
        </div>
        <EditorContent editor={editor} />
      </div>
    </ClientOnly>
  );
}
