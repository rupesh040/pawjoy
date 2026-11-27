"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import contentData from "@/data/content.json";
import { ServicesData } from "@/data/type";

interface ServicesProps {
  data?: ServicesData;
}

type CardType = ServicesData["cards"][number];

const SERVICES_CSS = `
@keyframes sv-line { from { opacity: 0; transform: scaleX(0); } }
@keyframes sv-pill { from { opacity: 0; transform: translateY(14px) scale(0.6); } }
@keyframes sv-tg { from { opacity: 0; transform: translateY(10px) rotate(6deg); } }
@keyframes sv-hw { from { opacity: 0; transform: translateY(115%) rotate(5deg); } }
@keyframes sv-hc { from { opacity: 0; transform: translateY(-0.7em) rotate(-8deg) scale(1.5); filter: blur(8px); } }
@keyframes sv-wave {
  0%, 60%, 100% { color: #8B1EB7; text-shadow: 0 0 0 rgba(207, 140, 235, 0); }
  30% { color: #cf6df5; text-shadow: 0 0 20px rgba(207, 140, 235, 0.55); }
}
@keyframes sv-draw { to { stroke-dashoffset: 0; } }
@keyframes sv-spark {
  0%, 100% { transform: scale(0.2) rotate(0deg); opacity: 0; }
  50% { transform: scale(1) rotate(90deg); opacity: 1; }
}
@keyframes sv-wipe {
  from { opacity: 0; transform: translateY(10px); clip-path: inset(-6px 100% -6px 0); }
  to { opacity: 1; transform: none; clip-path: inset(-6px -6px -6px -6px); }
}
@keyframes sv-paw-in { from { scale: 0; opacity: 0; } }
@keyframes sv-wiggle {
  0%, 70%, 100% { transform: rotate(0deg); }
  76% { transform: rotate(-16deg) scale(1.12); }
  84% { transform: rotate(14deg) scale(1.12); }
  92% { transform: rotate(-7deg); }
}
@keyframes sv-sheen-pill {
  0% { transform: translateX(-160%) skewX(-20deg); }
  22%, 100% { transform: translateX(380%) skewX(-20deg); }
}

.sv-hd:not(.sv-in) .sv-hx { opacity: 0; }
.sv-line-l { transform-origin: right center; }
.sv-line-r { transform-origin: left center; }
.sv-in .sv-line-l, .sv-in .sv-line-r { animation: sv-line 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s backwards; }
.sv-in .sv-pill { animation: sv-pill 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards; }
.sv-tg { display: inline-block; }
.sv-in .sv-tg { animation: sv-tg 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0s) backwards; }
.sv-in .sv-hw { animation: sv-hw 0.95s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0s) backwards; }
.sv-hw { transform-origin: left bottom; }
.sv-hc { display: inline-block; }
.sv-in .sv-hc { animation: sv-hc 1s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0s) backwards; }
.sv-wv { display: inline-block; }
.sv-in .sv-wv { animation: sv-wave 3.6s ease-in-out var(--wd, 3s) infinite; }
.sv-underline path { stroke-dasharray: 1; stroke-dashoffset: 1; }
.sv-in .sv-underline path { animation: sv-draw 1.2s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 1s) forwards; }
.sv-spark { opacity: 0; transform-origin: center; }
.sv-in .sv-spark { animation: sv-spark 2.6s ease-in-out var(--d, 1.6s) infinite; }
.sv-in .sv-wipe { animation: sv-wipe 1s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0s) backwards; }
.sv-wiggle { transform-origin: 50% 70%; animation: sv-wiggle 4.5s ease-in-out 2.2s infinite; }
.sv-pill-sheen {
  position: absolute; top: 0; bottom: 0; left: 0; width: 35%;
  background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transform: translateX(-160%) skewX(-20deg);
  animation: sv-sheen-pill 6s ease-in-out 2.5s infinite;
}

.sv-sec-in .sv-paw-in { animation: sv-paw-in 1.1s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0.3s) backwards; }
.sv-sec:not(.sv-sec-in) .sv-paw-in { opacity: 0; }
.sv-par { transform: translate3d(0, calc(var(--p, 0) * var(--k, 0) * 1px), 0); will-change: transform; }

.sv-wrap { --cd: 0s; }
@media (max-width: 767px) { .sv-wrap { --cd: 0s !important; } }
.sv-wrap:not(.sv-in) { opacity: 0; }
@keyframes sv-rise {
  from { opacity: 0; transform: translate3d(0, 70px, 0) rotate(var(--r, 0deg)) scale(0.92); }
}
.sv-wrap.sv-in { animation: sv-rise 1.1s cubic-bezier(0.22, 1, 0.36, 1) var(--cd, 0s) backwards; }

.sv-card {
  transform: perspective(1000px) rotateX(calc(var(--rx, 0) * 1deg)) rotateY(calc(var(--ry, 0) * 1deg)) translateY(var(--lift, 0px));
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease;
  will-change: transform;
}
.sv-wrap:hover .sv-card { --lift: -10px; box-shadow: 0 24px 48px rgba(58, 0, 78, 0.16); }

@keyframes sv-photo-in {
  from { clip-path: inset(100% 0 0 0 round 26px); }
  to { clip-path: inset(0 0 0 0 round 26px); }
}
@keyframes sv-settle { from { scale: 1.35; } }
.sv-in .sv-photo { animation: sv-photo-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--cd, 0s) + 0.25s) backwards; }
.sv-in .sv-media { animation: sv-settle 1.8s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--cd, 0s) + 0.25s) backwards; }
.sv-media {
  transform: translate3d(calc(var(--mx, 0) * -8px), calc(var(--my, 0) * -8px), 0) scale(var(--zoom, 1.05));
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.sv-wrap:hover .sv-media { --zoom: 1.1; }
.sv-spot {
  opacity: 0;
  background: radial-gradient(circle at var(--sx, 50%) var(--sy, 50%), rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0) 55%);
  mix-blend-mode: soft-light;
  transition: opacity 0.5s ease;
  pointer-events: none;
}
.sv-wrap:hover .sv-spot { opacity: 1; }
.sv-sheen {
  position: absolute; top: 0; bottom: 0; left: -60%; width: 40%;
  background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transform: skewX(-14deg);
  opacity: 0;
  pointer-events: none;
}
.sv-wrap:hover .sv-sheen { opacity: 1; animation: sv-sheen 1s ease-out; }
@keyframes sv-sheen { from { left: -60%; } to { left: 140%; } }

@keyframes sv-badge { from { opacity: 0; transform: scale(0) rotate(-120deg); } }
.sv-in .sv-badge { animation: sv-badge 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--cd, 0s) + 0.7s) backwards; }
.sv-badge-circle { transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); }
.sv-wrap:hover .sv-badge-circle { transform: scale(1.1) rotate(6deg); }
@keyframes sv-ring { 0% { transform: scale(1); opacity: 0.4; } 70%, 100% { transform: scale(1.55); opacity: 0; } }
.sv-ring { opacity: 0; }
.sv-in .sv-ring { animation: sv-ring 2.8s ease-out calc(var(--cd, 0s) + 1.8s) infinite; }

.sv-bubble { transform-box: fill-box; transform-origin: center; }
@keyframes sv-bubble {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-2.5px) scale(1.25); }
}
.sv-wrap:hover .sv-bubble { animation: sv-bubble 1.2s ease-in-out calc(var(--i, 0) * 0.15s) infinite; }
@keyframes sv-walk {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-2px) rotate(-6deg); }
  75% { transform: translateY(-2px) rotate(6deg); }
}
.sv-wrap:hover .sv-walk { animation: sv-walk 0.7s ease-in-out infinite; }
@keyframes sv-spin {
  from { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
  to { transform: rotate(360deg) scale(1); }
}
.sv-wrap:hover .sv-star { animation: sv-spin 0.9s cubic-bezier(0.34, 1.56, 0.64, 1); }

@keyframes sv-tw { from { opacity: 0; transform: translateY(0.6em); filter: blur(5px); } }
.sv-tw { display: inline-block; }
.sv-in .sv-tw { animation: sv-tw 0.9s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--cd, 0s) + var(--o, 0.5s)) backwards; }
.sv-tc { display: inline-block; }
@keyframes sv-tc-wave {
  0%, 100% { transform: translateY(0); }
  40% { transform: translateY(-4px); }
}
.sv-wrap:hover .sv-tc { animation: sv-tc-wave 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) var(--w, 0s) 1; }
.sv-uline {
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.sv-wrap:hover .sv-uline { transform: scaleX(1); }
@keyframes sv-desc { from { opacity: 0; transform: translateY(14px); filter: blur(6px); } }
.sv-in .sv-desc { animation: sv-desc 1s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--cd, 0s) + 0.9s) backwards; }

@keyframes sv-mark-in { from { scale: 0; rotate: -40deg; opacity: 0; } }
.sv-in .sv-mark { animation: sv-mark-in 1s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--cd, 0s) + 1s) backwards; }
.sv-mark-hover { transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
.sv-wrap:hover .sv-mark-hover { transform: scale(1.12) rotate(-6deg); }
@keyframes sv-sway {
  from { transform: rotate(-5deg) translateY(0); }
  to { transform: rotate(5deg) translateY(-4px); }
}
.sv-sway { animation: sv-sway 6s ease-in-out infinite alternate; }

@media (prefers-reduced-motion: reduce) {
  .sv-in .sv-line-l, .sv-in .sv-line-r, .sv-in .sv-pill, .sv-in .sv-tg, .sv-in .sv-hw,
  .sv-in .sv-hc, .sv-in .sv-wv, .sv-in .sv-spark, .sv-in .sv-wipe, .sv-wiggle,
  .sv-pill-sheen, .sv-sec-in .sv-paw-in, .sv-wrap.sv-in, .sv-in .sv-photo, .sv-in .sv-media,
  .sv-in .sv-badge, .sv-in .sv-ring, .sv-in .sv-tw, .sv-in .sv-desc, .sv-in .sv-mark,
  .sv-sway, .sv-wrap:hover .sv-sheen, .sv-wrap:hover .sv-tc, .sv-wrap:hover .sv-bubble,
  .sv-wrap:hover .sv-walk, .sv-wrap:hover .sv-star {
    animation: none !important;
  }
  .sv-in .sv-underline path { animation: none !important; stroke-dashoffset: 0; }
  .sv-card, .sv-media, .sv-badge-circle, .sv-mark-hover, .sv-uline { transition: none !important; }
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

function BathIcon({ className = "" }: { className?: string }) {
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
      <path d="M2 13h20" />
      <path d="M5 13v4a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-4" />
      <path d="M7 13V8a2 2 0 0 1 2-2h1" />
      <circle cx="8" cy="4" r="1.5" fill="currentColor" className="sv-bubble" style={{ "--i": 0 } as React.CSSProperties} />
      <circle cx="15" cy="5" r="1.5" fill="currentColor" className="sv-bubble" style={{ "--i": 1 } as React.CSSProperties} />
      <circle cx="12" cy="7" r="1.2" fill="currentColor" className="sv-bubble" style={{ "--i": 2 } as React.CSSProperties} />
    </svg>
  );
}

function WalkingIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`sv-walk ${className}`}
    >
      <circle cx="12" cy="4" r="2" />
      <path d="m9 20 3-6 3 2 2 4" />
      <path d="m6 13 4-2 3 3" />
      <path d="M14 9l4-2" />
      <path d="M18 7c1 1 2 3 3 5" />
      <path d="M21 16h-4l-1 4" />
    </svg>
  );
}

function TrainingIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`sv-star ${className}`}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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

function ServiceCard({
  card,
  idx,
  staggerClasses,
}: {
  card: CardType;
  idx: number;
  staggerClasses: string;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.15, "0px 0px -6% 0px");

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", String((0.5 - y) * 6));
    el.style.setProperty("--ry", String((x - 0.5) * 8));
    el.style.setProperty("--mx", String((x - 0.5) * 2));
    el.style.setProperty("--my", String((y - 0.5) * 2));
    el.style.setProperty("--sx", `${x * 100}%`);
    el.style.setProperty("--sy", `${y * 100}%`);
  };

  const onLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0");
    el.style.setProperty("--ry", "0");
    el.style.setProperty("--mx", "0");
    el.style.setProperty("--my", "0");
    el.style.setProperty("--sx", "50%");
    el.style.setProperty("--sy", "50%");
  };

  const rise = idx === 0 ? "-4deg" : idx === 2 ? "4deg" : "0deg";
  let ci = 0;

  return (
    <div className={staggerClasses}>
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ "--cd": `${idx * 0.15}s`, "--r": rise } as React.CSSProperties}
        className={`sv-wrap group ${inView ? "sv-in" : ""}`}
      >
        <div
          className={`sv-card relative rounded-[32px] sm:rounded-[36px] overflow-hidden ${card.theme.cardBg} border ${card.theme.cardBorder} shadow-[0_8px_30px_rgba(58,0,78,0.06)]`}
        >
          <div className="p-4 sm:p-5 pb-0">
            <div className="sv-photo relative rounded-[24px] sm:rounded-[28px] overflow-hidden aspect-[4/3] sm:aspect-[4/3] lg:aspect-[1.18/1]">
              <div className="sv-media absolute inset-0">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="sv-spot absolute inset-0" />
              <div className="sv-sheen" />
            </div>
          </div>

          <div className="relative">
            <div className="sv-badge absolute -top-7 right-6 sm:right-7 z-20 w-14 h-14 sm:w-16 sm:h-16">
              <span
                aria-hidden
                className={`sv-ring pointer-events-none absolute inset-0 rounded-full ${card.theme.badgeBg}`}
              />
              <div
                className={`sv-badge-circle relative w-full h-full rounded-full flex items-center justify-center border-4 border-white ${card.theme.badgeBg} text-white shadow-lg`}
              >
                {card.badgeIcon.name === "bath" && <BathIcon className="w-6 h-6 text-white" />}
                {card.badgeIcon.name === "walking" && <WalkingIcon className="w-6 h-6 text-white" />}
                {card.badgeIcon.name === "training" && <TrainingIcon className="w-6 h-6 text-white" />}
              </div>
            </div>

            <div className="px-6 sm:px-7 pt-9 pb-8 sm:pb-9 relative z-10">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#2E004F] tracking-tight mb-2 group-hover:text-[#8B1EB7] transition-colors duration-300">
                <span className="relative inline-block">
                  <span className="sr-only">{card.title}</span>
                  <span aria-hidden="true">
                    {words(card.title).map((w, wi, arr) => (
                      <React.Fragment key={wi}>
                        <span
                          className="sv-tw whitespace-nowrap"
                          style={{ "--o": `${0.55 + wi * 0.09}s` } as React.CSSProperties}
                        >
                          {Array.from(w).map((ch) => {
                            const i = ci++;
                            return (
                              <span
                                key={i}
                                className="sv-tc"
                                style={{ "--w": `${i * 0.035}s` } as React.CSSProperties}
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
                  <span className="sv-uline pointer-events-none absolute left-0 -bottom-1 h-[3px] w-full rounded-full bg-[#8B1EB7]" />
                </span>
              </h3>
              <p className="sv-desc text-sm sm:text-[15px] font-medium text-[#4A2E5B] leading-relaxed max-w-xs">
                {card.description}
              </p>
            </div>

            <div className="sv-mark absolute -bottom-3 -right-3 pointer-events-none opacity-40">
              <div className="sv-mark-hover">
                <div className="sv-sway">
                  <PawSvg size={84} fill={card.theme.watermarkColor} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Services({ data: customData }: ServicesProps) {
  const servicesData =
    customData ||
    (contentData.PawJoy.sections.Services.variants.PawJoyServices1 as ServicesData);

  const [secRef, secIn] = useInView<HTMLElement>(0.05, "0px");
  const [hdRef, hdIn] = useInView<HTMLDivElement>(0.3);

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

  const d = (s: number) => ({ "--d": `${s}s` } as React.CSSProperties);

  const part1 = words(servicesData.headingPart1);
  const highlightChars = Array.from(servicesData.headingHighlight.trim());
  const hlStart = 0.25 + part1.length * 0.09 + 0.1;
  const underlineDelay = hlStart + highlightChars.length * 0.045 + 0.35;

  let tagIdx = 0;

  return (
    <section
      ref={secRef}
      id={servicesData.id || "services"}
      className={`sv-sec relative w-full bg-white py-16 sm:py-20 lg:py-28 overflow-hidden ${
        secIn ? "sv-sec-in" : ""
      }`}
    >
      <style dangerouslySetInnerHTML={{ __html: SERVICES_CSS }} />

      {servicesData.backgroundPaws.map((paw, idx) => (
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
              "--d": `${0.3 + idx * 0.12}s`,
            } as React.CSSProperties
          }
          className="sv-paw-in absolute pointer-events-none select-none z-0"
        >
          <div
            className="sv-par"
            style={{ "--k": ((idx % 3) + 1) * 14 * (idx % 2 ? -1 : 1) } as React.CSSProperties}
          >
            <div className={idx % 2 === 0 ? "animate-float-slow" : "animate-float-reverse"}>
              <PawSvg size={paw.size} fill="#DFCCF0" />
            </div>
          </div>
        </div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={hdRef}
          className={`sv-hd flex flex-col items-center text-center max-w-3xl mx-auto mb-14 sm:mb-16 ${
            hdIn ? "sv-in" : ""
          }`}
        >
          <div className="flex items-center justify-center gap-3 w-full mb-3">
            <span className="sv-hx sv-line-l w-10 sm:w-14 h-[1.5px] bg-[#8B1EB7]/60 rounded-full" />
            <div className="sv-hx sv-pill relative overflow-hidden inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE4F8] border border-[#DFCCF0]/80 shadow-xs transition-transform duration-300 hover:scale-105">
              <PawSvg size={18} fill="#2E004F" className="sv-wiggle w-4 h-4" />
              <span
                aria-label={servicesData.tagline}
                className="text-xs sm:text-sm font-semibold text-[#2E004F] tracking-wide"
              >
                <span aria-hidden="true">
                  {words(servicesData.tagline).map((w, wi, arr) => (
                    <React.Fragment key={wi}>
                      <span className="inline-block whitespace-nowrap">
                        {Array.from(w).map((ch) => {
                          const i = tagIdx++;
                          return (
                            <span key={i} className="sv-hx sv-tg" style={d(0.45 + i * 0.03)}>
                              {ch}
                            </span>
                          );
                        })}
                      </span>
                      {wi < arr.length - 1 ? " " : ""}
                    </React.Fragment>
                  ))}
                </span>
              </span>
              <span className="sv-pill-sheen pointer-events-none" />
            </div>
            <span className="sv-hx sv-line-r w-10 sm:w-14 h-[1.5px] bg-[#8B1EB7]/60 rounded-full" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#2E004F] tracking-tight leading-tight mb-4 sm:mb-5">
            <span className="sr-only">
              {servicesData.headingPart1}
              {servicesData.headingHighlight}
            </span>
            <span aria-hidden="true">
              {part1.map((w, i) => (
                <React.Fragment key={i}>
                  <span className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]">
                    <span className="sv-hx sv-hw inline-block" style={d(0.25 + i * 0.09)}>
                      {w}
                    </span>
                  </span>{" "}
                </React.Fragment>
              ))}
              <span className="relative inline-block text-[#8B1EB7]">
                {highlightChars.map((ch, i) =>
                  ch === " " ? (
                    " "
                  ) : (
                    <span key={i} className="sv-hx sv-hc" style={d(hlStart + i * 0.045)}>
                      <span
                        className="sv-wv"
                        style={{ "--wd": `${2.6 + i * 0.09}s` } as React.CSSProperties}
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
                  className="sv-underline pointer-events-none absolute left-[2%] -bottom-1 sm:-bottom-2 h-2 sm:h-3 w-[96%]"
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
                  className="sv-spark pointer-events-none absolute -top-1 -right-4 sm:-top-3 sm:-right-8 h-4 w-4 sm:h-6 sm:w-6"
                  style={d(underlineDelay + 0.2)}
                />
              </span>
            </span>
          </h2>

          <p
            style={d(0.9)}
            className="sv-hx sv-wipe max-w-[340px] sm:max-w-lg md:max-w-none mx-auto px-2 sm:px-0 text-[#4A2E5B] text-sm sm:text-base font-medium leading-relaxed text-balance"
          >
            {servicesData.descriptionLines.map((line, idx) => (
              <React.Fragment key={idx}>
                <span className="inline md:block">{line}</span>
                {idx < servicesData.descriptionLines.length - 1 ? (
                  <span className="md:hidden"> </span>
                ) : null}
              </React.Fragment>
            ))}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-8 items-start pb-8 md:pb-32">
          {servicesData.cards.map((card, idx) => {
            const staggerClasses =
              idx === 0
                ? "md:translate-y-0"
                : idx === 1
                ? "md:translate-y-12 lg:translate-y-14"
                : "md:translate-y-24 lg:translate-y-28";

            return (
              <ServiceCard
                key={card.id}
                card={card}
                idx={idx}
                staggerClasses={staggerClasses}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
