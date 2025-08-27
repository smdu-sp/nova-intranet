import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { dbConfig } from "@/config/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const field = searchParams.get("field") || "cp_nome";
    const letter = searchParams.get("letter");

    // Conectar ao banco
    const connection = await mysql.createConnection(dbConfig);

    let query = "SELECT * FROM tbl_telefones WHERE 1=1";
    let params: any[] = [];

    // Filtro de busca (prioridade sobre letra)
    if (search) {
      query += ` AND ${field} LIKE ?`;
      params.push(`%${search}%`);
    }
    // Filtro por letra inicial (só se não houver busca)
    else if (letter) {
      query += " AND cp_nome LIKE ?";
      params.push(`${letter}%`);
    }

    // Ordenar por nome
    query += " ORDER BY cp_nome";

    console.log("🔍 Executando query de contatos:", query);
    console.log("📝 Parâmetros:", params);
    console.log("🔤 Letra selecionada:", letter);
    console.log("🔍 Termo de busca:", search);
    console.log("📋 Campo de busca:", field);

    const [rows] = await connection.execute(query, params);
    const total = Array.isArray(rows) ? rows.length : 0;

    console.log(`✅ Contatos encontrados: ${total}`);

    // Log dos primeiros 3 resultados para debug
    if (Array.isArray(rows) && rows.length > 0) {
      console.log(
        "📋 Primeiros 3 resultados:",
        rows.slice(0, 3).map((r: any) => r.cp_nome)
      );
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      data: rows,
      total: total,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar contatos:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar contatos",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
