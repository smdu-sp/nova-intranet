"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";

import FontFamily from "@tiptap/extension-font-family";
import FontSize from "@tiptap/extension-font-size";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Underline as UnderlineIcon,
  Type,
  Palette,
  Strikethrough,
  Code as CodeIcon,
  Quote,
  Minus,
  Undo,
  Redo,
} from "lucide-react";
import { useState } from "react";
import ClientOnly from "./client-only";
import { tiptapConfig } from "@/lib/tiptap-config";

interface AdvancedEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function AdvancedEditor({
  content,
  onChange,
}: AdvancedEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);
  const [showFontFamilyPicker, setShowFontFamilyPicker] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      Underline,

      FontFamily.configure({
        types: ["textStyle"],
      }),
      FontSize.configure({
        types: ["textStyle"],
      }),
      TextStyle,
      Color,
      Strike,
      Code,
      CodeBlock,
      Blockquote,
      HorizontalRule,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    ...tiptapConfig.editorConfig,
    editorProps: {
      ...tiptapConfig.editorConfig.editorProps,
      attributes: {
        class:
          "min-h-[400px] p-4 border border-gray-300 rounded focus:outline-none prose prose-sm max-w-none",
      },
    },
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

  const addHorizontalRule = () => {
    editor.chain().focus().setHorizontalRule().run();
  };

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const setFontSize = (size: string) => {
    editor.chain().focus().setFontSize(size).run();
  };

  const setFontFamily = (family: string) => {
    editor.chain().focus().setFontFamily(family).run();
  };

  return (
    <ClientOnly
      fallback={
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-300 p-2">
            <div className="text-gray-500 text-sm">
              Carregando editor avançado...
            </div>
          </div>
          <div className="min-h-[400px] p-4 bg-gray-50 flex items-center justify-center">
            <div className="text-gray-500">Inicializando editor...</div>
          </div>
        </div>
      }
    >
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* Barra de ferramentas principal */}
        <div className="bg-gray-50 border-b border-gray-300 p-2">
          <div className="flex flex-wrap gap-1 items-center">
            {/* Desfazer/Refazer */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="h-8 w-8 p-0"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="h-8 w-8 p-0"
            >
              <Redo className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Formatação de texto */}
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

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Títulos */}
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

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Listas */}
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

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Alinhamento */}
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

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Outros elementos */}
            <Button
              variant={editor.isActive("blockquote") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className="h-8 w-8 p-0"
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive("codeBlock") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className="h-8 w-8 p-0"
            >
              <CodeIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={addHorizontalRule}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Barra de ferramentas secundária */}
        <div className="bg-gray-50 border-b border-gray-300 p-2">
          <div className="flex flex-wrap gap-1 items-center">
            {/* Link */}
            <div className="relative">
              <Button
                variant={editor.isActive("link") ? "default" : "outline"}
                size="sm"
                onClick={() => setShowLinkInput(!showLinkInput)}
                className="h-8 px-3"
              >
                <LinkIcon className="h-4 w-4 mr-1" />
                Link
              </Button>
              {showLinkInput && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg p-2 shadow-lg z-10 min-w-[300px]">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://exemplo.com"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                      onKeyPress={(e) => e.key === "Enter" && addLink()}
                    />
                    <Button size="sm" onClick={addLink} className="px-3 py-1">
                      Adicionar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowLinkInput(false)}
                      className="px-3 py-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                  {editor.isActive("link") && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={removeLink}
                      className="mt-2 w-full text-red-600"
                    >
                      Remover Link
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Cor do texto */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="h-8 px-3"
              >
                <Palette className="h-4 w-4 mr-1" />
                Cor
              </Button>
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg p-3 shadow-lg z-10">
                  <div className="grid grid-cols-8 gap-2">
                    {tiptapConfig.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setTextColor(color);
                          setShowColorPicker(false);
                        }}
                        className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform hover:border-gray-400"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tamanho da fonte */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFontSizePicker(!showFontSizePicker)}
                className="h-8 px-3"
              >
                <Type className="h-4 w-4 mr-1" />
                Tamanho
              </Button>
              {showFontSizePicker && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg p-2 shadow-lg z-10">
                  <div className="grid grid-cols-2 gap-1">
                    {tiptapConfig.fontSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setFontSize(size);
                          setShowFontSizePicker(false);
                        }}
                        className="px-3 py-1 text-sm hover:bg-gray-100 rounded text-left"
                        style={{ fontSize: size }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Família da fonte */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFontFamilyPicker(!showFontFamilyPicker)}
                className="h-8 px-3"
              >
                <Type className="h-4 w-4 mr-1" />
                Fonte
              </Button>
              {showFontFamilyPicker && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg p-2 shadow-lg z-10 min-w-[200px]">
                  <div className="space-y-1">
                    {tiptapConfig.fontFamilies.map((family) => (
                      <button
                        key={family}
                        onClick={() => {
                          setFontFamily(family);
                          setShowFontFamilyPicker(false);
                        }}
                        className="w-full px-3 py-1 text-sm hover:bg-gray-100 rounded text-left"
                        style={{ fontFamily: family }}
                      >
                        {family}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Área do editor */}
        <EditorContent editor={editor} />
      </div>
    </ClientOnly>
  );
}
