import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          error: "Nenhuma imagem foi enviada",
        },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          error: "Arquivo deve ser uma imagem",
        },
        { status: 400 }
      );
    }

    // Validar tamanho (máximo 5MB)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: "Imagem deve ter no máximo 5MB",
        },
        { status: 400 }
      );
    }

    // Criar diretório de uploads se não existir
    const uploadDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = image.name.split(".").pop();
    const fileName = `${timestamp}-${randomString}.${extension}`;
    const filePath = join(uploadDir, fileName);

    // Converter File para Buffer e salvar
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Retornar URL da imagem
    const imageUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
      imageUrl,
      fileName,
      message: "Imagem enviada com sucesso",
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
