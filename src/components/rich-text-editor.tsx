"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import FontSize from "@tiptap/extension-font-size";
import Color from "@tiptap/extension-color";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Highlighter,
  Palette,
  Type,
} from "lucide-react";
import { useState } from "react";
import ClientOnly from "./client-only";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Digite seu conteúdo aqui...",
}: RichTextEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      FontFamily.configure({
        types: ["textStyle"],
      }),
      FontSize.configure({
        types: ["textStyle"],
      }),
      Color.configure({
        types: ["textStyle"],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
      },
    },
    // Configurações para evitar problemas de SSR
    immediatelyRender: false,
    enableCoreExtensions: true,
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const setFontSize = (size: string) => {
    editor.chain().focus().setFontSize(size).run();
  };

  const setFontFamily = (family: string) => {
    editor.chain().focus().setFontFamily(family).run();
  };

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

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
        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-2">
          {/* Text formatting */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
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
              variant={editor.isActive("underline") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className="h-8 w-8 p-0"
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive("strike") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className="h-8 w-8 p-0"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
          </div>

          {/* Text alignment */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <Button
              variant={
                editor.isActive({ textAlign: "left" }) ? "default" : "outline"
              }
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className="h-8 w-8 p-0"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={
                editor.isActive({ textAlign: "center" }) ? "default" : "outline"
              }
              size="sm"
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className="h-8 w-8 p-0"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={
                editor.isActive({ textAlign: "right" }) ? "default" : "outline"
              }
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className="h-8 w-8 p-0"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              variant={
                editor.isActive({ textAlign: "justify" })
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              className="h-8 w-8 p-0"
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>

          {/* Headings */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
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
              H1
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
              H2
            </Button>
            <Button
              variant={
                editor.isActive("heading", { level: 3 }) ? "default" : "outline"
              }
              size="sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className="h-8 px-2 text-xs"
            >
              H3
            </Button>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <Button
              variant={editor.isActive("bulletList") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className="h-8 w-8 p-0"
            >
              •
            </Button>
            <Button
              variant={editor.isActive("orderedList") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className="h-8 w-8 p-0"
            >
              1.
            </Button>
          </div>

          {/* Link */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <Button
              variant={editor.isActive("link") ? "default" : "outline"}
              size="sm"
              onClick={() => setShowLinkInput(!showLinkInput)}
              className="h-8 w-8 p-0"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            {editor.isActive("link") && (
              <Button
                variant="outline"
                size="sm"
                onClick={removeLink}
                className="h-8 px-2 text-xs"
              >
                Remover
              </Button>
            )}
          </div>

          {/* Highlight */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <Button
              variant={editor.isActive("highlight") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className="h-8 w-8 p-0"
            >
              <Highlighter className="h-4 w-4" />
            </Button>
          </div>

          {/* Font size */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <Type className="h-4 w-4 text-gray-600" />
            <select
              onChange={(e) => setFontSize(e.target.value)}
              className="text-xs border border-gray-300 rounded px-1 py-1"
            >
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px">16px</option>
              <option value="18px">18px</option>
              <option value="20px">20px</option>
              <option value="24px">24px</option>
              <option value="28px">28px</option>
              <option value="32px">32px</option>
            </select>
          </div>

          {/* Font family */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <select
              onChange={(e) => setFontFamily(e.target.value)}
              className="text-xs border border-gray-300 rounded px-1 py-1"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Helvetica">Helvetica</option>
            </select>
          </div>

          {/* Color picker */}
          <div className="flex items-center gap-1">
            <Palette className="h-4 w-4 text-gray-600" />
            <input
              type="color"
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Link input */}
        {showLinkInput && (
          <div className="bg-gray-100 p-2 border-b border-gray-300 flex gap-2">
            <input
              type="url"
              placeholder="Digite a URL..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
            />
            <Button size="sm" onClick={addLink}>
              Adicionar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowLinkInput(false)}
            >
              Cancelar
            </Button>
          </div>
        )}

        {/* Editor content */}
        <EditorContent editor={editor} className="min-h-[300px]" />
      </div>
    </ClientOnly>
  );
}
