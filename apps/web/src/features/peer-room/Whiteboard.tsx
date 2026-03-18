import { useRef, useState, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';

interface WhiteboardProps {
  roomId: string;
}

type Tool = 'draw' | 'line' | 'rectangle' | 'circle' | 'text' | 'eraser';

interface Point {
  x: number;
  y: number;
}

const COLORS = ['#FFFFFF', '#00D4FF', '#7C3AED', '#10B981', '#F59E0B', '#EC4899', '#EF4444'];
const SIZES = [2, 4, 6, 10];

export default function Whiteboard({ roomId }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>('draw');
  const [color, setColor] = useState('#FFFFFF');
  const [size, setSize] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0D0F14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveHistory();
    }
  }, []);

  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), imageData]);
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const getCanvasPoint = (e: React.MouseEvent): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDraw = (e: React.MouseEvent) => {
    const point = getCanvasPoint(e);
    setIsDrawing(true);
    setLastPoint(point);

    if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          ctx.fillStyle = color;
          ctx.font = `${size * 4}px 'JetBrains Mono', monospace`;
          ctx.fillText(text, point.x, point.y);
          saveHistory();
        }
      }
      setIsDrawing(false);
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !lastPoint) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const point = getCanvasPoint(e);

    if (tool === 'draw' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.strokeStyle = tool === 'eraser' ? '#0D0F14' : color;
      ctx.lineWidth = tool === 'eraser' ? size * 4 : size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      setLastPoint(point);
    }
  };

  const endDraw = (e: React.MouseEvent) => {
    if (!isDrawing || !lastPoint) { setIsDrawing(false); return; }
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) { setIsDrawing(false); return; }

    const point = getCanvasPoint(e);

    if (tool === 'line') {
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.stroke();
    } else if (tool === 'rectangle') {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.strokeRect(lastPoint.x, lastPoint.y, point.x - lastPoint.x, point.y - lastPoint.y);
    } else if (tool === 'circle') {
      const rx = Math.abs(point.x - lastPoint.x) / 2;
      const ry = Math.abs(point.y - lastPoint.y) / 2;
      const cx = lastPoint.x + (point.x - lastPoint.x) / 2;
      const cy = lastPoint.y + (point.y - lastPoint.y) / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.stroke();
    }

    setIsDrawing(false);
    setLastPoint(null);
    saveHistory();
  };

  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const newIndex = historyIndex - 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const newIndex = historyIndex + 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };

  const handleClear = () => {
    const ctx = canvasRef.current?.getContext('2d');
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    ctx.fillStyle = '#0D0F14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveHistory();
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `whiteboard-${roomId}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const tools: { key: Tool; label: string; icon: string }[] = [
    { key: 'draw', label: 'Draw', icon: '✏️' },
    { key: 'line', label: 'Line', icon: '📏' },
    { key: 'rectangle', label: 'Rectangle', icon: '⬜' },
    { key: 'circle', label: 'Circle', icon: '⭕' },
    { key: 'text', label: 'Text', icon: '📝' },
    { key: 'eraser', label: 'Eraser', icon: '🧹' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="h-10 bg-bg-surface border-b border-border-subtle flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-1">
          {tools.map((t) => (
            <button
              key={t.key}
              onClick={() => setTool(t.key)}
              title={t.label}
              className={clsx(
                'w-8 h-8 rounded flex items-center justify-center text-sm transition-colors',
                tool === t.key
                  ? 'bg-accent/20 text-accent'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-overlay',
              )}
            >
              {t.icon}
            </button>
          ))}

          <div className="w-px h-6 bg-border-subtle mx-1" />

          {/* Color picker */}
          <div className="flex items-center gap-0.5">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={clsx(
                  'w-5 h-5 rounded-full border-2 transition-transform',
                  color === c ? 'border-accent scale-110' : 'border-transparent',
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="w-px h-6 bg-border-subtle mx-1" />

          {/* Size */}
          <div className="flex items-center gap-0.5">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={clsx(
                  'w-7 h-7 rounded flex items-center justify-center',
                  size === s ? 'bg-accent/20' : 'hover:bg-bg-overlay',
                )}
              >
                <div className="rounded-full bg-text-primary" style={{ width: s + 2, height: s + 2 }} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={handleUndo} className="px-2 py-1 rounded text-caption text-text-muted hover:text-text-primary hover:bg-bg-overlay" title="Undo">↩</button>
          <button onClick={handleRedo} className="px-2 py-1 rounded text-caption text-text-muted hover:text-text-primary hover:bg-bg-overlay" title="Redo">↪</button>
          <button onClick={handleClear} className="px-2 py-1 rounded text-caption text-text-muted hover:text-text-primary hover:bg-bg-overlay" title="Clear">🗑️</button>
          <button onClick={handleExport} className="px-2 py-1 rounded text-caption text-text-muted hover:text-text-primary hover:bg-bg-overlay" title="Export PNG">💾</button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 min-h-0 bg-[#0D0F14] cursor-crosshair">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
        />
      </div>
    </div>
  );
}
