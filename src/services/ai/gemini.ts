import { FrameworkError } from '@/utils/errors';
import { GoogleGenerativeAI, GenerateTextResponse, GenerateJsonResponse, StreamingResponse } from '@google/genai';

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
      await this.client.generateText({
        model: 'gemini-3.5-flash',
        prompt: 'Hello',
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
      const generationConfig = {
        temperature: options?.temperature,
        topP: options?.topP,
        topK: options?.topK,
        maxOutputTokens: options?.maxOutputTokens,
      };
      const response: GenerateTextResponse = await this.client.generateText({
        model,
        prompt,
        generationConfig,
      });
      return response.text;
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
      const generationConfig = {
        temperature: options?.temperature,
        topP: options?.topP,
        topK: options?.topK,
        maxOutputTokens: options?.maxOutputTokens,
      };
      const response: GenerateJsonResponse = await this.client.generateJson({
        model,
        prompt,
        generationConfig,
      });
      return response.text;
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
      const generationConfig = {
        temperature: options?.temperature,
        topP: options?.topP,
        topK: options?.topK,
        maxOutputTokens: options?.maxOutputTokens,
      };
      const response: StreamingResponse = await this.client.streamText({
        model,
        prompt,
        generationConfig,
      });
      return response.text;
    } catch (error) {
      throw new FrameworkError('Failed to stream text', { cause: error });
    }
  }
}

// Export singleton
export const geminiService = new GeminiService();
export default geminiService;