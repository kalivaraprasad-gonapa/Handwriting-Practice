import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, AlertCircle, Info } from 'lucide-react';
import { WRITING_GUIDANCE } from '../constants/languageData';

const LanguageGuidance = ({ languageInfo, strokeData }) => {
  const { language, script, level, character } = languageInfo;

  const getScriptSpecificGuidance = () => {
    const guidance = WRITING_GUIDANCE[language] || WRITING_GUIDANCE.english;
    let tips = [];

    // Get general tips for the script
    tips = [...guidance.general];

    // Add level-specific tips
    switch (level) {
      case 'beginner':
        if (language === 'english') {
          tips = [...tips, ...guidance.uppercase];
        } else if (language === 'japanese') {
          tips = [...tips, ...guidance.hiragana];
        } else {
          tips = [...tips, ...guidance.vowels];
        }
        break;
      case 'intermediate':
        if (language === 'english') {
          tips = [...tips, ...guidance.lowercase];
        } else if (language === 'japanese') {
          tips = [...tips, ...guidance.katakana];
        } else {
          tips = [...tips, ...guidance.consonants];
        }
        break;
      case 'advanced':
        if (language === 'japanese') {
          tips = [...tips, ...guidance.kanji];
        }
        break;
      default:
        break;
    }

    return tips;
  };

  const getWritingDirectionGuide = () => {
    switch (language) {
      case 'japanese':
        return 'Write from top to bottom, right to left';
      case 'telugu':
      case 'hindi':
      case 'english':
      default:
        return 'Write from left to right';
    }
  };

  const getScriptFeatures = () => {
    switch (language) {
      case 'telugu':
        return ['curved strokes', 'connecting loops', 'proper spacing'];
      case 'hindi':
        return ['headline (शिरोरेखा)', 'character connections', 'proper matras'];
      case 'japanese':
        return ['stroke order', 'balanced proportions', 'clean endings'];
      case 'english':
      default:
        return ['baseline alignment', 'consistent size', 'proper spacing'];
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Writing Guide: {script}</span>
          <span className={`text-2xl ${getLanguageClass(language)}`}>
            {character}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Writing Direction */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="ml-2">
            {getWritingDirectionGuide()}
          </AlertDescription>
        </Alert>

        {/* Script Features */}
        <div className="space-y-2">
          <h3 className="font-medium">Key Features:</h3>
          <ul className="list-disc list-inside space-y-1">
            {getScriptFeatures().map((feature, index) => (
              <li key={index} className="text-sm">
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Writing Guidelines */}
        <div className="space-y-2">
          <h3 className="font-medium">Writing Guidelines:</h3>
          <ul className="list-disc list-inside space-y-1">
            {getScriptSpecificGuidance().map((tip, index) => (
              <li key={index} className="text-sm">
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Practice Status */}
        {strokeData && strokeData.length > 0 && (
          <div className="mt-4">
            <Alert variant="default">
              <div className="flex items-center">
                <Check className="h-4 w-4 mr-2" />
                <AlertDescription>
                  {strokeData.length} strokes drawn
                </AlertDescription>
              </div>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const getLanguageClass = (language) => {
  switch (language) {
    case 'telugu':
      return 'lang-telugu';
    case 'hindi':
      return 'lang-hindi';
    case 'japanese':
      return 'lang-japanese';
    default:
      return '';
  }
};

export default LanguageGuidance;