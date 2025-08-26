import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { dbConfig } from "@/config/database";

export async function GET(request: NextRequest) {
  try {
    console.log("🧪 Testing database connection...");
    console.log("Database config:", {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port,
    });

    // Test connection
    const connection = await mysql.createConnection(dbConfig);
    console.log("✅ Database connection successful!");

    // Test query
    const [rows] = await connection.execute("SELECT 1 as test");
    console.log("✅ Test query successful:", rows);

    // Test table existence
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'tbl_telefones'"
    );
    console.log("✅ Table check result:", tables);

    // Test birthday query
    const [birthdayRows] = await connection.execute(`
      SELECT cp_nome, cp_nasc_mes, cp_nasc_dia, cp_departamento
      FROM tbl_telefones
      LIMIT 3
    `);
    console.log("✅ Birthday query test result:", birthdayRows);

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Database connection test successful",
      config: {
        host: dbConfig.host,
        database: dbConfig.database,
        port: dbConfig.port,
      },
      tableExists: Array.isArray(tables) && tables.length > 0,
    });
  } catch (error) {
    console.error("❌ Database connection test failed:", error);

    let errorMessage = "Erro ao conectar com o banco de dados";
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;

      if (error.message.includes("ECONNREFUSED")) {
        errorMessage =
          "Conexão recusada - servidor MySQL não está rodando ou IP incorreto";
        statusCode = 503;
      } else if (error.message.includes("Access denied")) {
        errorMessage = "Acesso negado - usuário ou senha incorretos";
        statusCode = 401;
      } else if (error.message.includes("Unknown database")) {
        errorMessage = "Banco de dados não encontrado";
        statusCode = 404;
      } else if (error.message.includes("ENOTFOUND")) {
        errorMessage = "Host não encontrado - verifique o IP do servidor";
        statusCode = 404;
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: statusCode }
    );
  }
}
