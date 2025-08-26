import { NextRequest, NextResponse } from "next/server";
import { getUpcomingBirthdays } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 API Route: Starting birthday fetch...");
    const birthdays = await getUpcomingBirthdays();

    console.log(
      "✅ API Route: Successfully fetched birthdays:",
      birthdays.length
    );
    return NextResponse.json({
      success: true,
      data: birthdays,
    });
  } catch (error) {
    console.error("❌ API Route Error:", error);

    let errorMessage = "Erro ao buscar aniversariantes";
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;

      // Specific error handling
      if (error.message.includes("ECONNREFUSED")) {
        errorMessage =
          "Conexão recusada - verifique se o servidor MySQL está rodando";
        statusCode = 503;
      } else if (error.message.includes("Access denied")) {
        errorMessage =
          "Acesso negado - verifique usuário e senha no arquivo .env";
        statusCode = 401;
      } else if (error.message.includes("Unknown database")) {
        errorMessage =
          "Banco de dados não encontrado - verifique o nome no arquivo .env";
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
