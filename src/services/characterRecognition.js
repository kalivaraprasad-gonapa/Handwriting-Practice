// src/services/characterRecognition.js

class CharacterRecognitionService {
    constructor(aiService) {
      this.aiService = aiService;
      this.languageModels = {
        english: 'latin-handwriting',
        telugu: 'telugu-handwriting',
        hindi: 'devanagari-handwriting',
        japanese: 'japanese-handwriting'
      };
    }
  
    async analyzeCharacter(strokeData, targetCharacter, language, level) {
      try {
        // Convert strokes to image
        const imageData = await this.strokesToImage(strokeData);
        
        // Get language-specific analysis
        const analysis = await this.getLanguageSpecificAnalysis(
          imageData,
          targetCharacter,
          language,
          level
        );
  
        return {
          ...analysis,
          guidance: this.getStrokeGuidance(targetCharacter, language, level)
        };
      } catch (error) {
        console.error('Character analysis error:', error);
        throw error;
      }
    }
  
    async strokesToImage(strokeData) {
      return new Promise((resolve, reject) => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas size
          canvas.width = 400;
          canvas.height = 400;
          
          // White background
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw strokes
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          strokeData.forEach(stroke => {
            if (stroke.length > 0) {
              ctx.beginPath();
              ctx.moveTo(stroke[0][0], stroke[0][1]);
              stroke.forEach(([x, y]) => ctx.lineTo(x, y));
              ctx.stroke();
            }
          });
          
          // Convert to base64
          resolve(canvas.toDataURL('image/png'));
        } catch (error) {
          reject(error);
        }
      });
    }
  
    async getLanguageSpecificAnalysis(imageData, targetCharacter, language, level) {
      const modelConfig = {
        english: {
          prompt: `Analyze this handwritten ${level === 'beginner' ? 'uppercase' : 'lowercase'} English letter.`,
          emphasis: ['letter shape', 'baseline alignment', 'proportions']
        },
        telugu: {
          prompt: `Analyze this handwritten Telugu ${level === 'beginner' ? 'vowel' : 'consonant'}.`,
          emphasis: ['character components', 'curves', 'connections']
        },
        hindi: {
          prompt: `Analyze this handwritten Hindi ${level === 'beginner' ? 'vowel' : 'consonant'}.`,
          emphasis: ['headline', 'character shape', 'connections']
        },
        japanese: {
          prompt: `Analyze this handwritten ${level} character.`,
          emphasis: ['stroke order', 'balance', 'proportions']
        }
      };
  
      const config = modelConfig[language];
      return await this.aiService.analyzeHandwriting(
        imageData,
        targetCharacter,
        config.prompt,
        config.emphasis
      );
    }
  
    getStrokeGuidance(character, language, level) {
      // Language-specific stroke order and guidance
      const guidanceMap = {
        english: this.getEnglishGuidance,
        telugu: this.getTeluguGuidance,
        hindi: this.getHindiGuidance,
        japanese: this.getJapaneseGuidance
      };
  
      return guidanceMap[language]?.(character, level) || [];
    }
  
    getEnglishGuidance(character, level) {
      // Example guidance for English letters
      const uppercase = {
        'A': ['Start at top center', 'Diagonal down left', 'Diagonal down right', 'Horizontal line across middle'],
        'B': ['Vertical line down', 'Curve top half', 'Curve bottom half'],
        // Add more letters...
      };
  
      const lowercase = {
        'a': ['Start at middle right', 'Circle counterclockwise', 'Vertical line down'],
        'b': ['Vertical line down', 'Circle from middle right'],
        // Add more letters...
      };
  
      return level === 'beginner' ? uppercase[character] : lowercase[character];
    }
  
    getTeluguGuidance(character, level) {
      // Implement Telugu-specific guidance
      return [];
    }
  
    getHindiGuidance(character, level) {
      // Implement Hindi-specific guidance
      return [];
    }
  
    getJapaneseGuidance(character, level) {
      // Implement Japanese-specific guidance
      return [];
    }
  }
  
  export default CharacterRecognitionService;