import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LANGUAGE_DATA } from '../constants/languageData';

const LanguageSelector = ({ 
  onLanguageChange, 
  onCharacterChange,
  currentLanguage = 'english',
  currentLevel = 'beginner'
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [selectedLevel, setSelectedLevel] = useState(currentLevel);
  const [characterIndex, setCharacterIndex] = useState(0);

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
    setSelectedLevel('beginner');
    setCharacterIndex(0);
    updateSelection(value, 'beginner', 0);
  };

  const handleLevelChange = (value) => {
    setSelectedLevel(value);
    setCharacterIndex(0);
    updateSelection(selectedLanguage, value, 0);
  };

  const updateSelection = (language, level, index) => {
    const characters = LANGUAGE_DATA[language].levels[level].characters;
    const info = {
      language,
      level,
      character: characters[index],
      description: LANGUAGE_DATA[language].levels[level].description,
      totalCharacters: characters.length,
      currentIndex: index
    };
    onLanguageChange(info);
    onCharacterChange(info);
  };

  const nextCharacter = () => {
    const characters = LANGUAGE_DATA[selectedLanguage].levels[selectedLevel].characters;
    const newIndex = (characterIndex + 1) % characters.length;
    setCharacterIndex(newIndex);
    updateSelection(selectedLanguage, selectedLevel, newIndex);
  };

  const previousCharacter = () => {
    const characters = LANGUAGE_DATA[selectedLanguage].levels[selectedLevel].characters;
    const newIndex = characterIndex === 0 ? characters.length - 1 : characterIndex - 1;
    setCharacterIndex(newIndex);
    updateSelection(selectedLanguage, selectedLevel, newIndex);
  };

  const getCurrentCharacter = () => {
    const characters = LANGUAGE_DATA[selectedLanguage].levels[selectedLevel].characters;
    return characters[characterIndex];
  };

  const getCharacterCount = () => {
    const characters = LANGUAGE_DATA[selectedLanguage].levels[selectedLevel].characters;
    return characters.length;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Language Selection</span>
          <span className={`text-sm font-normal ${getLanguageClass(selectedLanguage)}`}>
            {LANGUAGE_DATA[selectedLanguage].name}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LANGUAGE_DATA).map(([key, lang]) => (
                <SelectItem key={key} value={key}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLevel} onValueChange={handleLevelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
            {Object.entries(LANGUAGE_DATA[selectedLanguage].levels).map(([key, level]) => {
              const typedLevel = level as { name: string }; // Type assertion
              return (
                <SelectItem key={key} value={key}>
                  {typedLevel.name}
                </SelectItem>
              );
            })}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-2">
            {LANGUAGE_DATA[selectedLanguage].levels[selectedLevel].description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <Button variant="outline" size="icon" onClick={previousCharacter}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${getLanguageClass(selectedLanguage)}`}>
              {getCurrentCharacter()}
            </div>
            <div className="text-sm text-gray-500">
              Character {characterIndex + 1} of {getCharacterCount()}
            </div>
          </div>

          <Button variant="outline" size="icon" onClick={nextCharacter}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
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

export default LanguageSelector;