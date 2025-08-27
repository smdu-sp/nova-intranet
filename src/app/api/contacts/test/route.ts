import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { dbConfig } from "@/config/database";

export async function GET(request: NextRequest) {
  try {
    // Conectar ao banco
    const connection = await mysql.createConnection(dbConfig);

    // Query simples para testar
    const query = "SELECT COUNT(*) as total FROM tbl_telefones";
    const [rows] = await connection.execute(query);

    console.log("🔍 Teste da API - Total de contatos:", rows);

    // Query para ver alguns exemplos
    const sampleQuery = "SELECT cp_nome, cp_cargo FROM tbl_telefones LIMIT 5";
    const [sampleRows] = await connection.execute(sampleQuery);

    console.log("📋 Exemplos de contatos:", sampleRows);

    await connection.end();

    return NextResponse.json({
      success: true,
      total: rows[0]?.total || 0,
      samples: sampleRows,
    });
  } catch (error) {
    console.error("❌ Erro no teste da API:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao testar API",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
