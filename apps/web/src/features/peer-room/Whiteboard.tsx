import { useRef, useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { getSocket } from '@/services/socket';

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
  
  // Start point for shapes (where mouse down happened)
  const [shapeStartPoint, setShapeStartPoint] = useState<Point | null>(null);

  // Track whether canvas has been initialized with content  
  const initializedRef = useRef(false);

  // Use ResizeObserver to properly size canvas even when initially hidden
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (w === 0 || h === 0) return; // still hidden, skip

      // Save existing content before resize
      const ctx = canvas.getContext('2d');
      let imageData: ImageData | null = null;
      if (ctx && canvas.width > 0 && canvas.height > 0 && initializedRef.current) {
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      }

      canvas.width = w;
      canvas.height = h;

      if (ctx) {
        ctx.fillStyle = '#0D0F14';
        ctx.fillRect(0, 0, w, h);
        // Restore previous content if we had any
        if (imageData) {
          ctx.putImageData(imageData, 0, 0);
        }
        initializedRef.current = true;
      }
    };

    const observer = new ResizeObserver(() => {
      resizeCanvas();
    });
    observer.observe(canvas);

    // Also try immediately in case it's already visible
    resizeCanvas();

    const socket = getSocket();
    socket.emit('whiteboard:join', { roomId });

    const handleUpdate = (data: { objects: any }) => {
      const c = canvasRef.current;
      const context = c?.getContext('2d');
      if (!context || !c) return;
      const act = data.objects;
      
      if (act.action === 'draw-segment') {
        context.beginPath();
        context.moveTo(act.start.x, act.start.y);
        context.lineTo(act.end.x, act.end.y);
        context.strokeStyle = act.tool === 'eraser' ? '#0D0F14' : act.color;
        context.lineWidth = act.tool === 'eraser' ? act.size * 4 : act.size;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.stroke();
      } else if (act.action === 'shape') {
        context.beginPath();
        if (act.tool === 'line') {
          context.moveTo(act.start.x, act.start.y);
          context.lineTo(act.end.x, act.end.y);
        } else if (act.tool === 'rectangle') {
          context.rect(act.start.x, act.start.y, act.end.x - act.start.x, act.end.y - act.start.y);
        } else if (act.tool === 'circle') {
          const rx = Math.abs(act.end.x - act.start.x) / 2;
          const ry = Math.abs(act.end.y - act.start.y) / 2;
          const cx = act.start.x + (act.end.x - act.start.x) / 2;
          const cy = act.start.y + (act.end.y - act.start.y) / 2;
          context.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
        }
        context.strokeStyle = act.color;
        context.lineWidth = act.size;
        context.stroke();
      } else if (act.action === 'text') {
        context.fillStyle = act.color;
        context.font = `${act.size * 4}px 'JetBrains Mono', monospace`;
        context.fillText(act.text, act.point.x, act.point.y);
      } else if (act.action === 'clear') {
        context.fillStyle = '#0D0F14';
        context.fillRect(0, 0, c.width, c.height);
      }
    };

    socket.on('whiteboard:update', handleUpdate);

    return () => {
      observer.disconnect();
      socket.off('whiteboard:update', handleUpdate);
    };
  }, [roomId]);

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
    setShapeStartPoint(point);

    if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          ctx.fillStyle = color;
          ctx.font = `${size * 4}px 'JetBrains Mono', monospace`;
          ctx.fillText(text, point.x, point.y);
          
          getSocket().emit('whiteboard:update', { 
            roomId, 
            objects: { action: 'text', point, text, color, size } 
          });
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
      
      // Emit segment over socket
      getSocket().emit('whiteboard:update', {
        roomId,
        objects: { action: 'draw-segment', start: lastPoint, end: point, color, size, tool }
      });
      
      setLastPoint(point);
    }
  };

  const endDraw = (e: React.MouseEvent) => {
    if (!isDrawing || !shapeStartPoint) { setIsDrawing(false); return; }
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) { setIsDrawing(false); return; }

    const point = getCanvasPoint(e);

    if (['line', 'rectangle', 'circle'].includes(tool)) {
      ctx.beginPath();
      if (tool === 'line') {
        ctx.moveTo(shapeStartPoint.x, shapeStartPoint.y);
        ctx.lineTo(point.x, point.y);
      } else if (tool === 'rectangle') {
        ctx.rect(shapeStartPoint.x, shapeStartPoint.y, point.x - shapeStartPoint.x, point.y - shapeStartPoint.y);
      } else if (tool === 'circle') {
        const rx = Math.abs(point.x - shapeStartPoint.x) / 2;
        const ry = Math.abs(point.y - shapeStartPoint.y) / 2;
        const cx = shapeStartPoint.x + (point.x - shapeStartPoint.x) / 2;
        const cy = shapeStartPoint.y + (point.y - shapeStartPoint.y) / 2;
        ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.stroke();

      getSocket().emit('whiteboard:update', {
        roomId,
        objects: { action: 'shape', start: shapeStartPoint, end: point, tool, color, size }
      });
    }

    setIsDrawing(false);
    setLastPoint(null);
    setShapeStartPoint(null);
  };

  const handleClear = () => {
    const ctx = canvasRef.current?.getContext('2d');
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    ctx.fillStyle = '#0D0F14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    getSocket().emit('whiteboard:update', { roomId, objects: { action: 'clear' } });
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
          <button onClick={handleClear} className="px-2 py-1 rounded text-caption text-text-muted hover:text-text-primary hover:bg-bg-overlay" title="Clear All">🗑️ Clear</button>
          <button onClick={handleExport} className="px-2 py-1 rounded text-caption text-text-muted hover:text-text-primary hover:bg-bg-overlay" title="Export PNG">💾 Export</button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 min-h-0 bg-[#0D0F14] cursor-crosshair relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
        />
      </div>
    </div>
  );
}
