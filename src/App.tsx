import  { useState } from 'react';
import DrawingBoard from './components/DrawingBoard';
import LanguageSelector from './components/LanguageSelector';
import LanguageGuidance from './components/LanguageGuidance';
import RealTimeFeedback from './components/RealTimeFeedback';
import AIService from './utils/aiService';
import AIStrokeAnalysisService from './services/aiStrokeAnalysis';
import { LANGUAGE_DATA } from './constants/languageData';

const App = () => {
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [currentCharacter, setCurrentCharacter] = useState<string | null>(null); // Change here
  const [currentLevel, setCurrentLevel] = useState('beginner');
  const [strokeData, setStrokeData] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [aiService] = useState(
    new AIService(import.meta.env.REACT_APP_AI_PROVIDER || 'claude', import.meta.env.REACT_APP_AI_KEY || "")
  );
  const [strokeAnalysisService] = useState(
    new AIStrokeAnalysisService(import.meta.env.REACT_APP_AI_PROVIDER || 'claude', import.meta.env.REACT_APP_AI_KEY || "")
  );

  const handleLanguageChange = (info: { language: string; level: string; character: string }) => {
    setCurrentLanguage(info.language);
    setCurrentLevel(info.level);
    setCurrentCharacter(info.character);
    clearDrawing();
};

  const handleCharacterChange = (info: { character: string; level: string }) => {
    setCurrentCharacter(info.character);
    setCurrentLevel(info.level);
    clearDrawing();
  };

  const handleStrokeUpdate = (newStrokeData) => {
    setStrokeData(newStrokeData);
  };

  const handleDrawingStateChange = (isDrawing: boolean) => {
    setIsDrawing(isDrawing);
  };

  const clearDrawing = () => {
    setStrokeData([]);
    setIsDrawing(false);
  };

  const getCurrentLanguageInfo = () => {
    return {
      language: currentLanguage,
      script: LANGUAGE_DATA[currentLanguage]?.script || 'Unknown',
      level: currentLevel,
      character: currentCharacter
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Multilingual Handwriting Practice
          </h1>
          <p className="text-gray-600">
            Learn to write in multiple languages with AI-powered feedback
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <LanguageSelector
              onLanguageChange={handleLanguageChange}
              onCharacterChange={handleCharacterChange}
              currentLanguage={currentLanguage}
              currentLevel={currentLevel}
            />
            
            <DrawingBoard
              onStrokeUpdate={handleStrokeUpdate}
              onDrawingStateChange={handleDrawingStateChange}
            />
          </div>

          <div className="space-y-6">
            {currentCharacter && (
              <>
                <RealTimeFeedback
                  strokeData={strokeData}
                  isDrawing={isDrawing}
                  languageInfo={getCurrentLanguageInfo()}
                  aiService={strokeAnalysisService}
                />

                <LanguageGuidance
                  languageInfo={getCurrentLanguageInfo()}
                  strokeData={strokeData}
                />
              </>
            )}
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Powered by AI - Supports multiple writing systems and provides real-time feedback
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;