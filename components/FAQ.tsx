"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Lora } from "next/font/google";
import contentData from "@/data/content.json";
import { FAQData } from "@/data/type";

interface FAQProps {
  data?: FAQData;
}

const serif = Lora({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const FAQ_CSS = `
@keyframes faq-line { from { opacity: 0; transform: scaleX(0); } }
@keyframes faq-pill { from { opacity: 0; transform: translateY(14px) scale(0.6); } }
@keyframes faq-ch { from { opacity: 0; transform: translateY(0.6em) rotate(8deg) scale(0.7); filter: blur(6px); } }
@keyframes faq-cd { from { opacity: 0; transform: translateY(-0.7em) rotate(-8deg) scale(1.5); filter: blur(8px); } }
@keyframes faq-hw { from { opacity: 0; transform: translateY(115%) rotate(5deg); } }
@keyframes faq-bw { from { opacity: 0; filter: blur(8px); transform: translateY(10px); } }
@keyframes faq-wave {
  0%, 60%, 100% { color: var(--wb, #8B1EB7); text-shadow: 0 0 0 rgba(207, 140, 235, 0); }
  30% { color: var(--wp, #d58cff); text-shadow: 0 0 20px rgba(207, 140, 235, 0.5); }
}
@keyframes faq-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes faq-spark {
  0%, 100% { transform: scale(0.2) rotate(0deg); opacity: 0; }
  50% { transform: scale(1) rotate(90deg); opacity: 1; }
}
@keyframes faq-wiggle {
  0%, 70%, 100% { transform: rotate(0deg); }
  76% { transform: rotate(-16deg) scale(1.12); }
  84% { transform: rotate(14deg) scale(1.12); }
  92% { transform: rotate(-7deg); }
}
@keyframes faq-sheen {
  0% { transform: translateX(-160%) skewX(-20deg); }
  22%, 100% { transform: translateX(380%) skewX(-20deg); }
}

.faq-hd:not(.faq-in) .faq-hx { opacity: 0; }
.faq-ll { transform-origin: right center; }
.faq-lr { transform-origin: left center; }
.faq-in .faq-ll, .faq-in .faq-lr { animation: faq-line 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s backwards; }
.faq-in .faq-pill { animation: faq-pill 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards; }
.faq-ch, .faq-cd { display: inline-block; }
.faq-in .faq-ch { animation: faq-ch 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0s) backwards; }
.faq-in .faq-cd { animation: faq-cd 1s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0s) backwards; }
.faq-wv { display: inline-block; }
.faq-in .faq-wv { animation: faq-wave 4s ease-in-out var(--wd, 2.5s) infinite; }
.faq-hw { transform-origin: left bottom; }
.faq-in .faq-hw { animation: faq-hw 0.95s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0s) backwards; }
.faq-bw { display: inline-block; }
.faq-in .faq-bw { animation: faq-bw 0.8s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0s) backwards; }
.faq-underline path { stroke-dasharray: 1; stroke-dashoffset: 1; }
.faq-in .faq-underline path { animation: faq-draw 1.2s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 1s) forwards; }
.faq-spark { opacity: 0; transform-origin: center; }
.faq-in .faq-spark { animation: faq-spark 2.6s ease-in-out var(--d, 1.6s) infinite; }
.faq-wiggle { transform-origin: 50% 70%; animation: faq-wiggle 4.5s ease-in-out 2.4s infinite; }
.faq-pill-sheen {
  position: absolute; top: 0; bottom: 0; left: 0; width: 35%;
  background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transform: translateX(-160%) skewX(-20deg);
  animation: faq-sheen 6s ease-in-out 2.5s infinite;
}

.faq-par {
  transform: translate3d(calc(var(--mx, 0) * var(--k, 0) * 1px), calc(var(--my, 0) * var(--k, 0) * 1px), 0);
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes faq-paw-in { from { scale: 0; opacity: 0; } }
.faq-sec:not(.faq-sec-in) .faq-paw-in { opacity: 0; }
.faq-sec-in .faq-paw-in { animation: faq-paw-in 1.1s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0.4s) backwards; }
@keyframes faq-float { from { translate: 0 0; } to { translate: 0 -10px; } }
.faq-floaty { animation: faq-float 6s ease-in-out infinite alternate; }

.faq-imgwrap:not(.faq-in) { opacity: 0; }
@keyframes faq-img-in { from { opacity: 0; transform: translate3d(-50px, 24px, 0) rotate(-3deg) scale(0.94); } }
.faq-imgwrap.faq-in { animation: faq-img-in 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.1s backwards; }

@keyframes faq-frame-in { from { scale: 0.9; opacity: 0; } }
@keyframes faq-breathe { from { scale: 1; } to { scale: 1.018; } }
.faq-in .faq-frame {
  animation: faq-frame-in 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s backwards,
             faq-breathe 5s ease-in-out 1.5s infinite alternate;
}
.faq-frame { transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.4s ease; }
.faq-imgwrap:hover .faq-frame { transform: scale(1.03); border-color: rgba(122, 18, 166, 0.55); }

@keyframes faq-wipe {
  from { clip-path: inset(0 100% 0 0 round 30px); }
  to { clip-path: inset(0 0 0 0 round 30px); }
}
.faq-in .faq-photo { animation: faq-wipe 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.25s backwards; }
@keyframes faq-settle { from { scale: 1.3; } }
@keyframes faq-kb { from { scale: 1; } to { scale: 1.07; } }
.faq-in .faq-media {
  animation: faq-settle 1.8s cubic-bezier(0.22, 1, 0.36, 1) 0.25s backwards,
             faq-kb 18s ease-in-out 2s infinite alternate;
}
.faq-spot {
  opacity: 0;
  background: radial-gradient(circle at var(--sx, 50%) var(--sy, 50%), rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0) 55%);
  mix-blend-mode: soft-light;
  transition: opacity 0.5s ease;
  pointer-events: none;
}
.faq-imgwrap:hover .faq-spot { opacity: 1; }
.faq-isheen {
  position: absolute; top: 0; bottom: 0; left: -60%; width: 40%;
  background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transform: skewX(-14deg);
  opacity: 0;
  pointer-events: none;
}
.faq-imgwrap:hover .faq-isheen { opacity: 1; animation: faq-isheen 1s ease-out; }
@keyframes faq-isheen { from { left: -60%; } to { left: 140%; } }

@keyframes faq-badge-in { from { scale: 0; rotate: -180deg; opacity: 0; } }
@keyframes faq-bob { from { translate: 0 0; } to { translate: 0 -7px; } }
.faq-in .faq-badge {
  animation: faq-badge-in 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.9s backwards,
             faq-bob 4s ease-in-out 2s infinite alternate;
}
.faq-badge-i { transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
.faq-imgwrap:hover .faq-badge-i { transform: rotate(14deg) scale(1.12); }

.faq-list:not(.faq-in) .faq-item { opacity: 0; }
@keyframes faq-rise { from { opacity: 0; transform: translate3d(0, 28px, 0); } }
.faq-in .faq-item { animation: faq-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0s) backwards; }

.faq-item {
  border-top: 2px solid #CDC6D8;
  margin-top: 0;
  margin-bottom: 0;
  transition: margin 0.5s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.4s ease;
}
.faq-item.is-open { border-top-color: transparent; margin-top: 22px; margin-bottom: 22px; }
.faq-item.is-open:first-child { margin-top: 0; }

.faq-btn { position: relative; }
.faq-bar {
  position: absolute; left: 0; top: 0; bottom: 0; width: 4px; border-radius: 9999px;
  background: linear-gradient(to bottom, #8B1EB7, #4A0F78);
  transform: scaleY(0);
  transform-origin: top center;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
}
.faq-item.is-open .faq-bar { transform: scaleY(1); }
.faq-item:not(.is-open) .faq-btn:hover .faq-bar { transform: scaleY(0.55); }

.faq-qtext { transition: color 0.4s ease; }
.faq-item.is-open .faq-qtext { color: #6B17A8; }
.faq-qc { display: inline-block; }
@keyframes faq-qwave { 0%, 100% { transform: translateY(0); } 40% { transform: translateY(-3px); } }
.faq-btn:hover .faq-qc { animation: faq-qwave 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) var(--w, 0s) 1; }

@keyframes faq-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(3px); } }
.faq-item:not(.is-open) .faq-btn:hover .faq-chev-wrap { animation: faq-bounce 0.8s ease-in-out infinite; }

.faq-ans {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease;
}
.faq-item.is-open .faq-ans { grid-template-rows: 1fr; opacity: 1; }
.faq-ans-in { min-height: 0; overflow: hidden; }
.faq-aw { display: inline-block; }
.faq-in .faq-item.is-open .faq-aw {
  animation: faq-bw 0.7s cubic-bezier(0.22, 1, 0.36, 1) calc(0.12s + var(--d, 0s)) backwards;
}
.faq-psheen {
  position: absolute; top: 0; bottom: 0; left: -50%; width: 40%;
  background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  transform: skewX(-16deg);
  opacity: 0;
  pointer-events: none;
}
.faq-in .faq-item.is-open .faq-psheen { animation: faq-psheen 1.1s ease-out 0.15s 1 both; }
@keyframes faq-psheen {
  0% { left: -50%; opacity: 0; }
  20% { opacity: 1; }
  100% { left: 130%; opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .faq-in .faq-ll, .faq-in .faq-lr, .faq-in .faq-pill, .faq-in .faq-ch, .faq-in .faq-cd,
  .faq-in .faq-wv, .faq-in .faq-hw, .faq-in .faq-bw, .faq-in .faq-spark, .faq-wiggle,
  .faq-pill-sheen, .faq-sec-in .faq-paw-in, .faq-floaty, .faq-imgwrap.faq-in, .faq-in .faq-frame,
  .faq-in .faq-photo, .faq-in .faq-media, .faq-imgwrap:hover .faq-isheen, .faq-in .faq-badge,
  .faq-in .faq-item, .faq-btn:hover .faq-qc, .faq-item:not(.is-open) .faq-btn:hover .faq-chev-wrap,
  .faq-in .faq-item.is-open .faq-aw, .faq-in .faq-item.is-open .faq-psheen {
    animation: none !important;
  }
  .faq-in .faq-underline path { animation: none !important; stroke-dashoffset: 0; }
  .faq-underline path { stroke-dashoffset: 0; }
  .faq-par, .faq-frame, .faq-badge-i, .faq-bar, .faq-item, .faq-ans { transition: none !important; }
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

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="3 8 12 17 21 8" />
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

function renderChars(text: string, cls: string, base: number, step: number) {
  const ws = words(text);
  let ci = 0;
  return ws.map((w, wi) => (
    <React.Fragment key={wi}>
      <span className="inline-block whitespace-nowrap">
        {Array.from(w).map((ch) => {
          const i = ci++;
          return (
            <span key={i} className={`faq-hx ${cls}`} style={dv(base + i * step)}>
              {ch}
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
        <span className="faq-hx faq-hw inline-block" style={dv(base + i * step)}>
          {w}
        </span>
      </span>{" "}
    </React.Fragment>
  ));
}

function renderBlurWords(text: string, base: number, step: number) {
  const ws = words(text);
  return ws.map((w, i) => (
    <React.Fragment key={i}>
      <span className="faq-hx faq-bw" style={dv(base + i * step)}>
        {w}
      </span>
      {i < ws.length - 1 ? " " : ""}
    </React.Fragment>
  ));
}

export default function FAQ({ data: customData }: FAQProps) {
  const faqData =
    customData ||
    (contentData.PawJoy.sections.FAQ?.variants.PawJoyFAQ1 as FAQData);
  const [openId, setOpenId] = useState<string>(faqData.items[0]?.id || "1");

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? "" : id));
  };

  const [secRef, secIn] = useInView<HTMLElement>(0.05, "0px");
  const [hdRef, hdIn] = useInView<HTMLDivElement>(0.3);
  const [imgRef, imgIn] = useInView<HTMLDivElement>(0.2);
  const [listRef, listIn] = useInView<HTMLDivElement>(0.12, "0px 0px -6% 0px");

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

  const onImgMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--sy", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const part1Count = words(faqData.headingPart1).length;
  const highlightChars = Array.from(faqData.headingHighlight.trim());
  const hlStart = 0.25 + part1Count * 0.09 + 0.1;
  const underlineDelay = hlStart + highlightChars.length * 0.045 + 0.35;

  return (
    <section
      ref={secRef}
      id={faqData.id || "faqs"}
      onPointerMove={onSecMove}
      onPointerLeave={onSecLeave}
      className={`faq-sec relative w-full overflow-hidden bg-[#FDFBFF] py-16 sm:py-20 lg:py-24 ${
        secIn ? "faq-sec-in" : ""
      }`}
    >
      <style dangerouslySetInnerHTML={{ __html: FAQ_CSS }} />

      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          style={{ "--k": -18 } as React.CSSProperties}
          className="faq-par absolute -top-32 -left-24 h-[360px] w-[360px] rounded-full bg-[#F1E4FA]/60 blur-3xl"
        />
        <div
          style={{ "--k": 22 } as React.CSSProperties}
          className="faq-par absolute -bottom-32 -right-24 h-[400px] w-[400px] rounded-full bg-[#EED9FA]/50 blur-3xl"
        />

        {(faqData.backgroundPaws || []).map((paw, idx) => (
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
            className="faq-paw-in absolute select-none"
          >
            <div
              className="faq-par"
              style={{ "--k": ((idx % 3) + 1) * 9 * (idx % 2 ? -1 : 1) } as React.CSSProperties}
            >
              <div className="faq-floaty" style={{ animationDelay: `${-idx * 1.3}s` }}>
                <PawSvg size={paw.size} fill="#E3CFF2" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={hdRef}
          className={`faq-hd mx-auto mb-10 flex max-w-4xl flex-col items-center text-center sm:mb-12 ${
            hdIn ? "faq-in" : ""
          }`}
        >
          <div className="mb-1.5 flex w-full items-center justify-center gap-3 sm:mb-2 sm:gap-4">
            <span className="faq-hx faq-ll h-[2px] w-8 rounded-full bg-[#7A1CA3] sm:w-[87px]" />

            <div className="faq-hx faq-pill relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-[#EFE4F8] px-5 py-2 transition-transform duration-300 hover:scale-105 sm:gap-3 sm:px-6">
              <PawSvg
                size={40}
                fill="#6B17A8"
                className="faq-wiggle h-8 w-8 sm:h-10 sm:w-10"
              />
              <span
                aria-label={faqData.tagline}
                className="text-2xl font-bold leading-none text-[#4A0F78] sm:text-[30px]"
              >
                <span aria-hidden="true">{renderChars(faqData.tagline, "faq-ch", 0.45, 0.035)}</span>
              </span>
              <span className="faq-pill-sheen pointer-events-none" />
            </div>

            <span className="faq-hx faq-lr h-[2px] w-8 rounded-full bg-[#7A1CA3] sm:w-[87px]" />
          </div>

          <h2
            className={`${serif.className} mb-2 text-[32px] font-bold leading-[1.15] text-[#3B0A5E] sm:text-[44px] lg:text-[52px]`}
            style={{ "--wb": "#8B1EB7", "--wp": "#d58cff" } as React.CSSProperties}
          >
            <span className="sr-only">
              {faqData.headingPart1} {faqData.headingHighlight}
            </span>
            <span aria-hidden="true">
              {renderMaskWords(faqData.headingPart1, 0.25, 0.09)}
              <span className="relative inline-block text-[#8B1EB7]">
                {highlightChars.map((ch, i) =>
                  ch === " " ? (
                    " "
                  ) : (
                    <span key={i} className="faq-hx faq-cd" style={dv(hlStart + i * 0.045)}>
                      <span
                        className="faq-wv"
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
                  className="faq-underline pointer-events-none absolute left-[2%] -bottom-1 h-2 w-[96%] sm:-bottom-2 sm:h-3"
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
                  className="faq-spark pointer-events-none absolute -top-1 -right-4 h-4 w-4 sm:-top-3 sm:-right-9 sm:h-7 sm:w-7"
                  style={dv(underlineDelay + 0.2)}
                />
              </span>
            </span>
          </h2>

          <p className="text-base font-medium leading-relaxed text-[#4A4458] sm:text-lg lg:text-[22px]">
            {renderBlurWords(faqData.description, 0.8, 0.025)}
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[420px_1fr] xl:grid-cols-[450px_1fr] lg:gap-12 xl:gap-16">
          <div className="w-full max-w-[400px] sm:max-w-[420px] xl:max-w-[450px] mx-auto lg:mx-0 shrink-0 self-start">
            <div
              ref={imgRef}
              onPointerMove={onImgMove}
              className={`faq-imgwrap relative ${imgIn ? "faq-in" : ""}`}
            >
              <div
                aria-hidden="true"
                className="faq-frame pointer-events-none absolute -inset-2 rounded-[36px] border-2 border-[#7A12A6]/30"
              />

              <div className="faq-photo group relative aspect-[4/3] w-full overflow-hidden rounded-[30px] border-4 border-white bg-purple-50 shadow-[0_12px_34px_rgba(58,0,78,0.10)]">
                <div className="faq-media absolute inset-0">
                  <Image
                    src={faqData.image.src}
                    alt={faqData.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 420px, 450px"
                    className="object-cover object-[center_32%] transition-transform duration-700 ease-out group-hover:scale-105"
                    priority
                  />
                </div>
                <div className="faq-spot absolute inset-0" />
                <div className="faq-isheen" />
              </div>

              <div
                aria-hidden
                className="faq-badge pointer-events-none absolute -right-2 -top-4 z-10 sm:-right-4 sm:-top-5"
              >
                <div
                  className={`${serif.className} faq-badge-i flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-[#7A1CA3] text-2xl font-bold leading-none text-white shadow-[0_8px_20px_rgba(58,0,78,0.3)] sm:h-14 sm:w-14 sm:text-3xl`}
                >
                  {faqData.image.badgeIcon || "?"}
                </div>
              </div>
            </div>
          </div>

          <div
            ref={listRef}
            className={`faq-list w-full min-w-0 border-b-2 border-[#CDC6D8] ${listIn ? "faq-in" : ""}`}
          >
            {faqData.items.map((item, idx) => {
              const isOpen = openId === item.id;
              let qi = 0;
              const answerWords = words(item.answer);

              return (
                <div
                  key={item.id}
                  className={`faq-item ${isOpen ? "is-open" : ""}`}
                  style={dv(0.15 + idx * 0.1)}
                >
                  <button
                    type="button"
                    id={`faq-q-${item.id}`}
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${item.id}`}
                    className={`faq-btn flex w-full cursor-pointer items-center justify-between gap-4 px-4 text-left outline-none transition-[padding,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-[#8B1EB7]/50 sm:px-[18px] ${
                      isOpen ? "py-3.5" : "py-[21px] hover:bg-[#FAF6FD]"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-r from-[#FBF6FF] to-[#F7EFFC] transition-opacity duration-500 ${
                        isOpen ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <span aria-hidden className="faq-bar" />

                    <span
                      className={`${serif.className} faq-qtext relative z-10 text-base font-bold leading-[1.25] text-[#3A0B5C] sm:text-xl lg:text-[24px]`}
                    >
                      <span className="sr-only">{item.question}</span>
                      <span aria-hidden="true">
                        {words(item.question).map((w, wi, arr) => (
                          <React.Fragment key={wi}>
                            <span className="inline-block whitespace-nowrap">
                              {Array.from(w).map((ch) => {
                                const i = qi++;
                                return (
                                  <span
                                    key={i}
                                    className="faq-qc"
                                    style={{ "--w": `${Math.min(i, 40) * 0.02}s` } as React.CSSProperties}
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
                    </span>

                    <span className="faq-chev-wrap relative z-10 inline-flex shrink-0">
                      <ChevronDownIcon
                        className={`-my-[2px] h-7 w-7 text-[#3A0B5C] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] lg:h-[34px] lg:w-[34px] ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                  </button>

                  <div
                    id={`faq-a-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-q-${item.id}`}
                    aria-hidden={!isOpen}
                    className="faq-ans"
                  >
                    <div className="faq-ans-in">
                      <div className="relative bg-[#EEE4F9] px-4 py-3 sm:px-[18px]">
                        <span aria-hidden className="faq-psheen" />
                        <p className="relative text-[15px] font-normal leading-[1.65] text-[#36274A] sm:text-[17px] lg:text-lg">
                          {answerWords.map((w, i) => (
                            <React.Fragment key={i}>
                              <span
                                className="faq-aw"
                                style={dv(Math.min(i, 45) * 0.018)}
                              >
                                {w}
                              </span>
                              {i < answerWords.length - 1 ? " " : ""}
                            </React.Fragment>
                          ))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}