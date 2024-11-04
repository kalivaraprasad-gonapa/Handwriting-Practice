import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, AlertCircle, Loader2, PenTool } from 'lucide-react';

const RealTimeFeedback = ({ 
  strokeData, 
  isDrawing, 
  languageInfo, 
  aiService 
}) => {
  const [feedback, setFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastStrokeCount, setLastStrokeCount] = useState(0);

  useEffect(() => {
    let timeoutId;

    const analyzeStrokes = async () => {
      if (!strokeData.length || strokeData.length === lastStrokeCount) return;
      
      setIsAnalyzing(true);
      try {
        // Get the most recent stroke for analysis
        const latestStroke = strokeData[strokeData.length - 1];
        
        const analysis = await aiService.analyzeStroke(
          latestStroke,
          languageInfo.character,
          languageInfo.language,
          languageInfo.level
        );

        setFeedback(analysis);
        setLastStrokeCount(strokeData.length);
      } catch (error) {
        console.error('Analysis error:', error);
      }
      setIsAnalyzing(false);
    };

    // Debounce analysis to prevent too frequent API calls
    if (isDrawing) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(analyzeStrokes, 300);
    } else if (strokeData.length > lastStrokeCount) {
      analyzeStrokes();
    }

    return () => clearTimeout(timeoutId);
  }, [strokeData, isDrawing, languageInfo, lastStrokeCount]);

  const getQualityColor = (quality) => {
    if (quality >= 80) return 'bg-green-100 text-green-800';
    if (quality >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getLanguageSpecificTips = () => {
    switch (languageInfo.language) {
      case 'telugu':
        return [
          'Maintain proper curves and loops',
          'Connect characters smoothly',
          'Keep consistent spacing'
        ];
      case 'hindi':
        return [
          'Keep the headline (शिरोरेखा) straight',
          'Connect matras properly',
          'Maintain character proportions'
        ];
      case 'japanese':
        return [
          'Follow correct stroke order',
          'Maintain proper balance',
          'Keep strokes clean and precise'
        ];
      default:
        return [
          'Write on the baseline',
          'Keep consistent size',
          'Space letters evenly'
        ];
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Real-time Feedback</span>
          {isAnalyzing && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {strokeData.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <PenTool className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Start writing to receive feedback</p>
          </div>
        ) : (
          <>
            {/* Current Stroke Analysis */}
            {feedback && feedback.currentStroke && (
              <div className="space-y-2">
                <h3 className="font-medium">Current Stroke:</h3>
                <div className={`p-2 rounded ${getQualityColor(feedback.currentStroke.quality)}`}>
                  <div className="flex items-center space-x-2">
                    {feedback.currentStroke.quality >= 80 ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span className="font-medium">
                      Quality: {feedback.currentStroke.quality}%
                    </span>
                  </div>
                </div>

                {feedback.currentStroke.issues.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-1">Issues:</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {feedback.currentStroke.issues.map((issue, index) => (
                        <li key={index} className="text-red-600">
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {feedback.currentStroke.suggestions.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-1">Suggestions:</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {feedback.currentStroke.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-blue-600">
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Next Steps */}
            {feedback?.nextStrokes && feedback.nextStrokes.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Next Expected Strokes:</h3>
                <div className="bg-blue-50 p-2 rounded">
                  <ol className="list-decimal list-inside text-sm space-y-1">
                    {feedback.nextStrokes.map((stroke, index) => (
                      <li key={index}>{stroke}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* Writing Tips */}
            <div className="space-y-2">
              <h3 className="font-medium">Key Reminders:</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                {getLanguageSpecificTips().map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>

            {/* Overall Analysis */}
            {!isDrawing && feedback?.overallFeedback && (
              <div className="space-y-2">
                <h3 className="font-medium">Overall Analysis:</h3>
                <Alert variant={feedback.overallFeedback.accuracy >= 80 ? "default" : "destructive"}>
                  <AlertDescription>
                    Accuracy: {feedback.overallFeedback.accuracy}%
                  </AlertDescription>
                </Alert>

                {feedback.overallFeedback.improvements.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-1">Areas for Improvement:</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {feedback.overallFeedback.improvements.map((improvement, index) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeFeedback;