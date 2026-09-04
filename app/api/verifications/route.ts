import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let documentNumber = "";

  try {
    const body = await request.json();
    documentNumber =
      typeof body?.documentNumber === "string"
        ? body.documentNumber.replace(/\D/g, "")
        : "";
  } catch {
    documentNumber = "";
  }

  if (documentNumber.length !== 11) {
    return NextResponse.json(
      { error: "CPF deve conter 11 dígitos" },
      { status: 400 },
    );
  }

  const baseUrl = process.env.LEGITIMUZ_API_BASE_URL;
  const apiKey = process.env.LEGITIMUZ_API_KEY;

  if (!baseUrl || !apiKey) {
    return NextResponse.json(
      { error: "Configuração da Legitimuz incompleta" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(
      `${baseUrl.replace(/\/+$/, "")}/public/verifications`,
      {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          schema_version: "1.0",
          document: { type: "cpf", number: documentNumber },
          ref_id: randomUUID(),
          flow_public_id: "01a06e75-9983-7794-ad7b-bf93fc9ef4d5",
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error("Legitimuz rejeitou a criação da verificação");
    }

    const data = await response.json();
    const sdkUrl = data?.entry?.url;

    if (typeof sdkUrl !== "string" || !sdkUrl) {
      throw new Error("Resposta da Legitimuz sem URL de entrada");
    }

    return NextResponse.json({ sdkUrl });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível iniciar a verificação" },
      { status: 502 },
    );
  }
}
