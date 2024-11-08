import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, AlertCircle, Loader2, PenTool } from "lucide-react";

const parseGeminiResponse = (response) => {
  if (!response?.candidates?.[0]?.content?.parts?.[0]?.text) {
    return null;
  }

  const text = response.candidates[0].content.parts[0].text;
  const sections = text.split("\n\n");

  const extractSection = (title) => {
    const section = sections.find((s) => s.startsWith(title));
    return section ? section.replace(title + "\n", "").trim() : "";
  };

  // Extract score from the text
  const scoreText = extractSection("**Overall Quality Score (%)**");
  const score = parseInt(scoreText) || 0;

  return {
    strokeQuality: {
      score: score,
      details: [extractSection("**Current Stroke Quality**")],
    },
    letterFormation: {
      score: score,
      details: [extractSection("**Letter Formation**")],
    },
    nextStrokes: extractSection("**Next Expected Strokes**")
      .split("\n")
      .filter((s) => s.trim()),
    commonMistakes: {
      mistakes: extractSection("**Common Mistakes to Avoid**")
        .split("*")
        .map((s) => s.trim())
        .filter((s) => s),
      improvements: [],
    },
  };
};

const RealTimeFeedback = ({
  strokeData,
  isDrawing,
  isAnalyzing,
  languageInfo,
  geminiResponse,
}) => {
  const analysisResults = React.useMemo(() => {
    return parseGeminiResponse(geminiResponse);
  }, [geminiResponse]);
  const getQualityColor = (quality) => {
    if (quality >= 80) return "bg-green-100 text-green-800";
    if (quality >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getLanguageSpecificTips = () => {
    switch (languageInfo.language.toLowerCase()) {
      case "telugu":
        return [
          "Maintain proper curves and loops",
          "Connect characters smoothly",
          "Keep consistent spacing",
        ];
      case "hindi":
        return [
          "Keep the headline (शिरोरेखा) straight",
          "Connect matras properly",
          "Maintain character proportions",
        ];
      case "japanese":
        return [
          "Follow correct stroke order",
          "Maintain proper balance",
          "Keep strokes clean and precise",
        ];
      default:
        return [
          "Write on the baseline",
          "Keep consistent size",
          "Space letters evenly",
        ];
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Real-time Feedback</span>
          {(isDrawing || isAnalyzing) && (
            <div className="flex items-center gap-2">
              {isAnalyzing && (
                <span className="text-sm text-gray-500">Analyzing...</span>
              )}
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {strokeData.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <PenTool className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Start writing to receive feedback</p>
          </div>
        ) : !isAnalyzing && !analysisResults ? (
          <div className="text-center py-6 text-gray-500">
            <Loader2 className="h-12 w-12 mx-auto mb-2 opacity-50 animate-spin" />
            <p>Waiting for analysis...</p>
          </div>
        ) : (
          <>
            {/* Stroke Quality Analysis */}
            {analysisResults?.strokeQuality && (
              <div className="space-y-2">
                <h3 className="font-medium">Current Stroke:</h3>
                <div
                  className={`p-2 rounded ${getQualityColor(
                    analysisResults.strokeQuality.score
                  )}`}
                >
                  <div className="flex items-center space-x-2">
                    {analysisResults.strokeQuality.score >= 80 ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span className="font-medium">
                      Quality: {analysisResults.strokeQuality.score}%
                    </span>
                  </div>
                </div>

                {analysisResults.strokeQuality.details.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-1">Feedback:</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {analysisResults.strokeQuality.details.map(
                        (detail, index) => (
                          <li key={index} className="text-gray-700">
                            {detail}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Letter Formation Analysis */}
            {analysisResults?.letterFormation && (
              <div className="space-y-2">
                <h3 className="font-medium">Letter Formation:</h3>
                <div
                  className={`p-2 rounded ${getQualityColor(
                    analysisResults.letterFormation.score
                  )}`}
                >
                  <div className="flex items-center space-x-2">
                    {analysisResults.letterFormation.score >= 80 ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span className="font-medium">
                      Formation Score: {analysisResults.letterFormation.score}%
                    </span>
                  </div>
                </div>

                {analysisResults.letterFormation.details.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-1">
                      Formation Details:
                    </h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {analysisResults.letterFormation.details.map(
                        (detail, index) => (
                          <li key={index} className="text-gray-700">
                            {detail}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Next Expected Strokes */}
            {analysisResults?.nextStrokes &&
              analysisResults.nextStrokes.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Next Expected Strokes:</h3>
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="text-sm text-gray-700">
                      {analysisResults.nextStrokes}
                    </div>
                  </div>
                </div>
              )}

            {/* Common Mistakes and Improvements */}
            {analysisResults?.commonMistakes &&
              analysisResults.commonMistakes.mistakes.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Areas for Improvement:</h3>
                  <Alert>
                    <AlertDescription>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {analysisResults.commonMistakes.mistakes.map(
                          (mistake, index) => (
                            <li key={index} className="text-gray-700">
                              {mistake}
                            </li>
                          )
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

            {/* Writing Tips */}
            <div className="space-y-2">
              <h3 className="font-medium">Key Reminders:</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                {getLanguageSpecificTips().map((tip, index) => (
                  <li key={index} className="text-gray-700">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeFeedback;
