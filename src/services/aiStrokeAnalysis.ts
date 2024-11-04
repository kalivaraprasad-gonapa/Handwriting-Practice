/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/aiStrokeAnalysis.js

class AIStrokeAnalysisService {
  aiProvider: string; // Define type for aiProvider
  apiKey: string; // Define type for apiKey
  strokeBuffer: any[]; // Define type for strokeBuffer
  isAnalyzing: boolean; // Define type for isAnalyzing

  constructor(aiProvider, apiKey) {
    this.aiProvider = aiProvider;
    this.apiKey = apiKey;
    this.strokeBuffer = [];
    this.isAnalyzing = false;
  }

  async analyzeStroke(stroke, character, language, level) {
    // Add new stroke to buffer
    this.strokeBuffer.push(stroke);

    // Convert strokes to image
    const imageData = await this.convertStrokesToImage(this.strokeBuffer);

    // Prepare language-specific context
    const context = this.getLanguageContext(language, character, level);

    // Get real-time analysis from AI
    const analysis = await this.getAIAnalysis(imageData, context);

    return analysis;
  }

  async convertStrokesToImage(strokes) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 400;

    // Set white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw strokes
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    strokes.forEach((stroke) => {
      if (stroke.length > 0) {
        ctx.beginPath();
        ctx.moveTo(stroke[0][0], stroke[0][1]);
        stroke.forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.stroke();
      }
    });

    return canvas.toDataURL("image/png");
  }

  getLanguageContext(language, character, level) {
    const contextMap = {
      telugu: {
        prompt: `Analyze this handwritten Telugu ${character} in real-time. 
                  Consider:
                  1. Stroke direction and order
                  2. Character proportions and curves
                  3. Connection points
                  4. Spacing and alignment
                  
                  Provide specific feedback on:
                  1. Current stroke quality
                  2. Suggested improvements
                  3. Next expected strokes
                  4. Common mistakes to avoid`,
        scriptFeatures: ["curves", "loops", "connections"],
      },
      hindi: {
        prompt: `Analyze this handwritten Hindi ${character} in real-time.
                  Consider:
                  1. Headline (शिरोरेखा) placement
                  2. Stroke order and direction
                  3. Character proportions
                  4. Matra placement
                  
                  Provide specific feedback on:
                  1. Current stroke accuracy
                  2. Alignment with headline
                  3. Next expected strokes
                  4. Common mistakes to avoid`,
        scriptFeatures: ["headline", "connections", "matras"],
      },
      japanese: {
        prompt: `Analyze this handwritten Japanese ${character} in real-time.
                  Consider:
                  1. Stroke order (筆順)
                  2. Stroke direction
                  3. Character balance
                  4. Proper proportions
                  
                  Provide specific feedback on:
                  1. Current stroke precision
                  2. Stroke order accuracy
                  3. Next expected stroke
                  4. Common mistakes to avoid`,
        scriptFeatures: ["strokeOrder", "balance", "proportions"],
      },
      english: {
        prompt: `Analyze this handwritten English ${character} in real-time.
                  Consider:
                  1. Stroke direction
                  2. Letter proportions
                  3. Baseline alignment
                  4. Character spacing
                  
                  Provide specific feedback on:
                  1. Current stroke quality
                  2. Letter formation
                  3. Next expected strokes
                  4. Common mistakes to avoid`,
        scriptFeatures: ["baseline", "proportions", "spacing"],
      },
    };

    return contextMap[language] || contextMap.english;
  }

  async getAIAnalysis(imageData, context) {
    const prompt = {
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: context.prompt,
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: imageData.split(",")[1],
              },
            },
          ],
        },
      ],
    };

    try {
      let response;
      switch (this.aiProvider) {
        case "claude":
          response = await this.analyzeWithClaude(prompt);
          break;
        case "gemini":
          response = await this.analyzeWithGemini(prompt);
          break;
        default:
          throw new Error("Unsupported AI provider");
      }

      return this.parseAIResponse(response);
    } catch (error) {
      console.error("AI analysis error:", error);
      throw error;
    }
  }

  async analyzeWithClaude(prompt) {
    const response = await fetch("your-claude-endpoint", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prompt),
    });

    return await response.json();
  }

  async analyzeWithGemini(prompt) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: prompt.messages[0].content,
            },
          ],
        }),
      }
    );

    return await response.json();
  }

  parseAIResponse(response) {
    // Structure the AI response into a consistent format
    try {
      const analysis = {
        currentStroke: {
          quality: null,
          issues: [],
          suggestions: [],
        },
        nextStrokes: [],
        overallFeedback: {
          accuracy: 0,
          improvements: [],
          commonMistakes: [],
        },
      };

      // Parse the AI response text and extract relevant information
      // This would depend on the specific format returned by the AI provider

      return analysis;
    } catch (error) {
      console.error("Error parsing AI response:", error);
      throw error;
    }
  }
}

export default AIStrokeAnalysisService;
