"use client";
 
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import contentData from "@/data/content.json";
import { WhyChooseUsData } from "@/data/type";
 
interface WhyChooseUsProps {
  data?: WhyChooseUsData;
}
 
type StatType = WhyChooseUsData["achievements"]["stats"][number];
 
/*
 * Glitch-proofing notes
 * - Entrance animations, hover, tilt and parallax each live on their own layer or use
 *   independent CSS properties (scale / rotate / translate), so no transform is ever overwritten.
 * - Pointer tracking is read from a stationary wrapper, never from the tilted card itself.
 * - Counters render an invisible copy of the final number to reserve its width (no layout shift).
 * - Highlights use a colour wave, not background-clip: text.
 */
const WC_CSS = `
/* ---------- shared keyframes ---------- */
@keyframes wc-line { from { opacity: 0; transform: scaleX(0); } }
@keyframes wc-ch { from { opacity: 0; transform: translateY(0.6em) rotate(8deg) scale(0.7); filter: blur(6px); } }
@keyframes wc-cd { from { opacity: 0; transform: translateY(-0.7em) rotate(-8deg) scale(1.5); filter: blur(8px); } }
@keyframes wc-hw { from { opacity: 0; transform: translateY(115%) rotate(5deg); } }
@keyframes wc-bw { from { opacity: 0; filter: blur(8px); transform: translateY(12px); } }
@keyframes wc-wave {
  0%, 60%, 100% { color: var(--wb, #2E004F); text-shadow: 0 0 0 rgba(207, 140, 235, 0); }
  30% { color: var(--wp, #a93bd8); text-shadow: 0 0 20px rgba(207, 140, 235, 0.5); }
}
@keyframes wc-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes wc-redraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes wc-spark {
  0%, 100% { transform: scale(0.2) rotate(0deg); opacity: 0; }
  50% { transform: scale(1) rotate(90deg); opacity: 1; }
}
@keyframes wc-wiggle {
  0%, 70%, 100% { transform: rotate(0deg); }
  76% { transform: rotate(-16deg) scale(1.12); }
  84% { transform: rotate(14deg) scale(1.12); }
  92% { transform: rotate(-7deg); }
}
 
/* ---------- hero photo: curtain wipe, settle, slow drift, scroll parallax ---------- */
.wc-img:not(.wc-in) { opacity: 0; }
@keyframes wc-img-in { from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0 0 0 0); } }
.wc-img.wc-in { animation: wc-img-in 1.3s cubic-bezier(0.22, 1, 0.36, 1) backwards; }
.wc-par { transform: translate3d(0, calc(var(--p, 0) * -26px), 0); will-change: transform; }
@keyframes wc-settle { from { scale: 1.18; } }
@keyframes wc-kb { from { scale: 1; } to { scale: 1.06; } }
.wc-in .wc-media {
  animation: wc-settle 2s cubic-bezier(0.22, 1, 0.36, 1) backwards,
             wc-kb 20s ease-in-out 2s infinite alternate;
}
.wc-sweep {
  position: absolute; top: 0; bottom: 0; left: -40%; width: 30%;
  background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.28), transparent);
  transform: skewX(-16deg);
  opacity: 0;
  pointer-events: none;
}
.wc-in .wc-sweep { animation: wc-sweep 1.8s ease-in-out 0.9s 1 both; }
@keyframes wc-sweep {
  0% { left: -40%; opacity: 0; }
  20% { opacity: 1; }
  100% { left: 120%; opacity: 0; }
}
 
/* ---------- reveal gating for text blocks ---------- */
.wc-hd:not(.wc-in) .wc-hx, .wc-st:not(.wc-in) .wc-hx { opacity: 0; }
 
.wc-ll { transform-origin: right center; }
.wc-lr { transform-origin: left center; }
.wc-in .wc-ll, .wc-in .wc-lr { animation: wc-line 0.9s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0.1s) backwards; }
 
.wc-ch, .wc-cd { display: inline-block; }
.wc-in .wc-ch { animation: wc-ch 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0s) backwards; }
.wc-in .wc-cd { animation: wc-cd 1s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0s) backwards; }
.wc-wv { display: inline-block; }
.wc-in .wc-wv { animation: wc-wave 4s ease-in-out var(--wd, 2.5s) infinite; }
.wc-hw { transform-origin: left bottom; }
.wc-in .wc-hw { animation: wc-hw 0.95s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0s) backwards; }
.wc-bw { display: inline-block; }
.wc-in .wc-bw { animation: wc-bw 0.8s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0s) backwards; }
 
.wc-underline path { stroke-dasharray: 1; stroke-dashoffset: 1; }
.wc-in .wc-underline path { animation: wc-draw 1.2s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 1s) forwards; }
.wc-spark { opacity: 0; transform-origin: center; }
.wc-in .wc-spark { animation: wc-spark 2.6s ease-in-out var(--d, 1.6s) infinite; }
 
/* ---------- stats ---------- */
@keyframes wc-stat { from { opacity: 0; transform: translateY(26px); } }
.wc-in .wc-stat { animation: wc-stat 0.9s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0s) backwards; }
@keyframes wc-div { from { opacity: 0; transform: scaleY(0); } }
.wc-in .wc-div { animation: wc-div 0.8s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0s) backwards; }
 
/* tile: spring pop + idle float use independent properties, hover uses transform */
@keyframes wc-tile-pop { from { opacity: 0; scale: 0; rotate: -90deg; } }
@keyframes wc-bob { from { translate: 0 0; } to { translate: 0 -3px; } }
.wc-in .wc-tile {
  animation: wc-tile-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--d, 0s) + 0.15s) backwards,
             wc-bob 4.5s ease-in-out calc(var(--d, 0s) + 1.2s) infinite alternate;
}
.wc-tile {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s ease,
              color 0.3s ease, box-shadow 0.3s ease;
}
.wc-stat:hover .wc-tile {
  transform: rotate(-6deg) scale(1.12);
  background-color: #8B1EB7;
  color: #fff;
  box-shadow: 0 10px 22px rgba(139, 30, 183, 0.3);
}
.wc-stat .wc-val { transition: color 0.3s ease; }
.wc-stat:hover .wc-val { color: #8B1EB7; }
 
/* per-icon micro-animations on hover */
@keyframes wc-pulse { 0%, 100% { transform: scale(1); } 40% { transform: scale(1.22); } }
@keyframes wc-swing { 0%, 100% { transform: rotate(0deg); } 30% { transform: rotate(-12deg); } 65% { transform: rotate(9deg); } }
.wc-paw-i { transform-origin: 50% 70%; }
.wc-stat:hover .wc-paw-i { animation: wc-wiggle 0.8s ease-in-out; }
.wc-stat:hover .wc-users-i { animation: wc-pulse 0.8s ease-in-out; }
.wc-award-i { transform-origin: 50% 10%; }
.wc-stat:hover .wc-award-i { animation: wc-swing 0.9s ease-in-out; }
.wc-cal-check { stroke-dasharray: 1; stroke-dashoffset: 0; }
.wc-stat:hover .wc-cal-check { animation: wc-redraw 0.6s ease; }
 
/* ---------- card ---------- */
.wc-cwrap:not(.wc-in) { opacity: 0; }
@keyframes wc-card-in { from { opacity: 0; transform: translate3d(0, 90px, 0) scale(0.95); } }
.wc-cwrap.wc-in { animation: wc-card-in 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.1s backwards; }
.wc-card {
  transform: perspective(1200px) rotateX(calc(var(--rx, 0) * 1deg)) rotateY(calc(var(--ry, 0) * 1deg)) translateY(var(--lift, 0px));
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease;
  will-change: transform;
}
.wc-cwrap:hover .wc-card { --lift: -6px; box-shadow: 0 28px 64px rgba(58, 0, 78, 0.18); }
.wc-cspot {
  opacity: 0;
  background: radial-gradient(circle at var(--sx, 50%) var(--sy, 50%), rgba(190, 120, 230, 0.16), rgba(190, 120, 230, 0) 55%);
  transition: opacity 0.5s ease;
  pointer-events: none;
}
.wc-cwrap:hover .wc-cspot { opacity: 1; }
 
@keyframes wc-pawpop { from { scale: 0; rotate: -160deg; opacity: 0; } }
.wc-in .wc-pawc { animation: wc-pawpop 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s backwards; }
.wc-wiggle { transform-origin: 50% 70%; animation: wc-wiggle 4.5s ease-in-out 2.4s infinite; }
 
/* features: slide in, check draws itself, hover re-draws it */
@keyframes wc-feat { from { opacity: 0; transform: translateX(-24px); } }
.wc-in .wc-feat { animation: wc-feat 0.8s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0s) backwards; }
.wc-feat { transition: background-color 0.3s ease; }
.wc-fcirc {
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s ease, color 0.3s ease;
}
.wc-feat:hover .wc-fcirc { transform: scale(1.14); background-color: #8B1EB7; color: #fff; }
.wc-fcheck path { stroke-dasharray: 1; stroke-dashoffset: 0; }
.wc-in .wc-fcheck path { animation: wc-draw 0.6s ease calc(var(--d, 0s) + 0.35s) backwards; }
.wc-feat:hover .wc-fcheck path { animation: wc-redraw 0.5s ease; }
.wc-ftext { transition: color 0.3s ease; }
.wc-feat:hover .wc-ftext { color: #8B1EB7; }
 
@media (prefers-reduced-motion: reduce) {
  .wc-img.wc-in, .wc-in .wc-media, .wc-in .wc-sweep, .wc-in .wc-ll, .wc-in .wc-lr,
  .wc-in .wc-ch, .wc-in .wc-cd, .wc-in .wc-wv, .wc-in .wc-hw, .wc-in .wc-bw,
  .wc-in .wc-spark, .wc-in .wc-stat, .wc-in .wc-div, .wc-in .wc-tile, .wc-cwrap.wc-in,
  .wc-in .wc-pawc, .wc-wiggle, .wc-in .wc-feat, .wc-stat:hover .wc-paw-i,
  .wc-stat:hover .wc-users-i, .wc-stat:hover .wc-award-i {
    animation: none !important;
  }
  .wc-in .wc-underline path, .wc-in .wc-fcheck path { animation: none !important; stroke-dashoffset: 0; }
  .wc-underline path { stroke-dashoffset: 0; }
  .wc-card, .wc-tile, .wc-fcirc { transition: none !important; }
}
`;
 
function PawSvg({
  fill = "#8B1EB7",
  className = "",
  size = 20,
}: {
  fill?: string;
  className?: string;
  size?: number | string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      fill="none"
      className={className}
    >
      <g fill={fill}>
        <ellipse cx="60" cy="92" rx="15" ry="20" transform="rotate(-22 60 92)" />
        <ellipse cx="82" cy="54" rx="15.5" ry="22" transform="rotate(-12 82 54)" />
        <ellipse cx="121" cy="46" rx="15" ry="22" transform="rotate(2 121 46)" />
        <ellipse cx="155" cy="72" rx="15" ry="21.5" transform="rotate(8 155 72)" />
        <path d="M111 82 C127 81 137 92 147 104 C158 117 161 133 148 141 C138 147 128 141 117 144 C106 147 97 157 84 154 C71 151 70 135 76 121 C82 106 93 83 111 82 Z" />
      </g>
    </svg>
  );
}
 
function SparkleSvg({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="#C77DEB" aria-hidden>
      <path d="M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z" />
    </svg>
  );
}
 
function UsersIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
 
function CalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path className="wc-cal-check" d="m9 16 2 2 4-4" pathLength={1} />
    </svg>
  );
}
 
function AwardIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="8" r="6" />
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
    </svg>
  );
}
 
function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 6 9 17l-5-5" pathLength={1} />
    </svg>
  );
}
 
/** Fires once when the element scrolls into view. */
function useInView<T extends HTMLElement>(threshold = 0.2, rootMargin = "0px 0px -8% 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
 
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);
 
  return [ref, inView] as const;
}
 
/**
 * Counts up to the value ("5,000+", "99%", "10+") once active.
 * An invisible copy of the final text reserves the width, so nothing shifts while counting.
 */
function CountUp({ value, active, delay = 0.5 }: { value: string; active: boolean; delay?: number }) {
  const m = value.match(/^(\D*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  const prefix = m ? m[1] : "";
  const numStr = m ? m[2] : "0";
  const suffix = m ? m[3] : "";
  const target = parseFloat(numStr.replace(/,/g, ""));
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  const useComma = numStr.includes(",");
 
  const [n, setN] = useState(0);
 
  useEffect(() => {
    if (!m || !active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target);
      return;
    }
    let raf = 0;
    const timer = setTimeout(() => {
      const t0 = performance.now();
      const dur = 1800;
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        setN(target * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay * 1000);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, target, delay]);
 
  if (!m) return <>{value}</>;
 
  const fmt = (x: number) =>
    useComma
      ? x.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : x.toFixed(decimals);
 
  return (
    <span className="relative inline-block tabular-nums" aria-label={value}>
      <span aria-hidden className="invisible whitespace-nowrap">
        {value}
      </span>
      <span aria-hidden className="absolute inset-0 whitespace-nowrap text-center">
        {prefix}
        {fmt(n)}
        {suffix}
      </span>
    </span>
  );
}
 
const words = (text: string) => text.trim().split(/\s+/).filter(Boolean);
const d = (s: number) => ({ "--d": `${s}s` } as React.CSSProperties);
 
/** letters (words stay unbroken): kind "ch" rises, "cd" drops in; wave adds the travelling colour light */
function renderChars(text: string, kind: "ch" | "cd", base: number, step: number, wave = false) {
  const ws = words(text);
  let ci = 0;
  return ws.map((w, wi) => (
    <React.Fragment key={wi}>
      <span className="inline-block whitespace-nowrap">
        {Array.from(w).map((ch) => {
          const i = ci++;
          return (
            <span key={i} className={`wc-hx wc-${kind}`} style={d(base + i * step)}>
              {wave ? (
                <span
                  className="wc-wv"
                  style={{ "--wd": `${2.6 + i * 0.09}s` } as React.CSSProperties}
                >
                  {ch}
                </span>
              ) : (
                ch
              )}
            </span>
          );
        })}
      </span>
      {wi < ws.length - 1 ? " " : ""}
    </React.Fragment>
  ));
}
 
/** words rise through a mask (no clipping of descenders) */
function renderMaskWords(text: string, base: number, step: number) {
  return words(text).map((w, i) => (
    <React.Fragment key={i}>
      <span className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]">
        <span className="wc-hx wc-hw inline-block" style={d(base + i * step)}>
          {w}
        </span>
      </span>{" "}
    </React.Fragment>
  ));
}
 
/** words blur in one after another */
function renderBlurWords(text: string, base: number, step: number) {
  const ws = words(text);
  return ws.map((w, i) => (
    <React.Fragment key={i}>
      <span className="wc-hx wc-bw" style={d(base + i * step)}>
        {w}
      </span>
      {i < ws.length - 1 ? " " : ""}
    </React.Fragment>
  ));
}
 
function StatIcon({ icon }: { icon: StatType["icon"] }) {
  return (
    <>
      {icon === "paw" && (
        <span className="wc-paw-i inline-flex">
          <PawSvg size={26} fill="currentColor" />
        </span>
      )}
      {icon === "users" && (
        <span className="wc-users-i inline-flex">
          <UsersIcon className="w-6 h-6 text-current" />
        </span>
      )}
      {icon === "calendar" && <CalendarIcon className="w-6 h-6 text-current" />}
      {icon === "award" && (
        <span className="wc-award-i inline-flex">
          <AwardIcon className="w-6 h-6 text-current" />
        </span>
      )}
    </>
  );
}
 
export default function WhyChooseUs({ data: customData }: WhyChooseUsProps) {
  const sectionData =
    customData ||
    (contentData.PawJoy.sections.WhyChooseUs.variants.PawJoyWhyChooseUs1 as WhyChooseUsData);
 
  const { achievements, card } = sectionData;
 
  const [secRef] = useInView<HTMLElement>(0.05, "0px");
  const [imgRef, imgIn] = useInView<HTMLDivElement>(0.1, "0px");
  const [hdRef, hdIn] = useInView<HTMLDivElement>(0.3);
  const [stRef, stIn] = useInView<HTMLDivElement>(0.3);
  const [cardRef, cardIn] = useInView<HTMLDivElement>(0.15, "0px 0px -6% 0px");
 
  // scroll-linked parallax for the hero photo: writes --p (-1..1) on the section
  useEffect(() => {
    const el = secRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
 
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = r.top + r.height / 2;
      const p = Math.max(-1, Math.min(1, (center - vh / 2) / (vh / 2 + r.height / 2)));
      el.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
 
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [secRef]);
 
  // pointer variables are written on the stationary wrapper, never on the tilted card
  const onCardMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", String((0.5 - y) * 4));
    el.style.setProperty("--ry", String((x - 0.5) * 5));
    el.style.setProperty("--sx", `${x * 100}%`);
    el.style.setProperty("--sy", `${y * 100}%`);
  };
 
  const onCardLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0");
    el.style.setProperty("--ry", "0");
    el.style.setProperty("--sx", "50%");
    el.style.setProperty("--sy", "50%");
  };
 
  // card heading timing
  const headPart1Words = words(card.headingPart1).length;
  const headPrefixWords = words(card.headingPart2Prefix).length;
  const highlightChars = Array.from(card.headingHighlight.trim());
  const hlStart = 0.55 + (headPart1Words + headPrefixWords) * 0.09 + 0.05;
  const underlineDelay = hlStart + highlightChars.length * 0.04 + 0.35;
  const featBase = underlineDelay + 0.5;
 
  const statCount = achievements.stats.length;
 
  return (
    <section
      ref={secRef}
      id="why-choose-us"
      className="relative w-full bg-white pb-12 sm:pb-14 lg:pb-16 overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: WC_CSS }} />
 
      {/* full-width photo */}
      <div
        ref={imgRef}
        className={`wc-img relative w-full h-[300px] sm:h-[400px] lg:h-[460px] xl:h-[480px] overflow-hidden bg-purple-50 ${
          imgIn ? "wc-in" : ""
        }`}
      >
        <div className="wc-par absolute inset-x-0 -top-[8%] -bottom-[8%]">
          <div className="wc-media absolute inset-0">
            <Image
              src={sectionData.image.src}
              alt={sectionData.image.alt}
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
        <div className="wc-sweep" />
      </div>
 
      <div className="relative max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-[4.8%]">
        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-8 lg:gap-7 items-start -mt-6 sm:-mt-10 lg:-mt-[147px]">
          {/* ---------- left: achievements ---------- */}
          <div className="flex flex-col items-stretch pt-12 sm:pt-14 lg:pt-[222px] lg:pr-4">
            <div ref={hdRef} className={`wc-hd flex flex-col items-center text-center ${hdIn ? "wc-in" : ""}`}>
              <div className="flex items-center justify-center gap-4 sm:gap-5 mb-3">
                <span className="wc-hx wc-ll w-10 sm:w-[58px] h-[2px] bg-[#8B1EB7] rounded-full" />
                <h2
                  className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#2E004F] tracking-tight leading-tight"
                  style={{ "--wb": "#2E004F", "--wp": "#a93bd8" } as React.CSSProperties}
                >
                  <span className="sr-only">{achievements.tagline}</span>
                  <span aria-hidden="true">{renderChars(achievements.tagline, "ch", 0.25, 0.04, true)}</span>
                </h2>
                <span className="wc-hx wc-lr w-10 sm:w-[58px] h-[2px] bg-[#8B1EB7] rounded-full" />
              </div>
 
              <p className="text-[#4A2E5B] text-sm sm:text-base lg:text-[16.5px] font-medium leading-relaxed text-center max-w-[540px] mx-auto mb-8 sm:mb-9">
                {renderBlurWords(achievements.description, 0.7, 0.03)}
              </p>
            </div>
 
            <div
              ref={stRef}
              className={`wc-st grid grid-cols-2 gap-x-4 gap-y-8 sm:flex sm:items-center sm:justify-between sm:gap-1 w-full max-w-[720px] mx-auto ${
                stIn ? "wc-in" : ""
              }`}
            >
              {achievements.stats.map((stat, idx) => {
                const isLast = idx === statCount - 1;
                const base = 0.15 + idx * 0.14;
 
                return (
                  <React.Fragment key={idx}>
                    <div
                      className="wc-hx wc-stat sm:flex-1 min-w-0 flex flex-col items-center text-center cursor-default"
                      style={d(base)}
                    >
                      <div className="wc-tile w-[54px] h-[54px] rounded-[14px] bg-[#F2E6FA] text-[#6B0F96] flex items-center justify-center mb-2.5">
                        <StatIcon icon={stat.icon} />
                      </div>
 
                      <div className="wc-val text-[26px] sm:text-[28px] lg:text-[30px] font-extrabold text-[#2E004F] tracking-tight leading-tight">
                        <CountUp value={stat.value} active={stIn} delay={base + 0.35} />
                      </div>
 
                      <div className="text-[13px] sm:text-[14px] lg:text-[16.5px] font-medium text-[#3D2A4A] tracking-normal mt-1">
                        {stat.label}
                      </div>
                    </div>
 
                    {!isLast && (
                      <div
                        className="wc-hx wc-div hidden sm:block h-16 w-[1.5px] bg-[#E3D3F0] mx-1 self-center origin-center"
                        style={d(base + 0.2)}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
 
          {/* ---------- right: why choose us card ---------- */}
          <div>
            <div
              ref={cardRef}
              onPointerMove={onCardMove}
              onPointerLeave={onCardLeave}
              className={`wc-cwrap ${cardIn ? "wc-in" : ""}`}
            >
              <div className="wc-card relative overflow-hidden bg-white rounded-[32px] sm:rounded-[40px] px-6 sm:px-8 pt-10 pb-10 lg:pt-[84px] lg:pb-[88px] shadow-[0_20px_60px_rgba(58,0,78,0.12)] border border-purple-100/70">
                <div className="wc-cspot absolute inset-0" />
 
                <div className="relative z-10">
                  {/* tagline */}
                  <div className="flex items-center gap-3 mb-4 sm:mb-5">
                    <span className="wc-pawc inline-flex">
                      <PawSvg size={28} fill="#5B0F82" className="wc-wiggle" />
                    </span>
                    <span
                      aria-label={card.tagline}
                      className="text-sm sm:text-[15px] lg:text-[17px] font-bold text-[#2E004F] tracking-[0.08em] uppercase"
                    >
                      <span aria-hidden="true">{renderChars(card.tagline, "ch", 0.55, 0.035)}</span>
                    </span>
                    <span className="wc-lr h-[2px] w-20 sm:w-[110px] bg-[#8B1EB7] rounded-full ml-1" style={d(0.9)} />
                  </div>
 
                  {/* heading */}
                  <h2
                    className="text-[26px] sm:text-[32px] lg:text-[36px] xl:text-[38px] font-extrabold text-[#2E004F] tracking-tight leading-[1.2] mb-3 sm:mb-4"
                    style={{ "--wb": "#8B1EB7", "--wp": "#d58cff" } as React.CSSProperties}
                  >
                    <span className="sr-only">
                      {card.headingPart1} {card.headingPart2Prefix}
                      {card.headingHighlight}
                    </span>
                    <span aria-hidden="true">
                      {renderMaskWords(card.headingPart1, 0.55, 0.09)}
                      <br />
                      {renderMaskWords(card.headingPart2Prefix, 0.55 + headPart1Words * 0.09, 0.09)}
                      <span className="relative inline-block text-[#8B1EB7]">
                        {highlightChars.map((ch, i) =>
                          ch === " " ? (
                            " "
                          ) : (
                            <span key={i} className="wc-cd" style={d(hlStart + i * 0.04)}>
                              <span
                                className="wc-wv"
                                style={{ "--wd": `${2.8 + i * 0.09}s` } as React.CSSProperties}
                              >
                                {ch}
                              </span>
                            </span>
                          )
                        )}
 
                        <svg
                          viewBox="0 0 300 14"
                          preserveAspectRatio="none"
                          aria-hidden
                          className="wc-underline pointer-events-none absolute left-[2%] -bottom-1 sm:-bottom-2 h-2 sm:h-3 w-[96%]"
                          style={d(underlineDelay)}
                        >
                          <path
                            d="M3 9 C 60 2, 120 14, 180 6 S 270 4, 297 8"
                            pathLength={1}
                            fill="none"
                            stroke="#CF8CEB"
                            strokeWidth="5"
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                          />
                        </svg>
 
                        <SparkleSvg
                          className="wc-spark pointer-events-none absolute -top-1 -right-3 sm:-top-2 sm:-right-5 h-4 w-4 sm:h-6 sm:w-6"
                          style={d(underlineDelay + 0.2)}
                        />
                      </span>
                    </span>
                  </h2>
 
                  <p className="text-[15px] sm:text-[16.5px] lg:text-[17px] xl:text-[18px] text-[#45344F] font-medium leading-[1.55] mb-7 sm:mb-8">
                    {renderBlurWords(card.description, 0.95, 0.025)}
                  </p>
 
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 sm:gap-y-4">
                    {card.features.map((feat, i) => (
                      <div
                        key={feat.id}
                        className="wc-feat flex items-center gap-3 p-2 -m-2 rounded-xl hover:bg-purple-50/70 cursor-default"
                        style={d(featBase + i * 0.12)}
                      >
                        <span className="wc-fcirc w-7 h-7 rounded-full bg-[#EFE0F8] text-[#8B1EB7] flex items-center justify-center shrink-0">
                          <CheckIcon className="wc-fcheck w-4 h-4 text-current" />
                        </span>
                        <span className="wc-ftext text-[14.5px] sm:text-[15px] lg:text-[16.5px] font-semibold text-[#2E004F] tracking-tight leading-snug">
                          {feat.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
 