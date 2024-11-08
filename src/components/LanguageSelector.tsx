import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LANGUAGE_DATA } from "../constants/languageData";

interface LanguageSelectorProps {
  onLanguageChange: (info: {
    language: string;
    level: string;
    character: string;
  }) => void;
  onCharacterChange: (info: { character: string; level: string }) => void;
  currentLanguage: string;
  currentLevel: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageChange,
  onCharacterChange,
  currentLanguage,
  currentLevel,
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Reset character when language or level changes
  useEffect(() => {
    const currentLevelData =
      LANGUAGE_DATA[currentLanguage]?.levels[currentLevel];
    if (currentLevelData && currentLevelData.characters.length > 0) {
      const firstCharacter = currentLevelData.characters[0];
      setSelectedCharacter(firstCharacter);
      onCharacterChange({ character: firstCharacter, level: currentLevel });
    }
  }, [currentLanguage, currentLevel, onCharacterChange]);

  const handleLanguageChange = (language: string) => {
    const firstLevel = Object.keys(LANGUAGE_DATA[language].levels)[0];
    const firstCharacter =
      LANGUAGE_DATA[language].levels[firstLevel].characters[0];
    onLanguageChange({
      language,
      level: firstLevel,
      character: firstCharacter,
    });
  };

  const handleLevelChange = (level: string) => {
    const firstCharacter =
      LANGUAGE_DATA[currentLanguage].levels[level].characters[0];
    onCharacterChange({
      character: firstCharacter,
      level,
    });
  };

  const handleCharacterChange = (character: string) => {
    setSelectedCharacter(character);
    onCharacterChange({
      character,
      level: currentLevel,
    });
    setDialogOpen(false);
  };

  const getSummaryText = () => {
    const languageName = LANGUAGE_DATA[currentLanguage].name;
    const levelName = LANGUAGE_DATA[currentLanguage].levels[currentLevel].name;
    return (
      <div className="flex items-center justify-between w-full pr-4">
        <div className="flex items-center gap-4">
          <span className="text-xl font-semibold">{selectedCharacter}</span>
          <span className="text-sm text-muted-foreground">
            {languageName} | {levelName}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {LANGUAGE_DATA[currentLanguage].script}
        </span>
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="language-settings">
            <AccordionTrigger className="hover:no-underline">
              {getSummaryText()}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-4">
                {/* Language Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Select Language
                  </label>
                  <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LANGUAGE_DATA).map(([key, data]) => (
                        <SelectItem key={key} value={key}>
                          {data.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Level Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Select Level
                  </label>
                  <Select value={currentLevel} onValueChange={handleLevelChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a level" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LANGUAGE_DATA[currentLanguage].levels).map(
                        ([key, data]) => (
                          <SelectItem key={key} value={key}>
                            {(data as { name: string }).name}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    {LANGUAGE_DATA[currentLanguage].levels[currentLevel].description}
                  </p>
                </div>

                {/* Character Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Selected Character:
                    </label>
                    <span className="text-xl font-semibold">{selectedCharacter}</span>
                  </div>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Choose Character
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Select Character</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-8 gap-2 p-4">
                        {LANGUAGE_DATA[currentLanguage].levels[
                          currentLevel
                        ].characters.map((char) => (
                          <button
                            key={char}
                            onClick={() => handleCharacterChange(char)}
                            className={`p-2 text-center rounded-lg transition-colors hover:bg-secondary/80
                              ${
                                selectedCharacter === char
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary"
                              }`}
                          >
                            {char}
                          </button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Writing System Info */}
                <div>
                  <p className="text-sm text-gray-600">
                    Script: {LANGUAGE_DATA[currentLanguage].script} | Writing Direction:{" "}
                    {LANGUAGE_DATA[currentLanguage].writingDirection}
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default LanguageSelector;