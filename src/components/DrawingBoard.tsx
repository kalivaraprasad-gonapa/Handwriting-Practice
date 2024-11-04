import  { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Undo2, RotateCcw } from 'lucide-react';  

const DrawingBoard = ({ onStrokeUpdate, onDrawingStateChange }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [strokeHistory, setStrokeHistory] = useState([]);
  const [currentStroke, setCurrentStroke] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setContext(ctx);
  }, []);

  const startDrawing = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
    setCurrentStroke([[x, y]]);
    onDrawingStateChange(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    context.lineTo(x, y);
    context.stroke();
    setCurrentStroke(prev => [...prev, [x, y]]);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      context.closePath();
      setStrokeHistory(prev => [...prev, currentStroke]);
      setCurrentStroke([]);
      onStrokeUpdate([...strokeHistory, currentStroke]);
    }
    setIsDrawing(false);
    onDrawingStateChange(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setStrokeHistory([]);
    onStrokeUpdate([]);
  };

  const undo = () => {
    if (strokeHistory.length === 0) return;
    
    const canvas = canvasRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    const newHistory = [...strokeHistory];
    newHistory.pop();
    setStrokeHistory(newHistory);
    
    // Redraw remaining strokes
    newHistory.forEach(stroke => {
      context.beginPath();
      context.moveTo(stroke[0][0], stroke[0][1]);
      stroke.forEach(([x, y]) => {
        context.lineTo(x, y);
      });
      context.stroke();
      context.closePath();
    });

    onStrokeUpdate(newHistory);
  };

  // Add touch support
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    startDrawing(mouseEvent);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    draw(mouseEvent);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    stopDrawing();
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="mb-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={undo}
            disabled={strokeHistory.length === 0}
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={clearCanvas}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <canvas
          ref={canvasRef}
          className="border rounded-lg w-full h-96 touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </CardContent>
    </Card>
  );
};

export default DrawingBoard;