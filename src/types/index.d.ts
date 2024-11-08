// types/index.ts

export interface StrokeData {
  points: [number, number][];
  timestamp: number;
}

export interface LanguageInfo {
  language: string;
  script: string;
  level: string;
  character: string | null;
}

export interface LanguageChangeInfo {
  language: string;
  level: string;
  character: string;
}

export interface CharacterChangeInfo {
  character: string;
  level: string;
}

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

export interface AnalysisResults {
  strokeQuality?: StrokeQualityAnalysis;
  letterFormation?: LetterFormationAnalysis;
  nextStrokes?: string[];
  commonMistakes?: CommonMistakesAnalysis;
}
