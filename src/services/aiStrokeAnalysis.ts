// types.ts
export interface StrokeQualityAnalysis {
  score: number;
  details: string[];
}

export interface LetterFormationAnalysis {
  score: number;
  details: string[];
}

export interface CommonMistakesAnalysis {
  mistakes: string[];
  improvements: string[];
}

export interface AnalysisCallbacks {
  onStrokeQuality?: (analysis: StrokeQualityAnalysis) => void;
  onLetterFormation?: (analysis: LetterFormationAnalysis) => void;
  onNextStrokes?: (strokes: string[]) => void;
  onCommonMistakes?: (analysis: CommonMistakesAnalysis) => void;
  onComplete?: (finalAnalysis: string) => void;
  onError?: (error: Error) => void;
}

export interface GeminiPrompt {
  contents: {
    parts: {
      text: string;
      image?: {
        type: string;
        source: {
          type: string;
          media_type: string;
          data: string;
        };
      };
    }[];
  }[];
  generationConfig: {
    temperature: number;
    topK: number;
    topP: number;
    maxOutputTokens: number;
  };
  safetySettings?: {
    category: string;
    threshold: string;
  }[];
}

export interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
}

export type QualityIndicators = {
  [key: string]: number;
};

// geminiStreamingService.ts
export class GeminiStreamingAnalysis {
  private apiKey: string;
  private analysisBuffer: string;
  private readonly qualityIndicators: QualityIndicators;
  private readonly formationIndicators: QualityIndicators;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.analysisBuffer = "";

    // Initialize quality indicators
    this.qualityIndicators = {
      good: 1,
      smooth: 0.8,
      consistent: 0.8,
      accurate: 0.9,
      precise: 0.9,
    };

    this.formationIndicators = {
      "well-formed": 1,
      clear: 0.8,
      distinct: 0.8,
      correct: 0.9,
      natural: 0.8,
      flowing: 0.7,
      good: 0.8,
    };
  }

  public async analyzeWithGemini(
    prompt: string | GeminiPrompt,
    callbacks: AnalysisCallbacks = {}
  ): Promise<void> {
    if (!this.apiKey) {
      throw new Error("API key is required");
    }

    const formattedPrompt: GeminiPrompt = {
      contents: [
        {
          parts: [
            {
              text:
                typeof prompt === "string" ? prompt : JSON.stringify(prompt),
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    };

    try {
      const streamUrl = new URL(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:streamGenerateContent"
      );
      streamUrl.searchParams.append("key", this.apiKey);

      const response = await fetch(streamUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify(formattedPrompt),
      });

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          if (callbacks.onComplete) {
            callbacks.onComplete(this.analysisBuffer);
          }
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        await this.processStreamChunk(chunk, callbacks);
      }
    } catch (error) {
      if (callbacks.onError) {
        callbacks.onError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
      throw error;
    }
  }

  private extractTextFromChunk(data: GeminiResponse): string {
    try {
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (error) {
      console.warn("Error extracting text from chunk:", error);
      return "";
    }
  }

  private async processStreamChunk(
    chunk: string,
    callbacks: AnalysisCallbacks
  ): Promise<void> {
    this.analysisBuffer += chunk;

    const sections = this.analysisBuffer
      .split("**")
      .filter((section) => section.trim());

    for (const section of sections) {
      const lines = section.split("\n").filter((line) => line.trim());
      if (lines.length === 0) continue;

      const header = lines[0].trim().toLowerCase();
      const bulletPoints = lines
        .slice(1)
        .filter((line) => line.startsWith("*"))
        .map((line) => line.replace("* ", "").trim());

      switch (header) {
        case "current stroke quality": {
          if (callbacks.onStrokeQuality) {
            callbacks.onStrokeQuality(this.analyzeStrokeQuality(bulletPoints));
          }
          break;
        }
        case "letter formation": {
          if (callbacks.onLetterFormation) {
            callbacks.onLetterFormation(
              this.analyzeLetterFormation(bulletPoints)
            );
          }
          break;
        }
        case "next expected strokes": {
          if (callbacks.onNextStrokes) {
            callbacks.onNextStrokes(bulletPoints);
          }
          break;
        }
        case "common mistakes to avoid": {
          if (callbacks.onCommonMistakes) {
            callbacks.onCommonMistakes(
              this.analyzeCommonMistakes(bulletPoints)
            );
          }
          break;
        }
      }
    }

    this.analysisBuffer = "";
  }

  private analyzeStrokeQuality(bulletPoints: string[]): StrokeQualityAnalysis {
    const { score } = this.calculateQualityScore(
      bulletPoints,
      this.qualityIndicators
    );
    return {
      score,
      details: bulletPoints,
    };
  }

  private analyzeLetterFormation(
    bulletPoints: string[]
  ): LetterFormationAnalysis {
    const { score } = this.calculateQualityScore(
      bulletPoints,
      this.formationIndicators
    );
    return {
      score,
      details: bulletPoints,
    };
  }

  private analyzeCommonMistakes(
    bulletPoints: string[]
  ): CommonMistakesAnalysis {
    return {
      mistakes: bulletPoints,
      improvements: bulletPoints.map(
        (mistake) => `Improve: ${mistake.replace("Avoid ", "")}`
      ),
    };
  }

  private calculateQualityScore(
    bulletPoints: string[],
    indicators: QualityIndicators
  ): { score: number; total: number } {
    let score = 0;
    let total = 0;

    bulletPoints.forEach((point) => {
      Object.entries(indicators).forEach(([indicator, weight]) => {
        if (point.toLowerCase().includes(indicator)) {
          score += weight;
          total++;
        }
      });
    });

    return {
      score: total > 0 ? Math.round((score / total) * 100) : 50,
      total,
    };
  }
}

// Example usage with TypeScript:
/*
import { GeminiStreamingAnalysis, AnalysisCallbacks } from './geminiStreamingService';

const analysisService = new GeminiStreamingAnalysis('your-api-key');

const handlers: AnalysisCallbacks = {
  onStrokeQuality: (analysis) => {
    console.log('Stroke Quality Update:', analysis.score, analysis.details);
  },
  onLetterFormation: (analysis) => {
    console.log('Letter Formation Update:', analysis.score, analysis.details);
  },
  onNextStrokes: (strokes) => {
    console.log('Next Strokes Update:', strokes);
  },
  onCommonMistakes: (mistakes) => {
    console.log('Common Mistakes Update:', mistakes.mistakes, mistakes.improvements);
  },
  onComplete: (finalAnalysis) => {
    console.log('Analysis Complete:', finalAnalysis);
  },
  onError: (error) => {
    console.error('Analysis Error:', error.message);
  }
};

// Using with a text prompt
await analysisService.analyzeWithGemini("Analyze this handwriting...", handlers);

// Using with a structured prompt including an image
const imagePrompt = {
  contents: [{
    parts: [{
      text: "Analyze this handwriting...",
      image: {
        type: "base64",
        source: {
          type: "base64",
          media_type: "image/png",
          data: "your-base64-image-data"
        }
      }
    }]
  }]
};

await analysisService.analyzeWithGemini(imagePrompt, handlers);
*/
