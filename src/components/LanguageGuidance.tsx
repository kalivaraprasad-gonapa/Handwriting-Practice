import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WRITING_GUIDANCE } from "../constants/languageData";
import { StrokeData, LanguageInfo } from "../types";

interface LanguageGuidanceProps {
  languageInfo: LanguageInfo;
  strokeData: StrokeData[];
}

const LanguageGuidance: React.FC<LanguageGuidanceProps> = ({
  languageInfo,
  strokeData,
}) => {
  const getGuidanceForLevel = () => {
    const guidance = WRITING_GUIDANCE[languageInfo.language];
    const level = languageInfo.level;

    let tips: string[] = [...guidance.general];

    switch (languageInfo.language) {
      case "english":
        if (level === "beginner") tips = [...tips, ...guidance.uppercase];
        if (level === "intermediate") tips = [...tips, ...guidance.lowercase];
        break;
      case "telugu":
        if (level === "beginner") tips = [...tips, ...guidance.vowels];
        if (level === "intermediate" || level === "advanced")
          tips = [...tips, ...guidance.consonants];
        break;
      case "hindi":
        if (level === "beginner") tips = [...tips, ...guidance.vowels];
        if (level === "intermediate" || level === "advanced")
          tips = [...tips, ...guidance.consonants];
        break;
      case "japanese":
        if (level === "beginner") tips = [...tips, ...guidance.hiragana];
        if (level === "intermediate") tips = [...tips, ...guidance.katakana];
        if (level === "advanced") tips = [...tips, ...guidance.kanji];
        break;
    }

    return tips;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Writing Guidance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Character Info */}
        <div className="text-center p-4 bg-secondary rounded-lg">
          <div className="text-4xl font-bold mb-2">
            {languageInfo.character}
          </div>
          <div className="text-sm text-gray-600">
            {WRITING_GUIDANCE[languageInfo.language].general[0]}
          </div>
        </div>

        {/* Writing Tips */}
        <div className="space-y-2">
          <h3 className="font-medium">Key Writing Tips:</h3>
          <ul className="list-disc list-inside space-y-1">
            {getGuidanceForLevel().map((tip, index) => (
              <li key={index} className="text-sm text-gray-700">
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Progress Indicator */}
        <div className="mt-4">
          <div className="text-sm text-gray-600 flex justify-between">
            <span>Strokes: {strokeData.length}</span>
            <span>Level: {languageInfo.level}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageGuidance;
