import React, { useRef, useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { StrokeData } from "../types";

interface DrawingBoardProps {
  onStrokeUpdate: (strokes: StrokeData[]) => void;
  onDrawingStateChange: (isDrawing: boolean) => void;
  setGeminiResponse: (response: string) => void;
}

const DrawingBoard: React.FC<DrawingBoardProps> = ({
  onStrokeUpdate,
  onDrawingStateChange,
  setGeminiResponse,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<[number, number][]>([]);
  const [allStrokes, setAllStrokes] = useState<StrokeData[]>([]);

  const startDrawing = useCallback(
    (
      e:
        | React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>
    ) => {
      setIsDrawing(true);
      onDrawingStateChange(true);
      const point = getEventPoint(e);
      setCurrentStroke([point]);
    },
    [onDrawingStateChange]
  );

  const draw = useCallback(
    (
      e:
        | React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>
    ) => {
      if (!isDrawing) return;
      e.preventDefault();
      const point = getEventPoint(e);
      setCurrentStroke((prev) => [...prev, point]);
    },
    [isDrawing]
  );

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;

    if (currentStroke.length > 0) {
      const newStroke: StrokeData = {
        points: currentStroke,
        timestamp: Date.now(),
      };

      const updatedStrokes = [...allStrokes, newStroke];
      setAllStrokes(updatedStrokes);

      // First update the strokes
      onStrokeUpdate(updatedStrokes);
      // Then signal that drawing has stopped
      setIsDrawing(false);
      onDrawingStateChange(false);
    }

    setCurrentStroke([]);
  }, [
    isDrawing,
    currentStroke,
    allStrokes,
    onStrokeUpdate,
    onDrawingStateChange,
  ]);

  const getEventPoint = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): [number, number] => {
    const canvas = canvasRef.current;
    if (!canvas) return [0, 0];

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    x = (x * canvas.width) / rect.width;
    y = (y * canvas.height) / rect.height;

    return [x, y];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all strokes
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    allStrokes.forEach((stroke) => {
      if (stroke.points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(stroke.points[0][0], stroke.points[0][1]);
        stroke.points.forEach(([x, y]) => {
          ctx.lineTo(x, y);
        });
        ctx.stroke();
      }
    });

    // Draw current stroke
    if (currentStroke.length > 0) {
      ctx.beginPath();
      ctx.moveTo(currentStroke[0][0], currentStroke[0][1]);
      currentStroke.forEach(([x, y]) => {
        ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
  }, [allStrokes, currentStroke]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setAllStrokes([]);
    setCurrentStroke([]);
    onStrokeUpdate([]);
    setGeminiResponse("");
  }, [onStrokeUpdate]);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="relative w-full h-96 bg-white rounded-lg overflow-hidden border border-gray-200">
          <canvas
            ref={canvasRef}
            width={800}
            height={800}
            className="absolute top-0 left-0 w-full h-full cursor-crosshair touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
        <button
          onClick={clearCanvas}
          className="w-full py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Clear Canvas
        </button>
      </div>
    </Card>
  );
};

export default DrawingBoard;
