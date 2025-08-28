// Configurações específicas para o TipTap
export const tiptapConfig = {
  // Configurações para evitar problemas de SSR
  editorConfig: {
    immediatelyRender: false,
    enableCoreExtensions: true,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
  },

  // Extensões básicas recomendadas
  basicExtensions: ["StarterKit"],

  // Extensões avançadas com formatação completa
  advancedExtensions: [
    "TextAlign",
    "Link",
    "Underline",
    "Highlight",
    "FontFamily",
    "FontSize",
    "Color",
    "TextStyle",
    "Subscript",
    "Superscript",
    "Strike",
    "Code",
    "CodeBlock",
    "Blockquote",
    "HorizontalRule",
    "Image",
    "Table",
    "TableRow",
    "TableCell",
    "TableHeader",
  ],

  // Cores disponíveis para o editor
  colors: [
    "#000000", // Preto
    "#FFFFFF", // Branco
    "#FF0000", // Vermelho
    "#00FF00", // Verde
    "#0000FF", // Azul
    "#FFFF00", // Amarelo
    "#FF00FF", // Magenta
    "#00FFFF", // Ciano
    "#FFA500", // Laranja
    "#800080", // Roxo
    "#008000", // Verde escuro
    "#000080", // Azul escuro
    "#800000", // Vermelho escuro
    "#808080", // Cinza
    "#C0C0C0", // Prata
    "#FFC0CB", // Rosa
    "#A52A2A", // Marrom
    "#FFD700", // Dourado
    "#32CD32", // Verde lima
    "#FF4500", // Laranja vermelho
    "#0a3299", // Azul da intranet
    "#333333", // Cinza escuro
    "#666666", // Cinza médio
  ],

  // Tamanhos de fonte disponíveis
  fontSizes: [
    "8px",
    "10px",
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "28px",
    "32px",
    "36px",
    "48px",
    "64px",
  ],

  // Famílias de fonte disponíveis
  fontFamilies: [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
    "Verdana",
    "Tahoma",
    "Trebuchet MS",
    "Impact",
    "Comic Sans MS",
    "Courier New",
    "Lucida Console",
    "Palatino",
    "Garamond",
    "Bookman",
    "Avant Garde",
  ],
};

// Função para verificar se está no cliente
export const isClient = typeof window !== "undefined";

// Função para verificar se o TipTap está disponível
export const isTipTapAvailable = () => {
  try {
    return isClient && require("@tiptap/react");
  } catch {
    return false;
  }
};
