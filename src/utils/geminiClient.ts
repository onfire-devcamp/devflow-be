import {
  GoogleGenerativeAI,
  type GenerativeModel,
  type ResponseSchema,
} from "@google/generative-ai";

type ChatHistoryPart = { text: string };
type ChatHistoryItem = { role: string; parts: ChatHistoryPart[] };

class GeminiClient {
  private static instance: GeminiClient | null = null;
  private model: GenerativeModel;

  private constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined.");
    }

    const googleGenerativeAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    this.model = googleGenerativeAI.getGenerativeModel({ model: modelName });
  }

  public static getInstance(): GeminiClient {
    if (!GeminiClient.instance) GeminiClient.instance = new GeminiClient();
    return GeminiClient.instance;
  }

  public async generateText(
    prompt: string,
    systemInstruction: string,
  ): Promise<string> {
    const result = await this.model.generateContent({
      systemInstruction,
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

    return result.response.text();
  }

  public async generateChatResponse(
    history: ChatHistoryItem[],
    newPrompt: string,
    systemInstruction: string,
  ): Promise<string> {
    const contents = [
      ...history.map((item) => ({
        role: item.role === "mentor" ? "model" : "user",
        parts: item.parts.map((part) => ({ text: part.text })),
      })),
      {
        role: "user",
        parts: [{ text: newPrompt }],
      },
    ];

    const result = await this.model.generateContent({
      systemInstruction,
      contents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1024,
      },
    });

    return result.response.text();
  }

  public async generateStructuredResponse(
    prompt: string,
    schema: unknown,
    systemInstruction: string,
  ): Promise<unknown> {
    const result = await this.model.generateContent({
      systemInstruction,
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
        responseSchema: schema as ResponseSchema,
      },
    });

    const text = result.response.text();
    if (!text) {
      throw new Error("Gemini returned an empty structured response.");
    }

    try {
      return JSON.parse(text) as unknown;
    } catch {
      throw new Error("Gemini returned invalid JSON for structured output.");
    }
  }
}

export default GeminiClient.getInstance();
