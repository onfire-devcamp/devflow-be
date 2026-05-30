type ChatHistoryPart = { text: string };
type ChatHistoryItem = { role: string; parts: ChatHistoryPart[] };

type GeminiPart = { text: string };
type GeminiContent = { role: string; parts: GeminiPart[] };

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

type GeminiResponseSchema = {
  type: string;
  properties?: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
};

class GeminiClient {
  private static instance: GeminiClient | null = null;
  private apiKey: string | undefined;
  private model: string;

  private constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  }

  private buildUrl(): string {
    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY is not defined.");
    }

    return `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
  }

  private extractText(response: GeminiGenerateContentResponse): string {
    const text = response.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();

    return text ?? "";
  }

  private async generateContent(
    payload: Record<string, unknown>,
  ): Promise<GeminiGenerateContentResponse> {
    const res = await fetch(this.buildUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Gemini request failed with status ${res.status}: ${errorText}`,
      );
    }

    return (await res.json()) as GeminiGenerateContentResponse;
  }

  public static getInstance(): GeminiClient {
    if (!GeminiClient.instance) GeminiClient.instance = new GeminiClient();
    return GeminiClient.instance;
  }

  public async generateText(
    prompt: string,
    systemInstruction: string,
  ): Promise<string> {
    const response = await this.generateContent({
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1024,
      },
    });

    return this.extractText(response);
  }

  public async generateChatResponse(
    history: ChatHistoryItem[],
    newPrompt: string,
    systemInstruction: string,
  ): Promise<string> {
    const contents: GeminiContent[] = [
      ...history.map((item) => ({
        role: item.role === "mentor" ? "model" : "user",
        parts: item.parts.map((part) => ({ text: part.text })),
      })),
      {
        role: "user",
        parts: [{ text: newPrompt }],
      },
    ];

    const response = await this.generateContent({
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1024,
      },
    });

    return this.extractText(response);
  }

  public async generateStructuredResponse(
    prompt: string,
    schema: unknown,
    systemInstruction: string,
  ): Promise<unknown> {
    const response = await this.generateContent({
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 512,
        responseMimeType: "application/json",
        responseSchema: schema as GeminiResponseSchema,
      },
    });

    const text = this.extractText(response);
    if (!text) {
      throw new Error("Gemini returned an empty structured response.");
    }

    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }
}

export default GeminiClient.getInstance();
