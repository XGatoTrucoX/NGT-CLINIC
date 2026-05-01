'use client';

import React, { useState, useEffect, useRef } from 'react';
import Odontograma from './Odontograma';

interface OrtodonciaData {
  teeth: number[];
  startDate: string;       // ISO
  endDate: string;         // ISO
  bracketType: 'metalico' | 'transparente';
  maintenanceDays: number; // cada N días
  lastMaintenance: string; // ISO — fecha desde la que corre el temporizador de mantenimiento
  reason: string;
}

interface OrtodonciaModuleProps {
  teethData: any[];
}

const UPPER_ORDER = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
const LOWER_ORDER = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];

function getArch(id: number): 'upper' | 'lower' | null {
  if (UPPER_ORDER.includes(id)) return 'upper';
  if (LOWER_ORDER.includes(id)) return 'lower';
  return null;
}

function getRangeInArch(a: number, b: number): number[] {
  const order = UPPER_ORDER.includes(a) ? UPPER_ORDER : LOWER_ORDER;
  const idxA = order.indexOf(a), idxB = order.indexOf(b);
  if (idxA === -1 || idxB === -1) return [a, b];
  const from = Math.min(idxA, idxB), to = Math.max(idxA, idxB);
  return order.slice(from, to + 1);
}

// Calcula tiempo restante entre ahora y endISO
function calcCountdown(endISO: string) {
  const diff = new Date(endISO).getTime() - Date.now();
  if (diff <= 0) return null;
  const totalSecs  = Math.floor(diff / 1000);
  const totalHours = Math.floor(totalSecs / 3600);
  const days       = Math.floor(totalHours / 24);
  return {
    years:   Math.floor(days / 365),
    months:  Math.floor((days % 365) / 30),
    days:    days % 30,
    hours:   totalHours % 24,
    seconds: totalSecs % 60,
  };
}

// Calcula próxima revisión: lastMaintenance + maintenanceDays
function nextMaintenanceDate(lastISO: string, days: number): Date {
  const d = new Date(lastISO);
  d.setDate(d.getDate() + days);
  return d;
}

// Hoy en formato YYYY-MM-DD para value de input[type=date]
function toDateInput(iso: string) {
  return iso ? iso.slice(0, 10) : '';
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: '#0f172a', border: '1px solid #334155',
  borderRadius: '8px', padding: '0.55rem 0.75rem', color: 'white',
  fontSize: '0.88rem', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: '0.35rem', fontSize: '0.82rem', color: '#cbd5e1',
};
const fieldWrap: React.CSSProperties = { marginBottom: '0.9rem' };

// ─────────────────────────────────────────────────────────────────────────────

const OrtodonciaModule: React.FC<OrtodonciaModuleProps> = ({ teethData }) => {
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([]);
  const [anchorUpper, setAnchorUpper]     = useState<number | null>(null);
  const [anchorLower, setAnchorLower]     = useState<number | null>(null);
  const [showModal, setShowModal]         = useState(false);
  const [ortodonciaData, setOrtodonciaData] = useState<OrtodonciaData | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    startDate: today,
    endDate: '',
    bracketType: 'metalico' as 'metalico' | 'transparente',
    maintenanceDays: 14,
    reason: '',
  });

  // Temporizador tratamiento
  const [timeLeft, setTimeLeft]     = useState<ReturnType<typeof calcCountdown>>(null);
  const [finished, setFinished]     = useState(false);
  // Temporizador mantenimiento
  const [maintLeft, setMaintLeft]   = useState<ReturnType<typeof calcCountdown>>(null);
  const [maintDue, setMaintDue]     = useState(false);

  const treatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const maintIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const odontogramaRef   = useRef<HTMLDivElement>(null);

  // ── Temporizador tratamiento ──────────────────────────────────────────────
  useEffect(() => {
    if (!ortodonciaData) return;
    const tick = () => {
      const left = calcCountdown(ortodonciaData.endDate);
      if (!left) { setFinished(true); setTimeLeft(null); if (treatIntervalRef.current) clearInterval(treatIntervalRef.current); }
      else setTimeLeft(left);
    };
    tick();
    treatIntervalRef.current = setInterval(tick, 1000);
    return () => { if (treatIntervalRef.current) clearInterval(treatIntervalRef.current); };
  }, [ortodonciaData]);

  // ── Temporizador mantenimiento ────────────────────────────────────────────
  useEffect(() => {
    if (!ortodonciaData) return;
    const tick = () => {
      const nextDate = nextMaintenanceDate(ortodonciaData.lastMaintenance, ortodonciaData.maintenanceDays);
      const left = calcCountdown(nextDate.toISOString());
      if (!left) { setMaintDue(true); setMaintLeft(null); if (maintIntervalRef.current) clearInterval(maintIntervalRef.current); }
      else { setMaintDue(false); setMaintLeft(left); }
    };
    tick();
    maintIntervalRef.current = setInterval(tick, 1000);
    return () => { if (maintIntervalRef.current) clearInterval(maintIntervalRef.current); };
  }, [ortodonciaData]);

  // ── Selección por arcada ──────────────────────────────────────────────────
  const handleToothToggle = (toothId: number) => {
    const arch = getArch(toothId);
    if (!arch) return;
    const anchor    = arch === 'upper' ? anchorUpper : anchorLower;
    const setAnchor = arch === 'upper' ? setAnchorUpper : setAnchorLower;
    const others    = selectedTeeth.filter(id => getArch(id) !== arch);
    if (anchor === null) {
      setAnchor(toothId);
      setSelectedTeeth([...others, toothId]);
    } else if (anchor === toothId) {
      setAnchor(null);
      setSelectedTeeth(others);
    } else {
      setSelectedTeeth([...others, ...getRangeInArch(anchor, toothId)]);
      setAnchor(null);
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAccept  = () => { if (selectedTeeth.length > 0) setShowModal(true); };

  const handleConfirm = () => {
    if (!form.reason.trim() || !form.endDate) return;
    setOrtodonciaData({
      teeth: [...selectedTeeth],
      startDate: new Date(form.startDate).toISOString(),
      endDate:   new Date(form.endDate).toISOString(),
      bracketType: form.bracketType,
      maintenanceDays: form.maintenanceDays,
      lastMaintenance: new Date(form.startDate).toISOString(),
      reason: form.reason,
    });
    setShowModal(false);
    setFinished(false);
    setMaintDue(false);
  };

  // Registrar revisión de mantenimiento: reinicia el temporizador desde hoy
  const handleRegisterMaintenance = () => {
    if (!ortodonciaData) return;
    setOrtodonciaData({ ...ortodonciaData, lastMaintenance: new Date().toISOString() });
    setMaintDue(false);
  };

  const handleReset = () => {
    setOrtodonciaData(null); setSelectedTeeth([]);
    setAnchorUpper(null); setAnchorLower(null);
    setTimeLeft(null); setFinished(false);
    setMaintLeft(null); setMaintDue(false);
    setForm({ startDate: today, endDate: '', bracketType: 'metalico', maintenanceDays: 14, reason: '' });
  };

  const orthodontiaTeeth = ortodonciaData?.teeth || [];
  const upperSelected = selectedTeeth.filter(id => UPPER_ORDER.includes(id))
    .sort((a,b) => UPPER_ORDER.indexOf(a) - UPPER_ORDER.indexOf(b));
  const lowerSelected = selectedTeeth.filter(id => LOWER_ORDER.includes(id))
    .sort((a,b) => LOWER_ORDER.indexOf(a) - LOWER_ORDER.indexOf(b));

  const formValid = form.reason.trim() && form.endDate && new Date(form.endDate) > new Date(form.startDate);

  return (
    <div style={{ display: 'flex', gap: '1rem', width: '100%', alignItems: 'flex-start' }}>

      {/* ── Odontograma ── */}
      <div ref={odontogramaRef} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
        <Odontograma activeMode="orto" teethData={teethData}
          selectedTeeth={selectedTeeth} onToothClick={handleToothToggle} />
        <BracketOverlay orthodontiaTeeth={orthodontiaTeeth} containerRef={odontogramaRef} />
      </div>

      {/* ── Panel derecho ── */}
      <div style={{ width: '270px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

        {!ortodonciaData ? (
          /* Panel selección */
          <div style={{ background: '#1e293b', borderRadius: '12px', padding: '1.25rem', color: 'white', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem', color: '#7dd3fc' }}>🦷 Ortodoncia</h3>
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.73rem', color: '#94a3b8', lineHeight: 1.4 }}>
              {anchorUpper !== null && <span style={{display:'block'}}>Superior — ancla: <strong style={{color:'#60a5fa'}}>{anchorUpper}</strong>, clic en diente final</span>}
              {anchorLower !== null && <span style={{display:'block'}}>Inferior — ancla: <strong style={{color:'#34d399'}}>{anchorLower}</strong>, clic en diente final</span>}
              {anchorUpper === null && anchorLower === null && 'Clic en el primer diente del rango'}
            </p>

            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: '0.25rem' }}>Superior ({upperSelected.length}):</div>
              <div style={{ minHeight: '28px', background: '#0f172a', borderRadius: '6px', padding: '0.3rem', border: '1px solid #334155', display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                {upperSelected.length === 0 ? <span style={{ fontSize: '0.68rem', color: '#475569' }}>—</span>
                  : upperSelected.map(id => <span key={id} style={{ background: '#1d4ed8', color: 'white', borderRadius: '3px', padding: '1px 5px', fontSize: '0.68rem', fontWeight: 600 }}>{id}</span>)}
              </div>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: '0.25rem' }}>Inferior ({lowerSelected.length}):</div>
              <div style={{ minHeight: '28px', background: '#0f172a', borderRadius: '6px', padding: '0.3rem', border: '1px solid #334155', display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                {lowerSelected.length === 0 ? <span style={{ fontSize: '0.68rem', color: '#475569' }}>—</span>
                  : lowerSelected.map(id => <span key={id} style={{ background: '#0f766e', color: 'white', borderRadius: '3px', padding: '1px 5px', fontSize: '0.68rem', fontWeight: 600 }}>{id}</span>)}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleAccept} disabled={selectedTeeth.length === 0}
                style={{ flex: 1, background: selectedTeeth.length > 0 ? '#3b82f6' : '#475569', color: 'white', border: 'none', borderRadius: '8px', padding: '0.6rem', cursor: selectedTeeth.length > 0 ? 'pointer' : 'not-allowed', fontWeight: 600, fontSize: '0.85rem' }}>
                Aceptar
              </button>
              {selectedTeeth.length > 0 && (
                <button onClick={() => { setSelectedTeeth([]); setAnchorUpper(null); setAnchorLower(null); }}
                  style={{ background: 'transparent', color: '#f87171', border: '1px solid #f87171', borderRadius: '8px', padding: '0.6rem 0.75rem', cursor: 'pointer', fontSize: '0.85rem' }}>✕</button>
              )}
            </div>
          </div>

        ) : (
          /* Panel activo */
          <div style={{ background: '#1e293b', borderRadius: '12px', padding: '1.25rem', color: 'white', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#7dd3fc' }}>🦷 Ortodoncia Activa</h3>
              <button onClick={handleReset} style={{ background: 'transparent', color: '#f87171', border: '1px solid #f87171', borderRadius: '6px', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.72rem' }}>Reiniciar</button>
            </div>

            {/* Info */}
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.6, background: '#0f172a', borderRadius: '8px', padding: '0.6rem', border: '1px solid #1e3a5f' }}>
              <div><span style={{ color: '#64748b' }}>Superior: </span><span style={{ color: '#60a5fa' }}>{[...ortodonciaData.teeth].filter(id => UPPER_ORDER.includes(id)).sort((a,b)=>UPPER_ORDER.indexOf(a)-UPPER_ORDER.indexOf(b)).join(', ') || '—'}</span></div>
              <div><span style={{ color: '#64748b' }}>Inferior: </span><span style={{ color: '#34d399' }}>{[...ortodonciaData.teeth].filter(id => LOWER_ORDER.includes(id)).sort((a,b)=>LOWER_ORDER.indexOf(a)-LOWER_ORDER.indexOf(b)).join(', ') || '—'}</span></div>
              <div><span style={{ color: '#64748b' }}>Bracket: </span>{ortodonciaData.bracketType === 'metalico' ? '🔩 Metálico' : '💎 Transparente'}</div>
              <div><span style={{ color: '#64748b' }}>Inicio: </span>{new Date(ortodonciaData.startDate).toLocaleDateString('es-ES')}</div>
              <div><span style={{ color: '#64748b' }}>Fin: </span>{new Date(ortodonciaData.endDate).toLocaleDateString('es-ES')}</div>
              <div><span style={{ color: '#64748b' }}>Motivo: </span>{ortodonciaData.reason}</div>
            </div>

            {/* Temporizador tratamiento */}
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 600 }}>⏱ Tiempo restante del tratamiento:</div>
              {finished ? (
                <div style={{ background: '#14532d', borderRadius: '8px', padding: '0.6rem', textAlign: 'center', border: '1px solid #16a34a' }}>
                  <div style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.88rem' }}>✅ ¡Tratamiento completado!</div>
                </div>
              ) : timeLeft ? (
                <CountdownGrid items={[
                  { label: 'Años',  value: timeLeft.years,   color: '#38bdf8' },
                  { label: 'Meses', value: timeLeft.months,  color: '#38bdf8' },
                  { label: 'Días',  value: timeLeft.days,    color: '#38bdf8' },
                  { label: 'Horas', value: timeLeft.hours,   color: '#38bdf8' },
                  { label: 'Segs',  value: timeLeft.seconds, color: '#f59e0b' },
                ]} />
              ) : null}
            </div>

            {/* Temporizador mantenimiento */}
            <div style={{ borderTop: '1px solid #334155', paddingTop: '0.75rem' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 600 }}>
                🔧 Próxima revisión (cada {ortodonciaData.maintenanceDays} días):
              </div>
              {maintDue ? (
                <div style={{ background: '#7f1d1d', borderRadius: '8px', padding: '0.6rem', textAlign: 'center', border: '1px solid #ef4444', marginBottom: '0.5rem' }}>
                  <div style={{ color: '#fca5a5', fontWeight: 700, fontSize: '0.85rem' }}>⚠️ ¡Revisión pendiente!</div>
                  <div style={{ color: '#fca5a5', fontSize: '0.7rem', marginTop: '0.2rem' }}>
                    Última: {new Date(ortodonciaData.lastMaintenance).toLocaleDateString('es-ES')}
                  </div>
                </div>
              ) : maintLeft ? (
                <>
                  <CountdownGrid items={[
                    { label: 'Días',  value: maintLeft.days,    color: '#a78bfa' },
                    { label: 'Horas', value: maintLeft.hours,   color: '#a78bfa' },
                    { label: 'Segs',  value: maintLeft.seconds, color: '#f59e0b' },
                  ]} />
                  <div style={{ fontSize: '0.65rem', color: '#475569', marginTop: '0.35rem' }}>
                    Próxima: {nextMaintenanceDate(ortodonciaData.lastMaintenance, ortodonciaData.maintenanceDays).toLocaleDateString('es-ES')}
                  </div>
                </>
              ) : null}
              <button onClick={handleRegisterMaintenance}
                style={{ marginTop: '0.5rem', width: '100%', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '7px', padding: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                ✓ Registrar revisión hoy
              </button>
            </div>

          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#1e293b', borderRadius: '16px', padding: '2rem', width: '460px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #334155', color: 'white' }}>

            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', color: '#7dd3fc' }}>📋 Datos del Tratamiento de Ortodoncia</h3>

            <div style={{ marginBottom: '1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
              <div>Superior: <strong style={{ color: '#60a5fa' }}>{upperSelected.join(', ') || '—'}</strong></div>
              <div>Inferior: <strong style={{ color: '#34d399' }}>{lowerSelected.join(', ') || '—'}</strong></div>
            </div>

            {/* Fecha inicio */}
            <div style={fieldWrap}>
              <label style={labelStyle}>Fecha de inicio:</label>
              <input type="date" value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                style={inputStyle} />
            </div>

            {/* Fecha fin */}
            <div style={fieldWrap}>
              <label style={labelStyle}>Fecha de fin estimada:</label>
              <input type="date" value={form.endDate} min={form.startDate}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                style={inputStyle} />
            </div>

            {/* Tipo de bracket */}
            <div style={fieldWrap}>
              <label style={labelStyle}>Tipo de bracket:</label>
              <select value={form.bracketType}
                onChange={e => setForm(f => ({ ...f, bracketType: e.target.value as any }))}
                style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="metalico">🔩 Metálico</option>
                <option value="transparente">💎 Transparente</option>
              </select>
            </div>

            {/* Días de mantenimiento */}
            <div style={fieldWrap}>
              <label style={labelStyle}>Intervalo de revisión (días):</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[7, 14, 21, 30].map(d => (
                  <button key={d} onClick={() => setForm(f => ({ ...f, maintenanceDays: d }))}
                    style={{ flex: 1, padding: '0.45rem 0', borderRadius: '7px', border: '1px solid',
                      borderColor: form.maintenanceDays === d ? '#7c3aed' : '#334155',
                      background: form.maintenanceDays === d ? '#4c1d95' : '#0f172a',
                      color: form.maintenanceDays === d ? '#c4b5fd' : '#94a3b8',
                      cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                    {d === 7 ? '1 sem' : d === 14 ? '2 sem' : d === 21 ? '3 sem' : '1 mes'}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Personalizado:</span>
                <input type="number" min={1} max={365} value={form.maintenanceDays}
                  onChange={e => setForm(f => ({ ...f, maintenanceDays: Number(e.target.value) }))}
                  style={{ ...inputStyle, width: '80px' }} />
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>días</span>
              </div>
            </div>

            {/* Motivo */}
            <div style={fieldWrap}>
              <label style={labelStyle}>Motivo del tratamiento:</label>
              <textarea rows={3} value={form.reason}
                onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                placeholder="Describe el motivo de la ortodoncia..."
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)}
                style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #475569', borderRadius: '8px', padding: '0.6rem 1.25rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                Cancelar
              </button>
              <button onClick={handleConfirm} disabled={!formValid}
                style={{ background: formValid ? '#3b82f6' : '#475569', color: 'white', border: 'none', borderRadius: '8px', padding: '0.6rem 1.5rem', cursor: formValid ? 'pointer' : 'not-allowed', fontWeight: 600, fontSize: '0.9rem' }}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Componente reutilizable de grid de cuenta regresiva ───────────────────────
const CountdownGrid: React.FC<{ items: { label: string; value: number; color: string }[] }> = ({ items }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: '0.3rem' }}>
    {items.map(({ label, value, color }) => (
      <div key={label} style={{ background: '#0f172a', borderRadius: '6px', padding: '0.35rem 0.2rem', textAlign: 'center', border: '1px solid #334155' }}>
        <div style={{ fontSize: '1rem', fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>
          {String(value).padStart(2, '0')}
        </div>
        <div style={{ fontSize: '0.55rem', color: '#64748b' }}>{label}</div>
      </div>
    ))}
  </div>
);

// ── Overlay de brackets ───────────────────────────────────────────────────────
const BracketOverlay: React.FC<{
  orthodontiaTeeth: number[];
  containerRef: React.RefObject<HTMLDivElement>;
}> = ({ orthodontiaTeeth, containerRef }) => {
  const [positions, setPositions] = useState<
    { id: number; top: number; left: number; width: number; height: number; isUpper: boolean }[]
  >([]);
  const [imgRatio, setImgRatio] = useState<number>(0.3); // height/width ratio, se actualiza al cargar

  useEffect(() => {
    if (orthodontiaTeeth.length === 0) { setPositions([]); return; }
    const update = () => {
      if (!containerRef.current) return;
      const pr = containerRef.current.getBoundingClientRect();
      const next: typeof positions = [];
      orthodontiaTeeth.forEach(toothId => {
        const isUpper = UPPER_ORDER.includes(toothId);
        document.querySelectorAll<HTMLElement>(
          `.tooth-container[data-tooth-id="${toothId}"][data-position="buccal"]`
        ).forEach(el => {
          const r = el.getBoundingClientRect();
          next.push({ id: toothId, top: r.top - pr.top, left: r.left - pr.left, width: r.width, height: r.height, isUpper });
        });
      });
      setPositions(next);
    };
    const t = setTimeout(update, 200);
    window.addEventListener('resize', update);
    return () => { clearTimeout(t); window.removeEventListener('resize', update); };
  }, [orthodontiaTeeth, containerRef]);

  if (positions.length === 0) return null;

  const bracketH = (w: number) => w * imgRatio;

  return (
    <>
      {/* Imagen oculta para medir el ratio real */}
      <img src="/images/teeth/periodoncia/Bracket.png" alt=""
        style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', width: 100 }}
        onLoad={e => {
          const img = e.currentTarget;
          if (img.naturalWidth > 0) setImgRatio(img.naturalHeight / img.naturalWidth);
        }}
      />
      {positions.map((pos, idx) => {
        const bH = bracketH(pos.width);
        return (
          <img key={`br-${pos.id}-${idx}`} src="/images/teeth/periodoncia/Bracket.png" alt="bracket"
            style={{
              position: 'absolute',
              // Superiores: pie del diente (alineado al borde inferior del contenedor)
              // Inferiores: cabeza del diente (alineado al borde superior)
              top: pos.isUpper ? pos.top + pos.height - bH : pos.top,
              left: pos.left,
              width: pos.width,
              height: bH,
              objectFit: 'fill',
              pointerEvents: 'none',
              zIndex: 10,
            }} />
        );
      })}
    </>
  );
};

export default OrtodonciaModule;
