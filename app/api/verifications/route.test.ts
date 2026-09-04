import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

describe("POST /api/verifications", () => {
  beforeEach(() => {
    vi.stubEnv("LEGITIMUZ_API_BASE_URL", "https://api.legitimuz.test/");
    vi.stubEnv("LEGITIMUZ_API_KEY", "secret-key");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("creates a verification and returns its entry URL", async () => {
    const upstreamResponse = {
      schema_version: "1.0",
      verification: {
        public_id: "verification-id",
        status: "pending",
        expires_at: "2026-09-01T18:30:00.000Z",
      },
      entry: {
        kind: "web",
        url: "https://verify.legitimuz.com/#v=verification-id",
      },
    };
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(upstreamResponse), {
        status: 201,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      new Request("http://localhost/api/verifications", {
        method: "POST",
        body: JSON.stringify({ documentNumber: "000.000.000-00" }),
      }),
    );
    const request = fetchMock.mock.calls[0];
    const body = JSON.parse(request[1].body);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(request[0]).toBe("https://api.legitimuz.test/public/verifications");
    expect(request[1].headers).toEqual({
      "x-api-key": "secret-key",
      "content-type": "application/json",
    });
    expect(body).toEqual({
      schema_version: "1.0",
      document: { type: "cpf", number: "00000000000" },
      ref_id: expect.stringMatching(/^[0-9a-f-]{36}$/),
      flow_public_id: "01a06e75-9983-7794-ad7b-bf93fc9ef4d5",
    });
    await expect(response.json()).resolves.toEqual({
      sdkUrl: "https://verify.legitimuz.com/#v=verification-id",
    });
    expect(response.status).toBe(200);
  });

  it("rejects requests when server configuration is missing", async () => {
    vi.stubEnv("LEGITIMUZ_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      new Request("http://localhost/api/verifications", {
        method: "POST",
        body: JSON.stringify({ documentNumber: "000.000.000-00" }),
      }),
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Configuração da Legitimuz incompleta",
    });
  });

  it("returns a gateway error when Legitimuz rejects the request", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 401 })),
    );

    const response = await POST(
      new Request("http://localhost/api/verifications", {
        method: "POST",
        body: JSON.stringify({ documentNumber: "000.000.000-00" }),
      }),
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      error: "Não foi possível iniciar a verificação",
    });
  });

  it("rejects a document that does not contain eleven digits", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      new Request("http://localhost/api/verifications", {
        method: "POST",
        body: JSON.stringify({ documentNumber: "123.456.789-0" }),
      }),
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "CPF deve conter 11 dígitos",
    });
  });
});
