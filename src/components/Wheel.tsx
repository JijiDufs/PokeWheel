import { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from "react";
import { WheelItem } from "../types";

interface WheelProps { items: WheelItem[]; winIdx: number; onDone: (item: WheelItem) => void; label?: string; colFn?: (item: WheelItem, i: number) => string; sizes?: number[] | null; sz?: number; onStateChange?: (spinning: boolean, done: boolean) => void; }
export interface WheelRef { spin: () => void; }

const WCOLS = ["#FF7A7A", "#FFB347", "#F4D03F", "#58D68D", "#5DADE2", "#AF7AC5", "#F39C12", "#48C9B0", "#F5B7B1"];

export const Wheel = forwardRef<WheelRef, WheelProps>(({ items, winIdx, onDone, label, colFn, sizes, sz = 360, onStateChange }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [done, setDone] = useState(false);

  function getArcs() {
    const n = items.length; let totalSz = 0; const szArr: number[] = [];
    for (let i = 0; i < n; i++) { const s = sizes?.[i] ?? 1; szArr.push(s); totalSz += s; }
    const arcs: { start: number; size: number }[] = []; let cum = 0;
    for (let j = 0; j < n; j++) { const a = (szArr[j] / totalSz) * 2 * Math.PI; arcs.push({ start: cum, size: a }); cum += a; }
    return arcs;
  }

  const draw = useCallback((angle: number) => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const W = c.width, H = c.height, cx = W/2, cy = H/2, R = Math.min(cx,cy) - 14;
    ctx.clearRect(0,0,W,H);
    const n = items.length; const arcs = getArcs();
    for (let i = 0; i < n; i++) {
      const a0 = angle + arcs[i].start, a1 = a0 + arcs[i].size;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,R,a0,a1); ctx.closePath();
      ctx.fillStyle = colFn ? colFn(items[i],i) : WCOLS[i % WCOLS.length]; ctx.fill();
      ctx.strokeStyle = "#2C3E50"; ctx.lineWidth = 3; ctx.stroke();
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(a0 + arcs[i].size/2);
      ctx.fillStyle = "#fff";
      ctx.shadowColor = "#000"; ctx.shadowBlur = 4;
      const fs = Math.max(11, Math.min(16, Math.floor(320/n)));
      ctx.font = `bold ${fs}px 'Courier New', Courier, monospace`; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      const lb = items[i].n || items[i].label || ""; const ml = n > 8 ? 10 : 12;
      ctx.fillText(lb.length > ml ? lb.slice(0,ml-1)+"…" : lb, R-18, 0); ctx.restore();
    }
    ctx.beginPath(); ctx.moveTo(cx+R+14,cy); ctx.lineTo(cx+R-10,cy-14); ctx.lineTo(cx+R-10,cy+14); ctx.closePath();
    ctx.fillStyle="#F1C40F"; ctx.fill(); ctx.strokeStyle="#2C3E50"; ctx.lineWidth=3; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy,22,0,2*Math.PI); ctx.fillStyle="#F0ECD6"; ctx.fill(); ctx.strokeStyle="#2C3E50"; ctx.lineWidth=4; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy,10,0,2*Math.PI); ctx.fillStyle="#E3350D"; ctx.fill();
  }, [items, colFn, sizes, sz]);

  useEffect(() => { draw(angRef.current); }, [draw]);

  const spin = () => {
    if (spinning || done) return;
    setSpinning(true); onStateChange?.(true, false);
    const arcs = getArcs(); const seg = arcs[winIdx];
    const margin = seg.size * 0.15; const randomOffset = margin + Math.random() * (seg.size - 2 * margin);
    const targetAngle = seg.start + randomOffset;
    const target = -targetAngle + Math.PI * 2 * (5 + Math.floor(Math.random() * 3));
    const startAngle = angRef.current; const totalRot = target - startAngle;
    const duration = 2800 + Math.random() * 600; const t0 = performance.now();
    function animate(now: number) {
      const p = Math.min((now - t0) / duration, 1); const ease = 1 - Math.pow(1 - p, 4);
      const cur = startAngle + totalRot * ease; angRef.current = cur; draw(cur);
      if (p < 1) { animRef.current = requestAnimationFrame(animate); }
      else { setSpinning(false); setDone(true); onStateChange?.(false, true); }
    }
    animRef.current = requestAnimationFrame(animate);
  };

  useImperativeHandle(ref, () => ({ spin }));
  useEffect(() => { return () => { if (animRef.current) cancelAnimationFrame(animRef.current); }; }, []);

  return (
    <div style={{position: "relative", zIndex: 10, display:"flex",flexDirection:"column",alignItems:"center",gap:8,width:"100%", height:"100%", maxHeight:"100%", justifyContent:"center"}}>
      {label && <div style={{position: "relative", zIndex: 15, fontSize:16,fontWeight:800,color:"#F0ECD6",textAlign:"center",background:"#2C3E50",border:"2px solid #1A252F",padding:"6px 16px",borderRadius:8, boxShadow: "0 4px 0 rgba(0,0,0,0.2)"}}>{label}</div>}
      <canvas 
        ref={canvasRef} width={sz} height={sz} onClick={spin} 
        style={{position: "relative", zIndex: 10, maxWidth:"100%", maxHeight:"100%", objectFit:"contain", cursor: (!spinning && !done) ? "pointer" : "default"}} 
      />
    </div>
  );
});
