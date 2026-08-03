import { FrameworkError } from '@/utils/errors';
import { GoogleGenerativeAI, GenerationConfig } from '@google/genai';

export interface GenerationOptions {
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
}

export class GeminiService {
  private client: GoogleGenerativeAI;

  private constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new FrameworkError('Gemini API key not configured. Set VITE_GEMINI_API_KEY.', {});
    }
    this.client = new GoogleGenerativeAI({ apiKey });
  }

  private async healthCheckInternal(): Promise<void> {
    try {
      // Verify connectivity by generating a simple text response
      const model = this.client.getModel('gemini-3.5-flash');
      await model.generateContent({
        contents: [{ parts: [{ text: 'Hello' }] }],
        generationConfig: {},
      });
    } catch (error) {
      throw new FrameworkError('Gemini health check failed', { cause: error });
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.healthCheckInternal();
      return true;
    } catch {
      return false;
    }
  }

  public async generateText(
    model: string,
    prompt: string,
    options?: GenerationOptions
  ): Promise<string> {
    try {
      const modelInstance = this.client.getModel(model);
      const generationConfig: GenerationConfig = {
        temperature: options?.temperature,
        topP: options?.topP,
        topK: options?.topK,
        maxOutputTokens: options?.maxOutputTokens,
      };
      const result = await modelInstance.generateContent({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig,
      });
      return result.text();
    } catch (error) {
      throw new FrameworkError('Failed to generate text', { cause: error });
    }
  }

  public async generateJson(
    model: string,
    prompt: string,
    options?: GenerationOptions
  ): Promise<string> {
    try {
      const modelInstance = this.client.getModel(model);
      const generationConfig: GenerationConfig = {
        temperature: options?.temperature,
        topP: options?.topP,
        topK: options?.topK,
        maxOutputTokens: options?.maxOutputTokens,
        responseMimeType: 'application/json',
      };
      const result = await modelInstance.generateContent({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig,
      });
      return result.text();
    } catch (error) {
      throw new FrameworkError('Failed to generate JSON', { cause: error });
    }
  }

  public async streamText(
    model: string,
    prompt: string,
    options?: GenerationOptions
  ): Promise<string> {
    try {
      const modelInstance = this.client.getModel(model);
      const generationConfig: GenerationConfig = {
        temperature: options?.temperature,
        topP: options?.topP,
        topK: options?.topK,
        maxOutputTokens: options?.maxOutputTokens,
      };
      const stream = modelInstance.generateContentStream({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig,
      });

      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk.text();
      }
      return fullText;
    } catch (error) {
      throw new FrameworkError('Failed to stream text', { cause: error });
    }
  }
}

// Export singleton
export const geminiService = new GeminiService();
export default geminiService;