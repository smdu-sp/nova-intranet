import { NextRequest, NextResponse } from "next/server";
import { networkInterfaces, hostname } from "os";

export async function GET(request: NextRequest) {
  try {
    // Obter nome do host (computador)
    const computerName = hostname();

    // Obter endereços IP
    const nets = networkInterfaces();
    let ipAddress = "Não disponível";

    // Procurar por IP local (não loopback)
    for (const name of Object.keys(nets)) {
      const interfaces = nets[name];
      if (interfaces) {
        for (const net of interfaces) {
          // Pular endereços IPv6 e loopback
          if (net.family === "IPv4" && !net.internal) {
            ipAddress = net.address;
            break;
          }
        }
      }
      if (ipAddress !== "Não disponível") break;
    }

    // Se não encontrou IP externo, usar o primeiro disponível
    if (ipAddress === "Não disponível") {
      for (const name of Object.keys(nets)) {
        const interfaces = nets[name];
        if (interfaces) {
          for (const net of interfaces) {
            if (net.family === "IPv4") {
              ipAddress = net.address;
              break;
            }
          }
        }
        if (ipAddress !== "Não disponível") break;
      }
    }

    console.log("✅ System info retrieved:", { computerName, ipAddress });

    return NextResponse.json({
      success: true,
      data: {
        hostname: computerName,
        ipAddress: ipAddress,
      },
    });
  } catch (error) {
    console.error("❌ Error getting system info:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao obter informações do sistema",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
