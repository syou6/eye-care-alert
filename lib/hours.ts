// lib/hours.ts
// Shared design tokens for the "Hours" design language.
// Time-of-day reactive palette + type tokens.
// Used by EyeCareGlobal, ArticleLayout, PWAInstaller.

export type HourLabel =
  | "vigil" | "dawn" | "morning" | "midday"
  | "afternoon" | "evening" | "twilight" | "night";

export interface Palette {
  bg: string; surface: string; ink: string; mute: string;
  rule: string; primary: string; secondary: string; warn: string;
}

interface HourKey { h: number; label: HourLabel; p: Palette }

// Vigil holds 22:00–04:00; dawn peaks at 06:00; midday at 13:00.
const HOUR_KEYS: HourKey[] = [
  { h: 0,  label: "vigil",    p: { bg:"#0e141a", surface:"#161e24", ink:"#ece5d3", mute:"#8a8378", rule:"rgba(236,229,211,.14)", primary:"#c47d56", secondary:"#6a8a82", warn:"#d68a6a" } },
  { h: 4,  label: "vigil",    p: { bg:"#101820", surface:"#19222b", ink:"#ece5d3", mute:"#8a8378", rule:"rgba(236,229,211,.14)", primary:"#c47d56", secondary:"#7a9a8d", warn:"#d68a6a" } },
  { h: 6,  label: "dawn",     p: { bg:"#ecd9c2", surface:"#f4e6d3", ink:"#2a1f15", mute:"#7d6a55", rule:"rgba(42,31,21,.18)", primary:"#b25433", secondary:"#8a8a5a", warn:"#a04020" } },
  { h: 9,  label: "morning",  p: { bg:"#f5f1ea", surface:"#fbf8f2", ink:"#1c1b18", mute:"#7a7568", rule:"rgba(28,27,24,.14)", primary:"#c47d56", secondary:"#7a8a6f", warn:"#b85a2e" } },
  { h: 13, label: "midday",   p: { bg:"#f8f5ee", surface:"#fefcf6", ink:"#19181a", mute:"#7a7568", rule:"rgba(25,24,26,.14)", primary:"#b56d4a", secondary:"#6e8265", warn:"#b85226" } },
  { h: 17, label: "evening",  p: { bg:"#eedfc8", surface:"#f4e8d4", ink:"#2a2014", mute:"#7d6855", rule:"rgba(42,32,20,.18)", primary:"#b35a32", secondary:"#7a7e5a", warn:"#a04020" } },
  { h: 20, label: "twilight", p: { bg:"#1f2530", surface:"#262d39", ink:"#d8d2c2", mute:"#8c8678", rule:"rgba(216,210,194,.14)", primary:"#c47d56", secondary:"#7a9a8d", warn:"#d88a6a" } },
  { h: 22, label: "vigil",    p: { bg:"#101820", surface:"#19222b", ink:"#ece5d3", mute:"#8a8378", rule:"rgba(236,229,211,.14)", primary:"#c47d56", secondary:"#7a9a8d", warn:"#d68a6a" } },
  { h: 24, label: "vigil",    p: { bg:"#0e141a", surface:"#161e24", ink:"#ece5d3", mute:"#8a8378", rule:"rgba(236,229,211,.14)", primary:"#c47d56", secondary:"#6a8a82", warn:"#d68a6a" } },
];

function hexToRgb(hex: string): [number, number, number] {
  const v = hex.replace("#",""); const w = v.length === 3 ? v.split("").map(c=>c+c).join("") : v;
  return [parseInt(w.slice(0,2),16), parseInt(w.slice(2,4),16), parseInt(w.slice(4,6),16)];
}
function rgbToHex(r:number, g:number, b:number){
  const t = (n:number)=>Math.round(Math.max(0,Math.min(255,n))).toString(16).padStart(2,"0");
  return "#"+t(r)+t(g)+t(b);
}
function lerpColor(a:string, b:string, t:number): string {
  if (a.startsWith("rgba")) {
    const pa = (a.match(/[\d.]+/g) || []).map(Number);
    const pb = (b.match(/[\d.]+/g) || []).map(Number);
    const o = pa.map((v,i)=>v + (pb[i]-v)*t);
    return `rgba(${Math.round(o[0])},${Math.round(o[1])},${Math.round(o[2])},${o[3].toFixed(3)})`;
  }
  const [r1,g1,b1] = hexToRgb(a); const [r2,g2,b2] = hexToRgb(b);
  return rgbToHex(r1+(r2-r1)*t, g1+(g2-g1)*t, b1+(b2-b1)*t);
}

export function paletteForHour(hour: number): Palette & { label: HourLabel } {
  const h = ((hour % 24) + 24) % 24;
  for (let i = 0; i < HOUR_KEYS.length - 1; i++) {
    const a = HOUR_KEYS[i], b = HOUR_KEYS[i+1];
    if (h >= a.h && h < b.h) {
      const t = (h - a.h) / (b.h - a.h);
      const out = {} as Palette;
      for (const k of Object.keys(a.p) as (keyof Palette)[]) out[k] = lerpColor(a.p[k], b.p[k], t);
      return { ...out, label: t < 0.5 ? a.label : b.label };
    }
  }
  return { ...HOUR_KEYS[0].p, label: "vigil" };
}

// `theme` overrides: 'light' pins midday, 'dark' pins twilight/vigil.
export function effectivePalette(hour: number, theme: "auto" | "light" | "dark"){
  if (theme === "light") return paletteForHour(11);
  if (theme === "dark")  return paletteForHour(23.5);
  return paletteForHour(hour);
}

export function isVigil(hour: number){ return hour < 4 || hour >= 22; }

// Convenience for setting CSS vars on a root element
export function paletteVars(p: Palette): Record<string,string> {
  return {
    "--c-bg": p.bg, "--c-surface": p.surface, "--c-ink": p.ink,
    "--c-mute": p.mute, "--c-rule": p.rule, "--c-primary": p.primary,
    "--c-secondary": p.secondary, "--c-warn": p.warn,
  };
}

// Type tokens — Geist Sans + Geist Mono (already loaded) + system editorial serif.
export const FONT_SERIF =
  `"GT Sectra Display","Source Serif Pro",Charter,"Iowan Old Style","Apple Garamond",Cambria,"Times New Roman",Georgia,ui-serif,serif`;

// Hour-of-day classifier — used for the masthead label.
export function hourLabelFor(h: number): HourLabel {
  if (h < 4)    return "vigil";
  if (h < 6.5)  return "dawn";
  if (h < 11)   return "morning";
  if (h < 14)   return "midday";
  if (h < 17)   return "afternoon";
  if (h < 19.5) return "evening";
  if (h < 21.5) return "twilight";
  return "night";
}

// Roman numerals — editorial flourish for the session counter.
// Falls back to Arabic digits above 99 (CDXII etc. is unreadable as a counter).
export function roman(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "—";
  if (n > 99) return String(n);
  const map: [number, string][] = [
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let r = "", v = n;
  for (const [val, sym] of map) while (v >= val) { r += sym; v -= val; }
  return r;
}

// CJK + Devanagari want generous leading.
export function langLineHeight(lang: string){
  return (lang === "ja" || lang === "zh" || lang === "ko" || lang === "hi") ? 1.85 : 1.7;
}
export function isRTL(lang: string){ return lang === "ar"; }
