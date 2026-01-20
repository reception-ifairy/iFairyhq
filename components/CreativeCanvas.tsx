import React, { useRef, useState, useEffect } from 'react';
import { Download, Sparkles, Trash2, Palette, Wand2 } from 'lucide-react';

type BrushColor = {
  name: string;
  color: string;
  glow: string;
};

const BRUSH_COLORS: BrushColor[] = [
  { name: 'Amber', color: '#fbbf24', glow: 'shadow-amber-500/50' },
  { name: 'Pink', color: '#ec4899', glow: 'shadow-pink-500/50' },
  { name: 'Purple', color: '#a855f7', glow: 'shadow-purple-500/50' },
  { name: 'Blue', color: '#3b82f6', glow: 'shadow-blue-500/50' },
  { name: 'Green', color: '#10b981', glow: 'shadow-green-500/50' },
  { name: 'White', color: '#ffffff', glow: 'shadow-white/50' },
];

const BRUSH_SIZES = [
  { name: 'Tiny', size: 2 },
  { name: 'Small', size: 4 },
  { name: 'Medium', size: 8 },
  { name: 'Large', size: 16 },
];

export const CreativeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState(BRUSH_COLORS[0]);
  const [currentSize, setCurrentSize] = useState(BRUSH_SIZES[1]);
  const [showHint, setShowHint] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setShowHint(false);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown') return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = currentSize.size;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor.color;
    ctx.shadowColor = currentColor.color;
    ctx.shadowBlur = 15;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    // Add sparkle effect occasionally
    if (Math.random() > 0.92 && currentSize.size < 10) {
      addSparkle(ctx, x, y);
    }
  };

  const addSparkle = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const originalStroke = ctx.strokeStyle;
    const originalWidth = ctx.lineWidth;
    
    ctx.strokeStyle = currentColor.color;
    ctx.lineWidth = 1;
    
    // Draw a small star
    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI / 2) * i;
      const len = 3 + Math.random() * 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      ctx.stroke();
    }
    
    ctx.strokeStyle = originalStroke;
    ctx.lineWidth = originalWidth;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setShowHint(true);
      setAnalysisResult(null);
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'my-magic-drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const analyzeDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const descriptions = [
        "I see a magnificent creation full of creativity! 🎨 The colors flow together beautifully, creating a sense of movement and energy.",
        "Wow! Your artwork has wonderful balance. The use of colors shows great artistic intuition! ✨",
        "This drawing radiates positive energy! I can feel the emotion you put into each stroke. 🌟",
        "Amazing work! Your creativity knows no bounds. The composition is truly unique! 🎭",
        "What a masterpiece! The way you've used colors and shapes creates a delightful visual harmony! 🌈"
      ];
      
      const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
      setAnalysisResult(randomDescription);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="glass border border-white/5 rounded-3xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Palette className="text-purple-400" size={28} />
            Magic Sketchpad
          </h3>
          <p className="text-purple-300/60 text-sm mt-1">Let your creativity flow</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={clearCanvas}
            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-purple-300 hover:text-white"
            title="Clear canvas"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={downloadCanvas}
            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-purple-300 hover:text-white"
            title="Download drawing"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative bg-slate-950/50 rounded-2xl border border-white/10 overflow-hidden" style={{ height: '400px' }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
          className="cursor-crosshair w-full h-full"
        />
        {showHint && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-purple-400/30 text-center">
              <Sparkles size={48} className="mx-auto mb-2" />
              <p className="text-lg font-bold">Start drawing your magic</p>
            </div>
          </div>
        )}
      </div>

      {/* Tools */}
      <div className="space-y-4">
        {/* Colors */}
        <div>
          <label className="text-xs font-black uppercase tracking-wider text-purple-300/60 mb-3 block">
            Brush Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {BRUSH_COLORS.map((brush) => (
              <button
                key={brush.name}
                onClick={() => setCurrentColor(brush)}
                className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                  currentColor.name === brush.name
                    ? 'border-white shadow-lg scale-110'
                    : 'border-white/20'
                } ${brush.glow}`}
                style={{ backgroundColor: brush.color }}
                title={brush.name}
              />
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="text-xs font-black uppercase tracking-wider text-purple-300/60 mb-3 block">
            Brush Size
          </label>
          <div className="flex gap-2">
            {BRUSH_SIZES.map((size) => (
              <button
                key={size.name}
                onClick={() => setCurrentSize(size)}
                className={`px-4 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all ${
                  currentSize.name === size.name
                    ? 'bg-white/20 border-white/30 text-white'
                    : 'bg-white/5 border-white/10 text-purple-300/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="pt-4 border-t border-white/5">
        <button
          onClick={analyzeDrawing}
          disabled={isAnalyzing || showHint}
          className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-purple-900 disabled:to-pink-900 disabled:cursor-not-allowed text-white font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Analyzing Magic...
            </>
          ) : (
            <>
              <Wand2 size={18} />
              Analyze My Drawing
            </>
          )}
        </button>

        {analysisResult && (
          <div className="mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 animate-fade-in">
            <p className="text-purple-100 text-sm leading-relaxed">{analysisResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};
