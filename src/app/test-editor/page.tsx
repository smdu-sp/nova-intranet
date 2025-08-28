"use client";

import { useState } from "react";
import BasicEditor from "@/components/basic-editor";

export default function TestEditorPage() {
  const [content, setContent] = useState("<p>Teste do editor</p>");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Teste do Editor</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Conteúdo atual:</h2>
        <div className="bg-gray-100 p-4 rounded border">
          <pre className="whitespace-pre-wrap">{content}</pre>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Editor:</h2>
        <BasicEditor content={content} onChange={setContent} />
      </div>
    </div>
  );
}
