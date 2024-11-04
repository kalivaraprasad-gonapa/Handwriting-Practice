// src/config/aiConfig.js

export const AI_PROVIDERS = {
    CLAUDE: 'claude',
    GEMINI: 'gemini',
    GPT4: 'gpt4'
  };
  
  export const AI_CONFIG = {
    [AI_PROVIDERS.CLAUDE]: {
      name: 'Claude',
      apiEndpoint: process.env.REACT_APP_CLAUDE_API_ENDPOINT,
      maxTokens: 2048,
      temperature: 0.7,
      capabilities: ['handwriting', 'stroke-analysis', 'real-time-feedback']
    },
    [AI_PROVIDERS.GEMINI]: {
      name: 'Google Gemini',
      apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent',
      maxTokens: 1024,
      temperature: 0.4,
      capabilities: ['handwriting', 'stroke-analysis', 'real-time-feedback']
    },
    [AI_PROVIDERS.GPT4]: {
      name: 'GPT-4',
      apiEndpoint: process.env.REACT_APP_GPT4_API_ENDPOINT,
      maxTokens: 2048,
      temperature: 0.7,
      capabilities: ['handwriting', 'stroke-analysis']
    }
  };
  
  export const DEFAULT_AI_PROVIDER = AI_PROVIDERS.CLAUDE;
  
  export const AI_ANALYSIS_CONFIG = {
    strokeAnalysis: {
      minStrokeLength: 10,
      maxStrokeLength: 1000,
      samplingRate: 5,
      smoothingFactor: 0.3
    },
    feedback: {
      updateInterval: 300, // ms
      minConfidence: 0.7,
      batchSize: 5
    },
    imageProcessing: {
      width: 400,
      height: 400,
      backgroundColor: '#FFFFFF',
      strokeColor: '#000000',
      lineWidth: 2
    }
  };