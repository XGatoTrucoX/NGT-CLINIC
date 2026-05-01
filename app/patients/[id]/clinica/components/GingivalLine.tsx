'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

const UPPER_ORDER = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
const LOWER_ORDER = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];

interface Point { x: number; y: number; }
type PointMap = Record<number, Point>;

interface GingivalLineProps {
  containerRef: React.RefObject<HTMLDivElement>;
  activeMode: string;
}

// Catmull-Rom → bezier cúbico
function catmullRomPath(pts: Point[]): string {
  if (pts.length < 2) return '';
  const d: string[] = [];
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[Math.min(i + 1, pts.length - 1)];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    if (i === 0) { d.push(`M ${p1.x} ${p1.y}`); continue; }
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }
  return d.join(' ');
}

// Segmento de un punto al siguiente (para colorear individualmente)
function segmentPath(pts: Point[], i: number): string {
  if (i >= pts.length - 1) return '';
  const p0 = pts[Math.max(i - 1, 0)];
  const p1 = pts[i];
  const p2 = pts[i + 1];
  const p3 = pts[Math.min(i + 2, pts.length - 1)];
  const cp1x = p1.x + (p2.x - p0.x) / 6;
  const cp1y = p1.y + (p2.y - p0.y) / 6;
  const cp2x = p2.x - (p3.x - p1.x) / 6;
  const cp2y = p2.y - (p3.y - p1.y) / 6;
  return `M ${p1.x} ${p1.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
}

function measureTeeth(order: number[], containerRect: DOMRect, isUpper: boolean): PointMap {
  const map: PointMap = {};
  const total = order.length;
  order.forEach((id, idx) => {
    const el = document.querySelector<HTMLElement>(
      `.tooth-container[data-tooth-id="${id}"][data-position="buccal"]`
    );
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left - containerRect.left + r.width / 2;
    const norm = 1 - Math.abs((idx - (total - 1) / 2) / ((total - 1) / 2));
    const arcOffset = norm * 14;
    // Superior: un poco más abajo del centro → 0.62
    // Inferior: un poco más arriba del centro → 0.62 desde abajo
    const cy = isUpper
      ? r.top - containerRect.top + r.height * 0.62 + arcOffset
      : r.bottom - containerRect.top - r.height * 0.62 - arcOffset;
    map[id] = { x: cx, y: cy };
  });
  return map;
}

// Estado gingival según desplazamiento vertical respecto a la base
function getGingivalStatus(delta: number, isUpper: boolean): { label: string; color: string; retracted: boolean } {
  // delta positivo = bajó (superior) o subió (inferior)
  const displaced = isUpper ? -delta : delta; // positivo = retraída
  if (displaced > 20)  return { label: 'Encía retraída',   color: '#9333ea', retracted: true  };
  if (displaced < -15) return { label: 'Hiperplasia gingival', color: '#f59e0b', retracted: false };
  return { label: 'Normal',            color: '#22c55e',  retracted: false };
}

const THRESHOLD = 20;

const GingivalLine: React.FC<GingivalLineProps> = ({ containerRef, activeMode }) => {
  const [svgSize, setSvgSize]           = useState({ w: 0, h: 0 });
  const [upperPts, setUpperPts]         = useState<PointMap>({});
  const [lowerPts, setLowerPts]         = useState<PointMap>({});
  const [basePtsUpper, setBasePtsUpper] = useState<PointMap>({});
  const [basePtsLower, setBasePtsLower] = useState<PointMap>({});
  const [dragging, setDragging]         = useState<{ id: number; arch: 'upper'|'lower' } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  // Refs para acceder siempre al valor más reciente desde event listeners
  const upperPtsRef     = useRef<PointMap>({});
  const lowerPtsRef     = useRef<PointMap>({});
  const basePtsUpperRef = useRef<PointMap>({});
  const basePtsLowerRef = useRef<PointMap>({});

  // Mantener refs sincronizados con el estado
  useEffect(() => { upperPtsRef.current = upperPts; },     [upperPts]);
  useEffect(() => { lowerPtsRef.current = lowerPts; },     [lowerPts]);
  useEffect(() => { basePtsUpperRef.current = basePtsUpper; }, [basePtsUpper]);
  useEffect(() => { basePtsLowerRef.current = basePtsLower; }, [basePtsLower]);

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const cr = containerRef.current.getBoundingClientRect();
    setSvgSize({ w: cr.width, h: cr.height });
    setUpperPts(prev => {
      const fresh = measureTeeth(UPPER_ORDER, cr, true);
      const merged: PointMap = {};
      UPPER_ORDER.forEach(id => { merged[id] = prev[id] ?? fresh[id]; });
      return Object.keys(merged).length > 0 ? merged : fresh;
    });
    setLowerPts(prev => {
      const fresh = measureTeeth(LOWER_ORDER, cr, false);
      const merged: PointMap = {};
      LOWER_ORDER.forEach(id => { merged[id] = prev[id] ?? fresh[id]; });
      return Object.keys(merged).length > 0 ? merged : fresh;
    });
  }, [containerRef]);

  useEffect(() => {
    if (activeMode !== 'perio') return;
    setUpperPts({}); setLowerPts({});
    const t = setTimeout(() => {
      if (!containerRef.current) return;
      const cr = containerRef.current.getBoundingClientRect();
      setSvgSize({ w: cr.width, h: cr.height });
      const fu = measureTeeth(UPPER_ORDER, cr, true);
      const fl = measureTeeth(LOWER_ORDER, cr, false);
      setUpperPts(fu); setLowerPts(fl);
      setBasePtsUpper(fu); setBasePtsLower(fl);
    }, 300);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(t); window.removeEventListener('resize', measure); };
  }, [activeMode, measure, containerRef]);

  // Drag solo vertical + emitir estado en tiempo real
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const cr = containerRef.current.getBoundingClientRect();
      const y = e.clientY - cr.top;
      const { id, arch } = dragging;
      if (arch === 'upper') {
        setUpperPts(prev => {
          const next = { ...prev, [id]: { x: prev[id]?.x ?? 0, y } };
          emitStatus(id, arch, next[id], basePtsUpperRef.current[id]);
          return next;
        });
      } else {
        setLowerPts(prev => {
          const next = { ...prev, [id]: { x: prev[id]?.x ?? 0, y } };
          emitStatus(id, arch, next[id], basePtsLowerRef.current[id]);
          return next;
        });
      }
    };
    const onUp = () => setDragging(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragging, containerRef]);

  // Emitir estado al seleccionar diente — usa refs para leer siempre el valor actual
  useEffect(() => {
    const handler = (e: any) => {
      const { toothId } = e.detail;
      const arch = UPPER_ORDER.includes(toothId) ? 'upper' : LOWER_ORDER.includes(toothId) ? 'lower' : null;
      if (!arch) return;
      const cur  = (arch === 'upper' ? upperPtsRef  : lowerPtsRef).current[toothId];
      const base = (arch === 'upper' ? basePtsUpperRef : basePtsLowerRef).current[toothId];
      if (!cur || !base) return;
      emitStatus(toothId, arch, cur, base);
    };
    document.addEventListener('toothSelect', handler);
    return () => document.removeEventListener('toothSelect', handler);
  }, []); // solo se registra una vez, lee siempre desde refs

  const emitStatus = (toothId: number, arch: 'upper'|'lower', cur: Point, base: Point) => {
    if (!cur || !base) return;
    const delta = cur.y - base.y;
    const status = getGingivalStatus(delta, arch === 'upper');
    const detail = { toothId, ...status, delta };
    document.dispatchEvent(new CustomEvent('gingivalStatus',       { detail }));
    document.dispatchEvent(new CustomEvent('gingivalStatusUpdate', { detail }));
  };

  if (activeMode !== 'perio') return null;
  if (svgSize.w === 0) return null;

  const upperPoints = UPPER_ORDER.map(id => upperPts[id]).filter(Boolean) as Point[];
  const lowerPoints = LOWER_ORDER.map(id => lowerPts[id]).filter(Boolean) as Point[];

  // Color por punto individual
  const ptColor = (id: number, arch: 'upper'|'lower'): string => {
    const cur  = (arch === 'upper' ? upperPts  : lowerPts)[id];
    const base = (arch === 'upper' ? basePtsUpper : basePtsLower)[id];
    if (!cur || !base) return '#e8002d';
    const delta = cur.y - base.y;
    return getGingivalStatus(delta, arch === 'upper').color;
  };

  // Color de segmento entre punto i y i+1: si alguno es morado → morado
  const segColor = (order: number[], arch: 'upper'|'lower', i: number): string => {
    const c1 = ptColor(order[i],     arch);
    const c2 = ptColor(order[i + 1], arch);
    if (c1 === '#9333ea' || c2 === '#9333ea') return '#9333ea';
    if (c1 === '#f59e0b' || c2 === '#f59e0b') return '#f59e0b';
    return '#e8002d';
  };

  const segHalo = (color: string): string => {
    if (color === '#9333ea') return 'rgba(147,51,234,0.28)';
    if (color === '#f59e0b') return 'rgba(245,158,11,0.28)';
    return 'rgba(192,0,31,0.28)';
  };

  const renderArch = (points: Point[], order: number[], arch: 'upper'|'lower') =>
    points.length > 1 ? (
      <>
        {/* Halos por segmento */}
        {order.slice(0, -1).map((id, i) => {
          const color = segColor(order, arch, i);
          return (
            <path key={`halo-${arch}-${id}`}
              d={segmentPath(points, i)} fill="none"
              stroke={segHalo(color)} strokeWidth={10} strokeLinecap="round" />
          );
        })}
        {/* Línea principal por segmento con color individual */}
        {order.slice(0, -1).map((id, i) => (
          <path key={`seg-${arch}-${id}`}
            d={segmentPath(points, i)} fill="none"
            stroke={segColor(order, arch, i)}
            strokeWidth={4} strokeLinecap="round"
            strokeOpacity={0.92} filter="url(#glow)" />
        ))}
      </>
    ) : null;

  const onMouseDown = (e: React.MouseEvent, id: number, arch: 'upper'|'lower') => {
    e.preventDefault(); e.stopPropagation();
    setDragging({ id, arch });
  };

  return (
    <svg ref={svgRef} style={{
      position: 'absolute', top: 0, left: 0,
      width: svgSize.w, height: svgSize.h,
      pointerEvents: 'none', zIndex: 20, overflow: 'visible',
    }}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {renderArch(upperPoints, UPPER_ORDER, 'upper')}
      {renderArch(lowerPoints, LOWER_ORDER, 'lower')}

      {/* Puntos superiores */}
      {UPPER_ORDER.map(id => {
        const p = upperPts[id]; if (!p) return null;
        const active = dragging?.id === id && dragging.arch === 'upper';
        const color  = ptColor(id, 'upper');
        return (
          <g key={`u-${id}`} style={{ pointerEvents: 'all', cursor: 'ns-resize' }}
            onMouseDown={e => onMouseDown(e, id, 'upper')}>
            <circle cx={p.x} cy={p.y} r={10} fill="transparent" />
            <circle cx={p.x} cy={p.y} r={active ? 6 : 4}
              fill={color} stroke="white" strokeWidth={1.5}
              style={{ transition: 'r 0.1s, fill 0.3s' }} />
          </g>
        );
      })}

      {/* Puntos inferiores */}
      {LOWER_ORDER.map(id => {
        const p = lowerPts[id]; if (!p) return null;
        const active = dragging?.id === id && dragging.arch === 'lower';
        const color  = ptColor(id, 'lower');
        return (
          <g key={`l-${id}`} style={{ pointerEvents: 'all', cursor: 'ns-resize' }}
            onMouseDown={e => onMouseDown(e, id, 'lower')}>
            <circle cx={p.x} cy={p.y} r={10} fill="transparent" />
            <circle cx={p.x} cy={p.y} r={active ? 6 : 4}
              fill={color} stroke="white" strokeWidth={1.5}
              style={{ transition: 'r 0.1s, fill 0.3s' }} />
          </g>
        );
      })}
    </svg>
  );
};

export default GingivalLine;
