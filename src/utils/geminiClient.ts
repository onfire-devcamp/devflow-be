import fetch from "node-fetch";

type ChatHistoryPart = { text: string };
type ChatHistoryItem = { role: string; parts: ChatHistoryPart[] };

class GeminiClient {
  private static instance: GeminiClient | null = null;
  private apiKey: string | undefined;

  private constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
  }

  public static getInstance(): GeminiClient {
    if (!GeminiClient.instance) GeminiClient.instance = new GeminiClient();
    return GeminiClient.instance;
  }

  public async generateText(
    prompt: string,
    systemInstruction: string,
  ): Promise<string> {
    if (!this.apiKey) {
      return `${systemInstruction}\n\n[Mocked Response] ${prompt.slice(0, 120)}`;
    }

    const res = await fetch("https://api.example.com/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: `${systemInstruction}\n\n${prompt}` }),
    });
    const json = (await res.json()) as unknown;
    if (typeof json === "object" && json !== null && "output" in json) {
      const out = (json as Record<string, unknown>)["output"];
      return String(out ?? "");
    }
    return "";
  }

  public async generateChatResponse(
    history: ChatHistoryItem[],
    newPrompt: string,
    systemInstruction: string,
  ): Promise<string> {
    if (!this.apiKey) {
      const convo = history
        .map((h) => `${h.role}: ${h.parts.map((p) => p.text).join("\n")}`)
        .join("\n");
      return `${systemInstruction}\n\n[Mocked Chat Reply to] ${newPrompt}\n\n[Context]\n${convo}`;
    }

    const res = await fetch("https://api.example.com/chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        history,
        prompt: newPrompt,
        system: systemInstruction,
      }),
    });
    const json = (await res.json()) as unknown;
    if (typeof json === "object" && json !== null && "output" in json) {
      const out = (json as Record<string, unknown>)["output"];
      return String(out ?? "");
    }
    return "";
  }

  public async generateStructuredResponse(
    prompt: string,
    schema: unknown,
    systemInstruction: string,
  ): Promise<unknown> {
    if (!this.apiKey) {
      return {
        score: 7,
        passStatus: "PASS",
        feedback: "Mock: Good match to expected solution.",
      };
    }

    const res = await fetch("https://api.example.com/structured", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `${systemInstruction}\n\n${prompt}`,
        schema,
      }),
    });
    const json = (await res.json()) as unknown;
    if (typeof json === "object" && json !== null && "output" in json) {
      return (json as Record<string, unknown>)["output"] ?? null;
    }
    return null;
  }
}

export default GeminiClient.getInstance();
