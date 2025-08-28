"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
} from "lucide-react";

interface FallbackEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function FallbackEditor({
  content,
  onChange,
}: FallbackEditorProps) {
  const [textContent, setTextContent] = useState(content);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setTextContent(newContent);
    onChange(newContent);
  };

  const addFormatting = (tag: string) => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let replacement = "";
    switch (tag) {
      case "bold":
        replacement = `**${selectedText}**`;
        break;
      case "italic":
        replacement = `*${selectedText}*`;
        break;
      case "h1":
        replacement = `# ${selectedText}`;
        break;
      case "h2":
        replacement = `## ${selectedText}`;
        break;
      case "list":
        replacement = `- ${selectedText}`;
        break;
      case "olist":
        replacement = `1. ${selectedText}`;
        break;
      default:
        replacement = selectedText;
    }

    const newContent =
      textarea.value.substring(0, start) +
      replacement +
      textarea.value.substring(end);
    setTextContent(newContent);
    onChange(newContent);

    // Restaurar foco e seleção
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + replacement.length);
    }, 0);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => addFormatting("bold")}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addFormatting("italic")}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addFormatting("h1")}
          className="h-8 px-2 text-xs"
        >
          H1
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addFormatting("h2")}
          className="h-8 px-2 text-xs"
        >
          H2
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addFormatting("list")}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addFormatting("olist")}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Textarea */}
      <textarea
        value={textContent}
        onChange={handleChange}
        className="w-full min-h-[300px] p-4 border-0 focus:outline-none resize-none"
        placeholder="Digite o conteúdo da sua página aqui..."
      />

      {/* Ajuda */}
      <div className="bg-gray-50 border-t border-gray-300 p-2 text-xs text-gray-600">
        <strong>Dica:</strong> Use **texto** para negrito, *texto* para itálico,
        # para títulos, - para listas
      </div>
    </div>
  );
}
