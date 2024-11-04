// src/utils/aiService.js

class AIService {
    constructor(provider, apiKey) {
      this.provider = provider;
      this.apiKey = apiKey;
    }
  
    async analyzeHandwriting(imageData, targetCharacter, prompt, emphasis = []) {
      const config = {
        claude: {
          endpoint: 'your-claude-endpoint',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        },
        gemini: {
          endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      };
  
      try {
        const providerConfig = config[this.provider];
        if (!providerConfig) {
          throw new Error('Unsupported AI provider');
        }
  
        const response = await fetch(`${providerConfig.endpoint}?key=${this.apiKey}`, {
          method: 'POST',
          headers: providerConfig.headers,
          body: JSON.stringify(this.createRequestBody(imageData, targetCharacter, prompt, emphasis))
        });
  
        if (!response.ok) {
          throw new Error(`AI service error: ${response.statusText}`);
        }
  
        const result = await response.json();
        return this.parseResponse(result);
  
      } catch (error) {
        console.error('Error in AI analysis:', error);
        throw error;
      }
    }
  
    createRequestBody(imageData, targetCharacter, prompt, emphasis) {
      const base64Image = imageData.split(',')[1];
  
      switch (this.provider) {
        case 'claude':
          return {
            messages: [{
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt || `Analyze this handwritten character. The intended character is '${targetCharacter}'. 
                         Focus on: ${emphasis.join(', ')}`
                },
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: 'image/png',
                    data: base64Image
                  }
                }
              ]
            }]
          };
  
        case 'gemini':
          return {
            contents: [{
              parts: [
                {
                  text: prompt || `Analyze this handwritten character. The intended character is '${targetCharacter}'. 
                         Focus on: ${emphasis.join(', ')}`
                },
                {
                  inlineData: {
                    data: base64Image,
                    mimeType: 'image/png'
                  }
                }
              ]
            }],
            generationConfig: {
              temperature: 0.4,
              topK: 32,
              topP: 1,
              maxOutputTokens: 1024,
            }
          };
  
        default:
          throw new Error('Unsupported AI provider');
      }
    }
  
    parseResponse(response) {
      try {
        let analysis;
  
        if (this.provider === 'claude') {
          analysis = this.parseClaudeResponse(response);
        } else if (this.provider === 'gemini') {
          analysis = this.parseGeminiResponse(response);
        }
  
        return {
          score: analysis.score || 0,
          improvements: analysis.improvements || [],
          guidance: {
            strokeOrder: analysis.strokeOrder || [],
            commonMistakes: analysis.commonMistakes || []
          }
        };
  
      } catch (error) {
        console.error('Error parsing AI response:', error);
        return {
          score: 0,
          improvements: ['Unable to analyze handwriting. Please try again.'],
          guidance: {
            strokeOrder: [],
            commonMistakes: []
          }
        };
      }
    }
  
    parseClaudeResponse(response) {
      // Parse Claude-specific response format
      return this.extractAnalysisFromText(response.content[0].text);
    }
  
    parseGeminiResponse(response) {
      // Parse Gemini-specific response format
      return this.extractAnalysisFromText(response.candidates[0].content.parts[0].text);
    }
  
    extractAnalysisFromText(text) {
      // Extract structured data from AI response text
      try {
        // Look for JSON-like structure in the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
  
        // Fallback to parsing key information from text
        return {
          score: this.extractScore(text),
          improvements: this.extractImprovements(text),
          strokeOrder: this.extractStrokeOrder(text),
          commonMistakes: this.extractCommonMistakes(text)
        };
      } catch (error) {
        console.error('Error extracting analysis:', error);
        return {};
      }
    }
  
    extractScore(text) {
      const scoreMatch = text.match(/(\d+)%/);
      return scoreMatch ? parseInt(scoreMatch[1]) : 0;
    }
  
    extractImprovements(text) {
      const improvements = text.match(/Improvements?:?\s*([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i);
      return improvements
        ? improvements[1]
            .split(/\n|-/)
            .map(item => item.trim())
            .filter(Boolean)
        : [];
    }
  
    extractStrokeOrder(text) {
      const strokeOrder = text.match(/Stroke order:?\s*([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i);
      return strokeOrder
        ? strokeOrder[1]
            .split(/\n|-/)
            .map(item => item.trim())
            .filter(Boolean)
        : [];
    }
  
    extractCommonMistakes(text) {
      const mistakes = text.match(/Common mistakes:?\s*([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i);
      return mistakes
        ? mistakes[1]
            .split(/\n|-/)
            .map(item => item.trim())
            .filter(Boolean)
        : [];
    }
  }
  
  export default AIService;