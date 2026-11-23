"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import contentData from "@/data/content.json";
import { TestimonialData } from "@/data/type";

interface TestimonialProps {
  data?: TestimonialData;
}

type ReviewType = TestimonialData["reviews"][number];

const SLIDE_MS = 650;
const AUTOPLAY_MS = 6000;
const PAUSE_AFTER_USER_MS = 9000;

const TM_CSS = `
@keyframes tm-line { from { opacity: 0; transform: scaleX(0); } }
@keyframes tm-pill { from { opacity: 0; transform: translateY(14px) scale(0.6); } }
@keyframes tm-ch { from { opacity: 0; transform: translateY(0.6em) rotate(8deg) scale(0.7); filter: blur(6px); } }
@keyframes tm-cd { from { opacity: 0; transform: translateY(-0.7em) rotate(-8deg) scale(1.5); filter: blur(8px); } }
@keyframes tm-hw { from { opacity: 0; transform: translateY(115%) rotate(5deg); } }
@keyframes tm-bw { from { opacity: 0; filter: blur(8px); transform: translateY(10px); } }
@keyframes tm-wave {
  0%, 60%, 100% { color: var(--wb, #9014B7); text-shadow: 0 0 0 rgba(207, 140, 235, 0); }
  30% { color: var(--wp, #d58cff); text-shadow: 0 0 20px rgba(207, 140, 235, 0.5); }
}
@keyframes tm-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes tm-spark {
  0%, 100% { transform: scale(0.2) rotate(0deg); opacity: 0; }
  50% { transform: scale(1) rotate(90deg); opacity: 1; }
}
@keyframes tm-wiggle {
  0%, 70%, 100% { transform: rotate(0deg); }
  76% { transform: rotate(-16deg) scale(1.12); }
  84% { transform: rotate(14deg) scale(1.12); }
  92% { transform: rotate(-7deg); }
}
@keyframes tm-sheen {
  0% { transform: translateX(-160%) skewX(-20deg); }
  22%, 100% { transform: translateX(380%) skewX(-20deg); }
}

.tm-hd:not(.tm-in) .tm-hx { opacity: 0; }
.tm-ll { transform-origin: right center; }
.tm-lr { transform-origin: left center; }
.tm-in .tm-ll, .tm-in .tm-lr { animation: tm-line 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s backwards; }
.tm-in .tm-pill { animation: tm-pill 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards; }
.tm-ch, .tm-cd { display: inline-block; }
.tm-in .tm-ch { animation: tm-ch 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0s) backwards; }
.tm-in .tm-cd { animation: tm-cd 1s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0s) backwards; }
.tm-wv { display: inline-block; }
.tm-in .tm-wv { animation: tm-wave 4s ease-in-out var(--wd, 2.5s) infinite; }
.tm-hw { transform-origin: left bottom; }
.tm-in .tm-hw { animation: tm-hw 0.95s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0s) backwards; }
.tm-bw { display: inline-block; }
.tm-in .tm-bw { animation: tm-bw 0.8s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0s) backwards; }
.tm-underline path { stroke-dasharray: 1; stroke-dashoffset: 1; }
.tm-in .tm-underline path { animation: tm-draw 1.2s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 1s) forwards; }
.tm-spark { opacity: 0; transform-origin: center; }
.tm-in .tm-spark { animation: tm-spark 2.6s ease-in-out var(--d, 1.6s) infinite; }
.tm-wiggle { transform-origin: 50% 70%; animation: tm-wiggle 4.5s ease-in-out 2.4s infinite; }
.tm-pill-sheen {
  position: absolute; top: 0; bottom: 0; left: 0; width: 35%;
  background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transform: translateX(-160%) skewX(-20deg);
  animation: tm-sheen 6s ease-in-out 2.5s infinite;
}

.tm-par {
  transform: translate3d(calc(var(--mx, 0) * var(--k, 0) * 1px), calc(var(--my, 0) * var(--k, 0) * 1px), 0);
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes tm-paw-in { from { scale: 0; opacity: 0; } }
.tm-sec:not(.tm-sec-in) .tm-paw-in { opacity: 0; }
.tm-sec-in .tm-paw-in { animation: tm-paw-in 1.1s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0.4s) backwards; }
@keyframes tm-float { from { translate: 0 0; } to { translate: 0 -10px; } }
.tm-floaty { animation: tm-float 6s ease-in-out infinite alternate; }
@keyframes tm-wave-in { from { translate: 0 100%; } }
@keyframes tm-wave-sway { from { scale: 1 1; } to { scale: 1 1.07; } }
.tm-wavesvg { transform-origin: bottom; }
.tm-sec-in .tm-wavesvg {
  animation: tm-wave-in 1.3s cubic-bezier(0.22, 1, 0.36, 1) backwards,
             tm-wave-sway 7s ease-in-out 1.3s infinite alternate;
}

.tm-img:not(.tm-in) { opacity: 0; }
@keyframes tm-img-in { from { opacity: 0; transform: translate3d(-60px, 30px, 0) scale(0.9); } }
.tm-img.tm-in { animation: tm-img-in 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s backwards; }
@keyframes tm-bob { from { translate: 0 0; } to { translate: 0 -8px; } }
.tm-in .tm-bobber { animation: tm-bob 5s ease-in-out 1.4s infinite alternate; }
@keyframes tm-glow { from { opacity: 0.7; scale: 1; } to { opacity: 1; scale: 1.08; } }
.tm-glow { animation: tm-glow 4s ease-in-out infinite alternate; }

.tm-view {
  overflow-x: clip;
  overflow-y: visible;
  padding-block: 18px;
  margin-block: -18px;
  touch-action: pan-y pinch-zoom;
}
@supports not (overflow: clip) { .tm-view { overflow: hidden; } }
.tm-track {
  --v: 1;
  --g: 16px;
  display: flex;
  gap: var(--g);
  transform: translate3d(calc(var(--pos, 0) * -1 * ((100% - (var(--v) - 1) * var(--g)) / var(--v) + var(--g))), 0, 0);
  transition: transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}
@media (min-width: 768px) { .tm-track { --v: 2; --g: 20px; } }
@media (min-width: 1024px) { .tm-track { --v: 3; --g: 14px; } }
.tm-track.tm-instant { transition: none !important; }

.tm-cwrap {
  flex: 0 0 calc((100% - (var(--v) - 1) * var(--g)) / var(--v));
  min-width: 0;
  display: flex;
}
.tm-view:not(.tm-in) .tm-cwrap { opacity: 0; }
@keyframes tm-rise { from { opacity: 0; transform: translate3d(0, 50px, 0) scale(0.95); } }
.tm-view.tm-in .tm-cwrap { animation: tm-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) var(--cd, 0s) backwards; }

.tm-card { transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease; }
.tm-cwrap:hover .tm-card { transform: translateY(-5px); box-shadow: 0 14px 32px rgba(64, 0, 85, 0.15); }
.tm-spot {
  opacity: 0;
  background: radial-gradient(circle at var(--sx, 50%) var(--sy, 50%), rgba(190, 120, 230, 0.16), rgba(190, 120, 230, 0) 55%);
  transition: opacity 0.5s ease;
  pointer-events: none;
}
.tm-cwrap:hover .tm-spot { opacity: 1; }

.tm-view.tm-in .tm-bw { animation: tm-bw 0.8s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--cd, 0s) + var(--d, 0s)) backwards; }
.tm-view.tm-in .tm-nc { animation: tm-ch 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--cd, 0s) + var(--d, 0s)) backwards; }
@keyframes tm-star-in { from { scale: 0; rotate: -120deg; opacity: 0; } }
@keyframes tm-star-hop { 0%, 100% { scale: 1; rotate: 0deg; } 40% { scale: 1.4; rotate: 12deg; } }
.tm-view.tm-in .tm-star { animation: tm-star-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--cd, 0s) + var(--sd, 0.3s)) backwards; }
.tm-cwrap:hover .tm-star { animation: tm-star-hop 0.6s ease var(--hd, 0s) 1; }
@keyframes tm-qm-in { from { scale: 0; rotate: -90deg; opacity: 0; } }
.tm-qm { display: inline-block; transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); }
.tm-view.tm-in .tm-qmwrap { animation: tm-qm-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--cd, 0s) + 0.2s) backwards; }
.tm-cwrap:hover .tm-qm { transform: scale(1.18) rotate(-8deg); }
.tm-div { transform-origin: left center; }
.tm-view.tm-in .tm-div { animation: tm-line 0.9s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--cd, 0s) + 0.5s) backwards; }
@keyframes tm-av-in { from { scale: 0; opacity: 0; } }
.tm-view.tm-in .tm-avwrap { animation: tm-av-in 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--cd, 0s) + 0.6s) backwards; }
.tm-av { transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
.tm-cwrap:hover .tm-av { transform: scale(1.06); }
.tm-ring {
  opacity: 0;
  transform: scale(0.85);
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}
.tm-cwrap:hover .tm-ring { opacity: 1; transform: scale(1); }

.tm-ct:not(.tm-in) .tm-hx { opacity: 0; }
@keyframes tm-from-l { from { opacity: 0; transform: translate3d(-40px, 0, 0) rotate(-120deg) scale(0.5); } }
@keyframes tm-from-r { from { opacity: 0; transform: translate3d(40px, 0, 0) rotate(120deg) scale(0.5); } }
.tm-in .tm-al { animation: tm-from-l 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s backwards; }
.tm-in .tm-ar { animation: tm-from-r 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s backwards; }
@keyframes tm-nudge-l { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-3px); } }
@keyframes tm-nudge-r { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(3px); } }
.tm-arrow:hover .tm-chev-l { animation: tm-nudge-l 0.7s ease-in-out infinite; }
.tm-arrow:hover .tm-chev-r { animation: tm-nudge-r 0.7s ease-in-out infinite; }
@keyframes tm-pop { from { opacity: 0; transform: scale(0); } }
.tm-in .tm-dot { animation: tm-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0s) backwards; }
@keyframes tm-ping { from { opacity: 0.5; transform: scale(1); } to { opacity: 0; transform: scale(2.4); } }
.tm-ping { animation: tm-ping 0.8s cubic-bezier(0, 0, 0.2, 1) forwards; }

@media (prefers-reduced-motion: reduce) {
  .tm-in .tm-ll, .tm-in .tm-lr, .tm-in .tm-pill, .tm-in .tm-ch, .tm-in .tm-cd, .tm-in .tm-wv,
  .tm-in .tm-hw, .tm-in .tm-bw, .tm-in .tm-spark, .tm-wiggle, .tm-pill-sheen,
  .tm-sec-in .tm-paw-in, .tm-floaty, .tm-sec-in .tm-wavesvg, .tm-img.tm-in, .tm-in .tm-bobber,
  .tm-glow, .tm-view.tm-in .tm-cwrap, .tm-view.tm-in .tm-bw, .tm-view.tm-in .tm-nc,
  .tm-view.tm-in .tm-star, .tm-cwrap:hover .tm-star, .tm-view.tm-in .tm-qmwrap,
  .tm-view.tm-in .tm-div, .tm-view.tm-in .tm-avwrap, .tm-in .tm-al, .tm-in .tm-ar,
  .tm-in .tm-dot, .tm-arrow:hover .tm-chev-l, .tm-arrow:hover .tm-chev-r {
    animation: none !important;
  }
  .tm-in .tm-underline path { animation: none !important; stroke-dashoffset: 0; }
  .tm-underline path { stroke-dashoffset: 0; }
  .tm-track, .tm-card, .tm-par, .tm-qm, .tm-av, .tm-ring { transition: none !important; }
}
`;

function PawSvg({
  fill = "#DFCCF0",
  className = "",
  size = 200,
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

function StarIcon({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ChevronIcon({ dir, className = "" }: { dir: "l" | "r"; className?: string }) {
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
      <polyline points={dir === "l" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );
}

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

const words = (text: string) => text.trim().split(/\s+/).filter(Boolean);
const dv = (s: number) => ({ "--d": `${s}s` } as React.CSSProperties);

function renderChars(
  text: string,
  cls: string,
  base: number,
  step: number,
  wave = false,
  hx = true
) {
  const ws = words(text);
  let ci = 0;
  return ws.map((w, wi) => (
    <React.Fragment key={wi}>
      <span className="inline-block whitespace-nowrap">
        {Array.from(w).map((ch) => {
          const i = ci++;
          return (
            <span key={i} className={`${hx ? "tm-hx " : ""}${cls}`} style={dv(base + i * step)}>
              {wave ? (
                <span className="tm-wv" style={{ "--wd": `${2.6 + i * 0.09}s` } as React.CSSProperties}>
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

function renderMaskWords(text: string, base: number, step: number) {
  return words(text).map((w, i) => (
    <React.Fragment key={i}>
      <span className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]">
        <span className="tm-hx tm-hw inline-block" style={dv(base + i * step)}>
          {w}
        </span>
      </span>{" "}
    </React.Fragment>
  ));
}

function renderBlurWords(text: string, base: number, step: number, hx = true) {
  const ws = words(text);
  return ws.map((w, i) => (
    <React.Fragment key={i}>
      <span className={`${hx ? "tm-hx " : ""}tm-bw`} style={dv(base + i * step)}>
        {w}
      </span>
      {i < ws.length - 1 ? " " : ""}
    </React.Fragment>
  ));
}

export default function Testimonial({ data: customData }: TestimonialProps) {
  const testimonialData =
    customData ||
    (contentData.PawJoy.sections.Testimonial.variants
      .PawJoyTestimonial1 as TestimonialData);

  const reviews = testimonialData.reviews;
  const n = reviews.length;
  const loop = n > 1;
  const copies = loop ? 4 : 1;

  const [pos, setPos] = useState<number>(loop ? n : 0);
  const [instant, setInstant] = useState(false);
  const posRef = useRef<number>(loop ? n : 0);
  const busyRef = useRef(false);
  const slideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverRef = useRef(false);
  const visibleRef = useRef(false);
  const resumeAtRef = useRef(0);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);

  const activeIndex = loop ? ((pos % n) + n) % n : 0;

  const settle = useCallback(() => {
    if (!loop) {
      busyRef.current = false;
      return;
    }
    const p = posRef.current;
    const norm = n + (((p % n) + n) % n);
    if (norm !== p) {
      setInstant(true);
      posRef.current = norm;
      setPos(norm);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setInstant(false);
          busyRef.current = false;
        })
      );
    } else {
      busyRef.current = false;
    }
  }, [loop, n]);

  const moveTo = useCallback(
    (target: number) => {
      if (!loop || busyRef.current) return;
      busyRef.current = true;
      posRef.current = target;
      setPos(target);
      if (slideTimer.current) clearTimeout(slideTimer.current);
      slideTimer.current = setTimeout(settle, SLIDE_MS + 40);
    },
    [loop, settle]
  );

  const go = useCallback(
    (dir: 1 | -1, fromUser = false) => {
      if (fromUser) resumeAtRef.current = Date.now() + PAUSE_AFTER_USER_MS;
      moveTo(posRef.current + dir);
    },
    [moveTo]
  );

  const jumpTo = (j: number) => {
    resumeAtRef.current = Date.now() + PAUSE_AFTER_USER_MS;
    const idx = ((posRef.current % n) + n) % n;
    let diff = j - idx;
    if (diff > n / 2) diff -= n;
    if (diff < -n / 2) diff += n;
    if (diff !== 0) moveTo(posRef.current + diff);
  };

  useEffect(() => {
    return () => {
      if (slideTimer.current) clearTimeout(slideTimer.current);
    };
  }, []);

  const [secRef, secIn] = useInView<HTMLElement>(0.05, "0px");
  const [hdRef, hdIn] = useInView<HTMLDivElement>(0.3);
  const [imgRef, imgIn] = useInView<HTMLDivElement>(0.2);
  const [vwRef, vwIn] = useInView<HTMLDivElement>(0.15, "0px 0px -6% 0px");
  const [ctRef, ctIn] = useInView<HTMLDivElement>(0.4, "0px");

  useEffect(() => {
    const el = vwRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      visibleRef.current = e.isIntersecting;
    });
    io.observe(el);
    return () => io.disconnect();
  }, [vwRef]);

  useEffect(() => {
    if (!loop) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (hoverRef.current || document.hidden || !visibleRef.current) return;
      if (Date.now() < resumeAtRef.current) return;
      go(1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [loop, go]);

  const onSecMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", String(((e.clientX - r.left) / r.width - 0.5) * 2));
    el.style.setProperty("--my", String(((e.clientY - r.top) / r.height - 0.5) * 2));
  };
  const onSecLeave = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--mx", "0");
    e.currentTarget.style.setProperty("--my", "0");
  };

  const onCardMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--sy", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const onViewDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") return;
    hoverRef.current = true;
    swipeRef.current = { x: e.clientX, y: e.clientY };
  };
  const onViewUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") return;
    hoverRef.current = false;
    const s = swipeRef.current;
    swipeRef.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) go(dx < 0 ? 1 : -1, true);
  };
  const onViewKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1, true);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1, true);
    }
  };

  const part1 = words(testimonialData.headingPart1);
  const highlightChars = Array.from(testimonialData.headingHighlight.trim());
  const hlStart = 0.25 + part1.length * 0.09 + 0.1;
  const underlineDelay = hlStart + highlightChars.length * 0.045 + 0.35;

  const items: { rev: ReviewType; c: number; k: number }[] = [];
  for (let c = 0; c < copies; c++) reviews.forEach((rev, k) => items.push({ rev, c, k }));

  return (
    <section
      ref={secRef}
      id={testimonialData.id || "testimonials"}
      onPointerMove={onSecMove}
      onPointerLeave={onSecLeave}
      className={`tm-sec relative w-full overflow-hidden bg-[#FCF8FF] pt-10 sm:pt-12 lg:pt-12 pb-8 sm:pb-9 ${
        secIn ? "tm-sec-in" : ""
      }`}
    >
      <style dangerouslySetInnerHTML={{ __html: TM_CSS }} />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          style={{ "--k": -18 } as React.CSSProperties}
          className="tm-par absolute -top-40 left-[25%] w-[450px] h-[350px] rounded-full bg-[#F2E5FB]/50 blur-3xl"
        />
        <div
          style={{ "--k": 22 } as React.CSSProperties}
          className="tm-par absolute -right-20 top-12 w-[300px] h-[350px] rounded-full bg-[#EED7FA]/50 blur-3xl"
        />
        <div
          style={{ "--k": 12 } as React.CSSProperties}
          className="tm-par absolute -left-32 top-24 w-[280px] h-[400px] rounded-r-full bg-[#F1E2FA]/80"
        />
        <div
          style={{ "--k": -12 } as React.CSSProperties}
          className="tm-par absolute -right-32 bottom-[-100px] w-[350px] h-[430px] rounded-l-full bg-[#EEDBFA]/70"
        />

        {testimonialData.backgroundPaws.map((paw, idx) => (
          <div
            key={idx}
            style={
              {
                top: paw.top,
                bottom: paw.bottom,
                left: paw.left,
                right: paw.right,
                transform: `rotate(${paw.rotate}deg)`,
                opacity: paw.opacity,
                "--d": `${0.4 + idx * 0.12}s`,
              } as React.CSSProperties
            }
            className="tm-paw-in absolute pointer-events-none select-none z-0"
          >
            <div
              className="tm-par"
              style={{ "--k": ((idx % 3) + 1) * 9 * (idx % 2 ? -1 : 1) } as React.CSSProperties}
            >
              <div className="tm-floaty" style={{ animationDelay: `${-idx * 1.3}s` }}>
                <PawSvg size={paw.size} fill="#DDBCEB" />
              </div>
            </div>
          </div>
        ))}

        <svg
          className="tm-wavesvg absolute bottom-0 left-0 w-full h-[110px] sm:h-[150px] lg:h-[170px]"
          viewBox="0 0 1500 170"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <path
            d="M0 0 C150 90 230 35 350 90 C480 150 570 190 720 170 L0 170 Z"
            fill="#8200A9"
          />
          <path
            d="M1500 45 C1390 115 1340 135 1250 170 L1500 170 Z"
            fill="#A21BC5"
            opacity="0.7"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-5">
        <div
          ref={hdRef}
          className={`tm-hd flex flex-col items-center text-center mb-6 sm:mb-8 lg:mb-7 ${hdIn ? "tm-in" : ""}`}
        >
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 mb-2.5">
            <span className="tm-hx tm-ll w-7 sm:w-16 h-[2px] bg-[#8B1EB7] rounded-full" />

            <div className="tm-hx tm-pill relative overflow-hidden inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-6 py-1.5 sm:py-2 rounded-full bg-[#F0DDF9] border border-[#E8D2F3] shadow-sm">
              <PawSvg size={22} fill="#71008D" className="tm-wiggle w-[18px] h-[18px] sm:w-5 sm:h-5" />
              <span
                aria-label={testimonialData.tagline}
                className="text-[#6B007F] text-[13px] sm:text-lg font-bold tracking-tight"
              >
                <span aria-hidden="true">{renderChars(testimonialData.tagline, "tm-ch", 0.45, 0.03)}</span>
              </span>
              <span className="tm-pill-sheen pointer-events-none" />
            </div>

            <span className="tm-hx tm-lr w-7 sm:w-16 h-[2px] bg-[#8B1EB7] rounded-full" />
          </div>

          <h2
            className="text-[26px] sm:text-[36px] md:text-[40px] lg:text-[43px] font-extrabold text-[#39004D] leading-[1.15] tracking-[-0.035em] mb-2"
            style={{ "--wb": "#9014B7", "--wp": "#d58cff" } as React.CSSProperties}
          >
            <span className="sr-only">
              {testimonialData.headingPart1} {testimonialData.headingHighlight}
            </span>
            <span aria-hidden="true">
              {renderMaskWords(testimonialData.headingPart1, 0.25, 0.09)}
              <span className="relative inline-block text-[#9014B7]">
                {highlightChars.map((ch, i) =>
                  ch === " " ? (
                    " "
                  ) : (
                    <span key={i} className="tm-hx tm-cd" style={dv(hlStart + i * 0.045)}>
                      <span className="tm-wv" style={{ "--wd": `${2.8 + i * 0.09}s` } as React.CSSProperties}>
                        {ch}
                      </span>
                    </span>
                  )
                )}

                <svg
                  viewBox="0 0 300 14"
                  preserveAspectRatio="none"
                  aria-hidden
                  className="tm-underline pointer-events-none absolute left-[2%] -bottom-1 sm:-bottom-2 h-2 sm:h-3 w-[96%]"
                  style={dv(underlineDelay)}
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
                  className="tm-spark pointer-events-none absolute -top-1 -right-4 sm:-top-3 sm:-right-8 h-4 w-4 sm:h-6 sm:w-6"
                  style={dv(underlineDelay + 0.2)}
                />
              </span>
            </span>
          </h2>

          <p className="text-[#463451] text-sm sm:text-base lg:text-[18px] font-medium leading-relaxed max-w-2xl px-2">
            {renderBlurWords(testimonialData.description, 0.8, 0.025)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[26%_74%] items-end gap-6 lg:gap-0">
          <div
            ref={imgRef}
            className={`tm-img relative w-full max-w-[300px] sm:max-w-[380px] mx-auto lg:mx-0 lg:max-w-none lg:w-[calc(100%+55px)] lg:-ml-[55px] h-[230px] sm:h-[330px] lg:h-[390px] self-end ${
              imgIn ? "tm-in" : ""
            }`}
          >
            <div className="tm-glow absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-tr from-[#8500A8]/25 to-transparent rounded-full blur-3xl" />

            <div className="tm-bobber absolute inset-0">
              <Image
                src={testimonialData.sideImage.src}
                alt={testimonialData.sideImage.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 30vw"
                className="relative z-10 object-contain object-bottom transition-transform duration-700 hover:scale-[1.03]"
              />
            </div>
          </div>

          <div
            ref={vwRef}
            role="region"
            aria-roledescription="carousel"
            aria-label={testimonialData.carouselAriaLabel || "Customer reviews"}
            tabIndex={0}
            onKeyDown={onViewKey}
            onPointerDown={onViewDown}
            onPointerUp={onViewUp}
            onPointerCancel={() => {
              swipeRef.current = null;
              hoverRef.current = false;
            }}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") hoverRef.current = true;
            }}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse") hoverRef.current = false;
            }}
            onFocus={() => {
              hoverRef.current = true;
            }}
            onBlur={() => {
              hoverRef.current = false;
            }}
            className={`tm-view w-full min-w-0 rounded-[28px] outline-none focus-visible:ring-2 focus-visible:ring-[#8B1EB7]/60 ${
              vwIn ? "tm-in" : ""
            }`}
          >
            <div
              className={`tm-track ${instant ? "tm-instant" : ""}`}
              style={{ "--pos": pos } as React.CSSProperties}
            >
              {items.map(({ rev, c, k }) => {
                let nameIdx = 0;
                return (
                  <div
                    key={`${c}-${rev.id}`}
                    className="tm-cwrap"
                    style={{ "--cd": `${k * 0.12}s` } as React.CSSProperties}
                    aria-hidden={c !== 1 && loop ? true : undefined}
                    onPointerMove={onCardMove}
                  >
                    <div className="tm-card relative flex-1 flex flex-col justify-between overflow-hidden bg-white/95 border border-[#E9D7F2] rounded-[23px] sm:rounded-[27px] px-5 sm:px-6 py-5 min-h-[225px] sm:min-h-[235px] lg:min-h-[245px] shadow-[0_5px_12px_rgba(64,0,85,0.07),0_12px_25px_rgba(64,0,85,0.05)]">
                      <div className="tm-spot absolute inset-0" />

                      <div className="relative">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="tm-qmwrap flex items-center justify-center w-[48px] h-[40px] rounded-full bg-[#F8EEFC] shrink-0">
                            <span className="tm-qm text-[53px] leading-[1] font-serif font-black text-[#8613AA] mt-3">
                              “
                            </span>
                          </div>

                          <div className="flex items-center gap-[2px] text-[#F6A000]">
                            {Array.from({ length: rev.rating }).map((_, sIdx) => (
                              <StarIcon
                                key={sIdx}
                                className="tm-star w-[17px] h-[17px] sm:w-[19px] sm:h-[19px]"
                                style={
                                  {
                                    "--sd": `${0.35 + sIdx * 0.08}s`,
                                    "--hd": `${sIdx * 0.07}s`,
                                  } as React.CSSProperties
                                }
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-[#28223A] text-[14px] sm:text-[14px] xl:text-[15px] leading-[1.5] sm:leading-[1.45] font-medium">
                          {renderBlurWords(rev.quote, 0.4, 0.016, false)}
                        </p>
                      </div>

                      <div className="relative mt-4">
                        <div className="tm-div w-full h-[1.5px] bg-[#E7B6F1] mb-3" />

                        <div className="flex items-center gap-3">
                          <div className="tm-avwrap relative w-[52px] h-[52px] sm:w-[56px] sm:h-[56px] shrink-0">
                            <span className="tm-ring pointer-events-none absolute -inset-1 rounded-full border-2 border-[#C77DEB]" />
                            <div className="tm-av relative w-full h-full rounded-full overflow-hidden border-2 border-[#F0DDF9] shadow-sm">
                              <Image
                                src={rev.avatar}
                                alt={rev.name}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            </div>
                          </div>

                          <div className="min-w-0">
                            <h4
                              aria-label={rev.name}
                              className="text-[#67007D] text-[15px] sm:text-[16px] font-extrabold tracking-tight leading-tight"
                            >
                              <span aria-hidden="true">
                                {words(rev.name).map((w, wi, arr) => (
                                  <React.Fragment key={wi}>
                                    <span className="inline-block whitespace-nowrap">
                                      {Array.from(w).map((ch) => {
                                        const i = nameIdx++;
                                        return (
                                          <span
                                            key={i}
                                            className="tm-nc inline-block"
                                            style={dv(0.7 + i * 0.03)}
                                          >
                                            {ch}
                                          </span>
                                        );
                                      })}
                                    </span>
                                    {wi < arr.length - 1 ? " " : ""}
                                  </React.Fragment>
                                ))}
                              </span>
                            </h4>

                            <p className="text-[#514263] text-[11.5px] sm:text-[12px] font-medium mt-1 leading-tight">
                              {rev.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {loop && (
          <div
            ref={ctRef}
            className={`tm-ct relative z-20 flex items-center justify-center gap-3 sm:gap-5 mt-7 sm:mt-8 lg:mt-7 ${
              ctIn ? "tm-in" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => go(-1, true)}
              aria-label={testimonialData.prevButtonAriaLabel || "Previous review"}
              className="tm-hx tm-al tm-arrow shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#50006A] hover:bg-[#6B0F8C] text-white flex items-center justify-center border-[3px] border-white shadow-[0_8px_20px_rgba(58,0,78,0.3)] transition-[background-color,box-shadow,transform] duration-300 hover:scale-110 hover:shadow-[0_12px_28px_rgba(58,0,78,0.4)] active:scale-90 cursor-pointer"
            >
              <span className="tm-chev-l inline-flex">
                <ChevronIcon dir="l" className="w-5 h-5" />
              </span>
            </button>

            <div className="flex items-center justify-center gap-2.5 sm:gap-3">
              {reviews.map((rev, idx) => {
                const isActive = activeIndex === idx;

                return (
                  <button
                    key={rev.id}
                    type="button"
                    onClick={() => jumpTo(idx)}
                    aria-label={`${testimonialData.dotAriaLabelPrefix || "Go to review"} ${idx + 1}`}
                    aria-current={isActive ? "true" : undefined}
                    style={dv(0.4 + idx * 0.08)}
                    className={`tm-hx tm-dot relative rounded-full transition-all duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer ${
                      isActive
                        ? "w-[19px] h-[19px] bg-[#50006A] shadow-sm"
                        : "w-[15px] h-[15px] sm:w-[17px] sm:h-[17px] bg-[#DAB8E9] hover:bg-[#BB8DD0] hover:scale-110"
                    }`}
                  >
                    {isActive && (
                      <span
                        key={activeIndex}
                        className="tm-ping pointer-events-none absolute inset-0 rounded-full bg-[#50006A]"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => go(1, true)}
              aria-label={testimonialData.nextButtonAriaLabel || "Next review"}
              className="tm-hx tm-ar tm-arrow shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#50006A] hover:bg-[#6B0F8C] text-white flex items-center justify-center border-[3px] border-white shadow-[0_8px_20px_rgba(58,0,78,0.3)] transition-[background-color,box-shadow,transform] duration-300 hover:scale-110 hover:shadow-[0_12px_28px_rgba(58,0,78,0.4)] active:scale-90 cursor-pointer"
            >
              <span className="tm-chev-r inline-flex">
                <ChevronIcon dir="r" className="w-5 h-5" />
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
