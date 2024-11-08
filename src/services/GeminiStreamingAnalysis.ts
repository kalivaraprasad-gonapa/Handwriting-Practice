// services/GeminiStreamingAnalysis.ts

import {
  StrokeQualityAnalysis,
  LetterFormationAnalysis,
  CommonMistakesAnalysis,
} from "../types";

export interface GeminiPrompt {
  contents: {
    parts: {
      text?: string;
      inline_data?: {
        mime_type: string;
        data: string;
      };
    }[];
  }[];
  generationConfig: {
    temperature: number;
    topK: number;
    topP: number;
    maxOutputTokens: number;
  };
}

export interface AnalysisCallbacks {
  onStrokeQuality?: (analysis: StrokeQualityAnalysis) => void;
  onLetterFormation?: (analysis: LetterFormationAnalysis) => void;
  onNextStrokes?: (strokes: string[]) => void;
  onCommonMistakes?: (analysis: CommonMistakesAnalysis) => void;
  onComplete?: (finalAnalysis: string) => void;
  onRawResponse?: (response: unknown) => void;
  onError?: (error: Error) => void;
}

export class GeminiStreamingAnalysis {
  private apiKey: string;
  private analysisBuffer: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.analysisBuffer = "";
    // console.log("GeminiStreamingAnalysis initialized", { hasApiKey: !!apiKey });
  }

  public async analyzeWithGemini(
    prompt: GeminiPrompt,
    callbacks: AnalysisCallbacks = {}
  ): Promise<void> {
    console.log("Starting Gemini analysis");

    if (!this.apiKey) {
      const error = new Error("API key is required");
      if (callbacks.onError) callbacks.onError(error);
      throw error;
    }

    try {
      const streamUrl = new URL(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
      );
      streamUrl.searchParams.append("key", this.apiKey);

      // console.log(
      //   "Making request with prompt:",
      //   JSON.stringify(prompt, null, 2)
      // );

      const response = await fetch(streamUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prompt),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}\n${errorText}`
        );
      }

      const data = await response.json();
      // console.log("Received response:", data);

      if (callbacks.onRawResponse) {
        callbacks.onRawResponse(data);
      }

      // Process the response
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const text = data.candidates[0].content.parts[0].text;
        await this.processStreamChunk(text, callbacks);
      }
    } catch (error) {
      console.error("Error in analyzeWithGemini:", error);
      if (callbacks.onError) {
        callbacks.onError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
      throw error;
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
        case "current stroke quality":
          if (callbacks.onStrokeQuality) {
            callbacks.onStrokeQuality(this.analyzeStrokeQuality(bulletPoints));
          }
          break;
        case "letter formation":
          if (callbacks.onLetterFormation) {
            callbacks.onLetterFormation(
              this.analyzeLetterFormation(bulletPoints)
            );
          }
          break;
        case "next expected strokes":
          if (callbacks.onNextStrokes) {
            callbacks.onNextStrokes(bulletPoints);
          }
          break;
        case "common mistakes to avoid":
          if (callbacks.onCommonMistakes) {
            callbacks.onCommonMistakes(
              this.analyzeCommonMistakes(bulletPoints)
            );
          }
          break;
      }
    }

    this.analysisBuffer = "";
  }

  private analyzeStrokeQuality(bulletPoints: string[]): StrokeQualityAnalysis {
    let score = 0;
    const qualityIndicators = {
      good: 1,
      smooth: 0.8,
      consistent: 0.8,
      accurate: 0.9,
      precise: 0.9,
    };

    let totalIndicators = 0;
    bulletPoints.forEach((point) => {
      Object.entries(qualityIndicators).forEach(([indicator, weight]) => {
        if (point.toLowerCase().includes(indicator)) {
          score += weight;
          totalIndicators++;
        }
      });
    });

    return {
      score:
        totalIndicators > 0 ? Math.round((score / totalIndicators) * 100) : 50,
      details: bulletPoints,
    };
  }

  private analyzeLetterFormation(
    bulletPoints: string[]
  ): LetterFormationAnalysis {
    let score = 0;
    const formationIndicators = {
      "well-formed": 1,
      clear: 0.8,
      distinct: 0.8,
      correct: 0.9,
      natural: 0.8,
      flowing: 0.7,
      good: 0.8,
    };

    let totalIndicators = 0;
    bulletPoints.forEach((point) => {
      Object.entries(formationIndicators).forEach(([indicator, weight]) => {
        if (point.toLowerCase().includes(indicator)) {
          score += weight;
          totalIndicators++;
        }
      });
    });

    return {
      score:
        totalIndicators > 0 ? Math.round((score / totalIndicators) * 100) : 50,
      details: bulletPoints,
    };
  }

  private analyzeCommonMistakes(
    bulletPoints: string[]
  ): CommonMistakesAnalysis {
    return {
      mistakes: bulletPoints,
      improvements: bulletPoints.map(
        (mistake) =>
          `Improve: ${mistake
            .replace("Avoid ", "")
            .replace("Watch out for ", "")}`
      ),
    };
  }
}
