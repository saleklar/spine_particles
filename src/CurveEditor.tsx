import React, { useState, useRef, useEffect, MouseEvent as ReactMouseEvent } from 'react';

export interface CurvePoint {
  x: number;
  y: number;
}

interface CurveEditorProps {
  value: string; // JSON of CurvePoint[]
  onChange: (value: string) => void;
  height?: number;
  width?: number;
}

export const CurveEditor: React.FC<CurveEditorProps> = ({ value, onChange, height = 60, width = 200 }) => {
  const [points, setPoints] = useState<CurvePoint[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  useEffect(() => {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed) && parsed.length >= 2) {
        setPoints(parsed);
      } else {
        setPoints([{x: 0, y: 1}, {x: 1, y: 1}]);
      }
    } catch (e) {
      setPoints([{x: 0, y: 1}, {x: 1, y: 1}]);
    }
  }, [value]);

  const updateValue = (newPoints: CurvePoint[]) => {
    // Sort by x to ensure correct curve evaluation
    const sorted = [...newPoints].sort((a, b) => a.x - b.x);
    // Ensure endpoints are exactly at 0 and 1
    if (sorted.length > 0) {
      sorted[0].x = 0;
      sorted[sorted.length - 1].x = 1;
    }
    setPoints(sorted);
    onChange(JSON.stringify(sorted));
  };

  const toPx = (p: CurvePoint) => ({
    x: p.x * width,
    y: (1 - p.y) * height
  });

  const handleMouseDown = (e: ReactMouseEvent, idx: number) => {
    e.stopPropagation();
    setDraggingIdx(idx);
  };

  const handleBackgroundMouseDown = (e: ReactMouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / width));
    const y = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / height));
    
    // Add new point
    const newPoints = [...points, { x, y }];
    updateValue(newPoints);
    setDraggingIdx(newPoints.length - 1);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingIdx === null || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let x = (e.clientX - rect.left) / width;
      let y = 1 - (e.clientY - rect.top) / height;
      
      x = Math.max(0, Math.min(1, x));
      y = Math.max(0, Math.min(1, y));
      
      // If middle point, allow dragging smoothly. If bounds, lock X
      const newPoints = [...points];
      newPoints[draggingIdx] = { 
        x: (draggingIdx === 0 || draggingIdx === points.length - 1) ? newPoints[draggingIdx].x : x, 
        y 
      };
      setPoints(newPoints);
    };

    const handleMouseUp = () => {
      if (draggingIdx !== null) {
         updateValue([...points]); // Commit & sort
         setDraggingIdx(null);
      }
    };

    if (draggingIdx !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingIdx, points]);

  const removePoint = (e: ReactMouseEvent, idx: number) => {
    e.stopPropagation();
    e.preventDefault(); // allow right click to remove
    if (idx === 0 || idx === points.length - 1) return; // Keep endpoints
    const newPoints = points.filter((_, i) => i !== idx);
    updateValue(newPoints);
  };

  if (points.length < 2) return null;

  // Build path
  const pathD = points.map((p, i) => {
    const pt = toPx(p);
    return i === 0 ? String.fromCharCode(77, 32) + pt.x + String.fromCharCode(32) + pt.y : String.fromCharCode(76, 32) + pt.x + String.fromCharCode(32) + pt.y;
  }).join(' ');

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleBackgroundMouseDown}
      style={{
        position: 'relative', 
        width: width + 'px',
        height: height + 'px',
        background: '#222', 
        border: '1px solid #444',
        cursor: 'crosshair',
        marginBottom: '5px'
      }}
    >
      <svg width={width} height={height} style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none'}}>
        <path d={pathD} stroke="#ffaa00" strokeWidth="2" fill="none" />
      </svg>
      {points.map((p, i) => (
        <div 
          key={i}
          onMouseDown={(e) => {
             if (e.button === 2) removePoint(e, i); // right click remove
             else handleMouseDown(e, i); 
          }}
          onContextMenu={(e) => { e.preventDefault(); removePoint(e, i); }}
          style={{
            position: 'absolute',
            left: toPx(p).x - 4,
            top: toPx(p).y - 4,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: i === draggingIdx ? '#fff' : '#ffaa00',
            cursor: (i === 0 || i === points.length - 1) ? 'ns-resize' : 'pointer',
            zIndex: 10
          }}
        />
      ))}
      <div style={{position:'absolute', top:-15, right:0, fontSize:'10px', color:'#777'}}>R-Click to remove point</div>
    </div>
  );
};

export const evaluateCurve = (curveJson: string, t: number, defaultValue: number = 1): number => {
  try {
    const points: CurvePoint[] = JSON.parse(curveJson);
    if (!points || points.length < 2) return defaultValue;
    if (t <= points[0].x) return points[0].y;
    if (t >= points[points.length - 1].x) return points[points.length - 1].y;

    for (let i = 0; i < points.length - 1; i++) {
       const p1 = points[i];
       const p2 = points[i+1];
       if (t >= p1.x && t <= p2.x) {
         const segmentT = (t - p1.x) / (p2.x - p1.x);
         // Linear interpolation for simplicity
         return p1.y + (p2.y - p1.y) * segmentT;
       }
    }
    return defaultValue;
  } catch(e) {
    return defaultValue;
  }
}
