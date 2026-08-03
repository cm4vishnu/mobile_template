import { FrameworkError } from '@/utils/errors';
import { GeminiPro, GenerateTextRequest, GenerateJsonRequest, GenerateStreamingRequest } from '@google/genai';

export interface GenerationOptions {
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
}

export class GeminiService {
  private client: GeminiPro;

  private constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new FrameworkError('Gemini API key not configured. Set VITE_GEMINI_API_KEY.', {});
    }
    this.client = new GeminiPro({ apiKey });
  }

  private async healthCheckInternal(): Promise<void> {
    try {
      // Simple request to verify connectivity
      await this.client.getModel('gemini-3.5-flash');
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
      const request: GenerateTextRequest = {
        model,
        prompt,
        generationConfig: options,
      };
      const response = await this.client.generateText(request);
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
      const request: GenerateJsonRequest = {
        model,
        prompt,
        generationConfig: options,
      };
      const response = await this.client.generateJSON(request);
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
      const request: GenerateStreamingRequest = {
        model,
        prompt,
        generationConfig: options,
      };
      const response = await this.client.generateStreamingText(request);
      return response.text;
    } catch (error) {
      throw new FrameworkError('Failed to stream text', { cause: error });
    }
  }
}

// Export singleton
export const geminiService = new GeminiService();
export default geminiService;