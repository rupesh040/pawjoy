"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import contentData from "@/data/content.json";
import { HeroData } from "@/data/type";

interface HeroProps {
  data?: HeroData;
}

const NOTCH_MASK =
  "radial-gradient(ellipse 30px 50px at 0 50%, transparent 98%, #000 100%) left / 50% 100% no-repeat, radial-gradient(ellipse 30px 50px at 100% 50%, transparent 98%, #000 100%) right / 50% 100% no-repeat";

const HERO_CSS = `
@keyframes hx-fade-up {
  from { opacity: 0; transform: translateY(26px); }
}
@keyframes hx-fade {
  from { opacity: 0; }
}
@keyframes hx-card-left {
  from { opacity: 0; translate: -64px 0; }
}
@keyframes hx-card-right {
  from { opacity: 0; translate: 64px 0; }
}
@keyframes hx-card-rise {
  from { opacity: 0; translate: 0 48px; }
}
@keyframes hx-img-settle {
  from { transform: scale(1.16); }
}
@keyframes hx-pop {
  from { opacity: 0; transform: translateY(16px) scale(0.86); }
}
@keyframes hx-dot {
  from { opacity: 0; transform: scale(0.3); }
}

.hx-fade-up { animation: hx-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) backwards; }
.hx-fade { animation: hx-fade 0.6s ease-out backwards; }
.hx-strip { animation: hx-fade 0.7s ease-out 0.5s backwards; }
.hx-card-left { animation: hx-card-left 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.55s backwards; }
.hx-card-center { animation: hx-card-rise 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.67s backwards; }
.hx-card-right { animation: hx-card-right 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.79s backwards; }
.hx-img { animation: hx-img-settle 1.8s cubic-bezier(0.22, 1, 0.36, 1) 0.55s backwards; }
.hx-pop { animation: hx-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) backwards; }
.hx-dot { animation: hx-dot 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards; }

.hx-char {
  display: inline-block;
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
}
.hx-char:hover {
  transform: translateY(-7px) scale(1.14) rotate(-4deg);
}
@keyframes hx-char-up {
  from { opacity: 0; transform: translateY(0.55em) rotate(10deg) scale(0.7); filter: blur(6px); }
}
@keyframes hx-char-drop {
  from { opacity: 0; transform: translateY(-0.7em) rotate(-8deg) scale(1.5); filter: blur(8px); }
}
.hx-c1 { animation: hx-char-up 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0s) backwards; }
.hx-c2 { animation: hx-char-drop 1s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0s) backwards; }

.hx-wave {
  display: inline-block;
  animation: hx-wave 3.6s ease-in-out var(--wd, 3s) infinite;
}
@keyframes hx-wave {
  0%, 60%, 100% { color: #9214B7; text-shadow: 0 0 0 rgba(217, 131, 255, 0); }
  30% { color: #d983ff; text-shadow: 0 0 22px rgba(217, 131, 255, 0.55); }
}

.hx-underline path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: hx-draw 1.2s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 1s) forwards;
}
@keyframes hx-draw {
  to { stroke-dashoffset: 0; }
}

.hx-spark {
  transform-origin: center;
  animation: hx-spark 2.6s ease-in-out var(--d, 1.6s) infinite;
  opacity: 0;
}
@keyframes hx-spark {
  0%, 100% { transform: scale(0.2) rotate(0deg); opacity: 0; }
  50% { transform: scale(1) rotate(90deg); opacity: 1; }
}

.hx-ray {
  animation:
    hx-fade 0.6s ease-out var(--d, 0.5s) backwards,
    hx-ray 2.6s ease-in-out calc(var(--d, 0.5s) + 1s) infinite;
}
@keyframes hx-ray {
  0%, 100% { scale: 1; opacity: 1; }
  50% { scale: 1.3 1.45; opacity: 0.7; }
}

.hx-word {
  display: inline-block;
  animation: hx-word 0.8s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0s) backwards;
  transition: color 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.hx-word:hover {
  color: #9214B7;
  transform: translateY(-2px);
}
@keyframes hx-word {
  from { opacity: 0; filter: blur(8px); transform: translateY(12px); }
}

.hx-caret {
  display: inline-block;
  width: 2px;
  height: 1.05em;
  margin-left: 2px;
  vertical-align: -0.15em;
  background: #45005B;
  animation: hx-blink 0.8s steps(1) infinite;
}
.hx-caret-done {
  animation: none;
  opacity: 0;
  transition: opacity 0.5s ease 0.8s;
}
@keyframes hx-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.hx-bsheen {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 35%;
  background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transform: translateX(-160%) skewX(-20deg);
  animation: hx-bsheen 6s ease-in-out 2.5s infinite;
}
@keyframes hx-bsheen {
  0% { transform: translateX(-160%) skewX(-20deg); }
  22%, 100% { transform: translateX(380%) skewX(-20deg); }
}
.hx-wiggle {
  transform-origin: 50% 70%;
  animation: hx-wiggle 4.5s ease-in-out 2.2s infinite;
}
@keyframes hx-wiggle {
  0%, 70%, 100% { transform: rotate(0deg); }
  76% { transform: rotate(-16deg) scale(1.12); }
  84% { transform: rotate(14deg) scale(1.12); }
  92% { transform: rotate(-7deg); }
}

.hx-par {
  transform: translate3d(calc(var(--mx, 0) * var(--k, 0) * 1px), calc(var(--my, 0) * var(--k, 0) * 1px), 0);
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.hx-glow {
  position: absolute;
  left: 0;
  top: 0;
  width: 440px;
  height: 440px;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(204, 140, 240, 0.38), rgba(204, 140, 240, 0) 65%);
  transform: translate3d(calc(var(--gx, 50vw) - 220px), calc(var(--gy, 25vh) - 220px), 0);
  opacity: var(--go, 0);
  transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease;
  pointer-events: none;
}
@keyframes hx-paw-in {
  from { scale: 0; opacity: 0; }
}
.hx-paw-in { animation: hx-paw-in 1.1s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0.5s) backwards; }

.hx-kb { animation: hx-kb 16s ease-in-out infinite alternate; }
.hx-kb-r { animation-direction: alternate-reverse; }
@keyframes hx-kb {
  from { transform: scale(1.05) translate3d(0, 0, 0); }
  to { transform: scale(1.13) translate3d(-1.5%, -1%, 0); }
}
.hx-card-sheen {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -60%;
  width: 40%;
  background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.35), transparent);
  transform: skewX(-12deg);
  opacity: 0;
  pointer-events: none;
}
.group:hover .hx-card-sheen {
  opacity: 1;
  animation: hx-card-sheen 1.1s ease-out;
}
@keyframes hx-card-sheen {
  from { left: -60%; }
  to { left: 140%; }
}

.hx-nudge { animation: hx-nudge 1.6s ease-in-out infinite; }
@keyframes hx-nudge {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(4px); }
}
.hx-ping { animation: hx-ping 0.8s cubic-bezier(0, 0, 0.2, 1) forwards; }
@keyframes hx-ping {
  from { opacity: 0.5; transform: scale(1); }
  to { opacity: 0; transform: scale(2.4); }
}

@media (max-width: 767px) {
  .hx-card-left, .hx-card-right, .hx-card-center {
    animation-name: hx-card-rise;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hx-fade-up, .hx-fade, .hx-strip, .hx-card-left, .hx-card-center,
  .hx-card-right, .hx-img, .hx-pop, .hx-dot, .hx-c1, .hx-c2, .hx-wave,
  .hx-spark, .hx-ray, .hx-word, .hx-bsheen, .hx-wiggle, .hx-paw-in,
  .hx-kb, .hx-nudge, .hx-caret, .group:hover .hx-card-sheen {
    animation: none !important;
  }
  .hx-underline path { animation: none !important; stroke-dashoffset: 0; }
  .hx-spark { opacity: 0; }
  .hx-glow { display: none; }
  .hx-par, .hx-char, .hx-word { transition: none !important; }
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
      xmlns="http://www.w3.org/2000/svg"
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

function StethoscopeIcon({ className = "" }: { className?: string }) {
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
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  );
}

function useTypewriter(text: string, startDelay = 600, speed = 40) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length);
      return;
    }
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const timer = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length && interval) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [text, startDelay, speed]);

  return count;
}

export default function Hero({ data: customData }: HeroProps) {
  const heroData =
    customData ||
    (contentData.PawJoy.sections.Hero.variants.PawJoyHero1 as HeroData);

  const lastIndex = heroData.cards.length - 1;

  const badgeText = heroData.badge.text;
  const typed = useTypewriter(badgeText);

  const onHeroMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    el.style.setProperty("--mx", String((px / r.width - 0.5) * 2));
    el.style.setProperty("--my", String((py / r.height - 0.5) * 2));
    el.style.setProperty("--gx", `${px}px`);
    el.style.setProperty("--gy", `${py}px`);
    el.style.setProperty("--go", "1");
  };

  const onHeroLeave = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--mx", "0");
    el.style.setProperty("--my", "0");
    el.style.setProperty("--go", "0");
  };

  const renderChars = (
    text: string,
    kind: 1 | 2,
    baseDelay: number,
    step: number,
    wave = false
  ) => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    let ci = 0;
    return words.map((w, wi) => (
      <React.Fragment key={wi}>
        <span className="inline-block whitespace-nowrap">
          {Array.from(w).map((ch) => {
            const i = ci++;
            return (
              <span
                key={i}
                className={`hx-char hx-c${kind}`}
                style={{ "--d": `${baseDelay + i * step}s` } as React.CSSProperties}
              >
                {wave ? (
                  <span
                    className="hx-wave"
                    style={{ "--wd": `${2.8 + i * 0.09}s` } as React.CSSProperties}
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
        {wi < words.length - 1 ? " " : ""}
      </React.Fragment>
    ));
  };

  const part2Len = heroData.headingPart2.replace(/\s+/g, "").length;
  const underlineDelay = 0.4 + part2Len * 0.045 + 0.35;

  return (
    <section
      id={heroData.id || "home"}
      onPointerMove={onHeroMove}
      onPointerLeave={onHeroLeave}
      className="relative w-full overflow-hidden bg-[#FCF8FF] pt-5 sm:pt-7 lg:pt-6 pb-10 sm:pb-12 lg:pb-12"
    >
      <style dangerouslySetInnerHTML={{ __html: HERO_CSS }} />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hx-glow" />

        <div
          style={{ "--k": -22 } as React.CSSProperties}
          className="hx-par absolute -top-40 -left-36 w-[400px] h-[400px] rounded-full bg-[#EBD9F8]/40 blur-3xl"
        />
        <div
          style={{ "--k": 26 } as React.CSSProperties}
          className="hx-par absolute -bottom-40 -right-32 w-[450px] h-[450px] rounded-full bg-[#EBD9F8]/50 blur-3xl"
        />

        <div
          style={{ "--k": 14 } as React.CSSProperties}
          className="hx-par absolute -left-32 top-[25%] w-[250px] h-[390px] rounded-r-full bg-[#F0E3FA]/65"
        />
        <div
          style={{ "--k": -14 } as React.CSSProperties}
          className="hx-par absolute -right-32 top-[35%] w-[250px] h-[390px] rounded-l-full bg-[#F0E3FA]/65"
        />
        <div
          style={{ "--k": 10 } as React.CSSProperties}
          className="hx-par absolute -top-32 -right-20 w-52 h-52 rounded-full bg-[#EBD9F8]/35"
        />

        {heroData.backgroundPaws.map((paw, idx) => (
          <div
            key={idx}
            style={{
              top: paw.top,
              bottom: paw.bottom,
              left: paw.left,
              right: paw.right,
              transform: `rotate(${paw.rotate}deg)`,
              opacity: paw.opacity,
              "--d": `${0.5 + idx * 0.12}s`,
            } as React.CSSProperties}
            className="hx-paw-in absolute pointer-events-none select-none z-0"
          >
            <div
              className="hx-par"
              style={{ "--k": (idx % 3 + 1) * 9 * (idx % 2 ? -1 : 1) } as React.CSSProperties}
            >
              <div
                className={
                  idx % 2 === 0 ? "animate-float-slow" : "animate-float-reverse"
                }
              >
                <PawSvg size={paw.size} fill="#DFCCF0" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="hx-fade-up mb-5 sm:mb-6">
          <div className="relative overflow-hidden inline-flex items-center gap-2 px-5 sm:px-6 py-2 rounded-full bg-[#EEDDF7] border border-[#E5D1F0] shadow-[0_3px_12px_rgba(58,0,78,0.05)] transition-all duration-300 hover:scale-105">
            <PawSvg size={19} fill="#45005B" className="hx-wiggle w-5 h-5" />
            <span
              aria-label={badgeText}
              className="relative inline-block text-[#39004D] text-sm sm:text-base font-bold tracking-tight"
            >
              <span aria-hidden className="invisible whitespace-nowrap">
                {badgeText}
              </span>
              <span aria-hidden className="absolute left-0 top-0 whitespace-nowrap">
                {badgeText.slice(0, typed)}
                <span
                  className={`hx-caret ${typed >= badgeText.length ? "hx-caret-done" : ""}`}
                />
              </span>
            </span>
            <span className="hx-bsheen pointer-events-none" />
          </div>
        </div>

        <div className="text-center max-w-5xl mx-auto mb-6 sm:mb-8 lg:mb-9">
          <div className="relative inline-block">
            <div className="hidden sm:block absolute -top-10 -left-[76px] animate-pulse-subtle pointer-events-none">
              <div className="relative h-16 w-14">
                <span
                  style={{ "--d": "0.55s" } as React.CSSProperties}
                  className="hx-ray absolute left-[15px] top-[53px] h-7 w-[7px] -translate-x-1/2 -translate-y-1/2 -rotate-[80deg] rounded-full bg-[#9416B7]"
                />
                <span
                  style={{ "--d": "0.67s" } as React.CSSProperties}
                  className="hx-ray absolute left-[25px] top-[28px] h-8 w-[7px] -translate-x-1/2 -translate-y-1/2 -rotate-[42deg] rounded-full bg-[#9416B7]"
                />
                <span
                  style={{ "--d": "0.79s" } as React.CSSProperties}
                  className="hx-ray absolute left-[47px] top-[13px] h-7 w-[7px] -translate-x-1/2 -translate-y-1/2 -rotate-[14deg] rounded-full bg-[#9416B7]"
                />
              </div>
            </div>

            <h1 className="text-[35px] sm:text-[52px] md:text-[62px] lg:text-[68px] xl:text-[72px] font-extrabold text-[#350047] tracking-[-0.035em] leading-[1.08] cursor-default">
              <span className="block">
                <span className="sr-only">{heroData.headingPart1}</span>
                <span aria-hidden="true">
                  {renderChars(heroData.headingPart1, 1, 0.1, 0.03)}
                </span>
              </span>

              <span className="block italic font-extrabold text-[#9214B7] tracking-[-0.025em] mt-1">
                <span className="relative inline-block">
                  <span className="sr-only">{heroData.headingPart2}</span>
                  <span aria-hidden="true">
                    {renderChars(heroData.headingPart2, 2, 0.4, 0.045, true)}
                  </span>

                  <svg
                    viewBox="0 0 300 14"
                    preserveAspectRatio="none"
                    aria-hidden
                    className="hx-underline pointer-events-none absolute left-[2%] -bottom-1 sm:-bottom-2 h-2 sm:h-3 w-[96%]"
                    style={{ "--d": `${underlineDelay}s` } as React.CSSProperties}
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
                    className="hx-spark pointer-events-none absolute -top-1 -right-4 sm:-top-3 sm:-right-9 h-4 w-4 sm:h-7 sm:w-7"
                    style={{ "--d": `${underlineDelay + 0.2}s` } as React.CSSProperties}
                  />
                  <SparkleSvg
                    className="hx-spark pointer-events-none absolute hidden sm:block bottom-2 -left-8 h-4 w-4"
                    style={{ "--d": `${underlineDelay + 1.1}s` } as React.CSSProperties}
                  />
                </span>
              </span>
            </h1>
          </div>
        </div>

        <div className="text-center max-w-[340px] sm:max-w-[700px] mx-auto px-2 sm:px-0 mb-7 sm:mb-10">
          <p className="text-[#414141] text-[15px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-medium leading-[1.6] sm:leading-[1.55] tracking-tight text-balance">
            {heroData.descriptionLines.map((line, idx) => {
              const lineWords = line.trim().split(/\s+/).filter(Boolean);
              return (
                <React.Fragment key={idx}>
                  <span className="inline sm:block">
                    {lineWords.map((w, wi) => (
                      <React.Fragment key={wi}>
                        <span
                          className="hx-word"
                          style={{
                            "--d": `${0.75 + idx * 0.3 + wi * 0.05}s`,
                          } as React.CSSProperties}
                        >
                          {w}
                        </span>
                        {wi < lineWords.length - 1 ? " " : ""}
                      </React.Fragment>
                    ))}
                  </span>
                  {idx < heroData.descriptionLines.length - 1 ? (
                    <span className="sm:hidden"> </span>
                  ) : null}
                </React.Fragment>
              );
            })}
          </p>
        </div>

        <div className="hx-strip w-full max-w-[1250px] mx-auto mb-6 sm:mb-7 md:drop-shadow-[0_8px_18px_rgba(65,0,85,0.09)]">
          <div
            style={{ "--notch-mask": NOTCH_MASK } as React.CSSProperties}
            className="flex flex-col gap-4 md:grid md:grid-cols-[323fr_586fr_344fr] md:gap-[6px] md:overflow-hidden md:rounded-[52px] md:border-[4px] md:border-white md:bg-white md:[-webkit-mask:var(--notch-mask)] md:[mask:var(--notch-mask)]"
          >
            {heroData.cards.map((card, index) => {
              const isFirst = index === 0;
              const isLast = index === lastIndex;
              const entrance = isFirst
                ? "hx-card-left"
                : isLast
                ? "hx-card-right"
                : "hx-card-center";

              return (
                <div
                  key={card.id}
                  className={`${entrance} group relative h-[340px] overflow-hidden rounded-[32px] border-[4px] border-white bg-white shadow-[0_5px_22px_rgba(65,0,85,0.08)] sm:h-[400px] md:h-[370px] md:rounded-[28px] md:border-0 md:shadow-none md:-skew-x-[9deg] lg:h-[395px] ${
                    isFirst ? "md:-ml-9 md:rounded-l-none" : ""
                  } ${isLast ? "md:-mr-9 md:rounded-r-none" : ""}`}
                >
                  <div className="absolute inset-0 md:-inset-x-10 md:skew-x-[9deg]">
                    <div
                      className="hx-par absolute inset-0"
                      style={{ "--k": index % 2 ? 7 : -7 } as React.CSSProperties}
                    >
                      <div
                        className={`hx-kb absolute inset-0 ${index % 2 ? "hx-kb-r" : ""}`}
                        style={{ animationDelay: `-${index * 5}s` }}
                      >
                        <Image
                          src={card.image}
                          alt={card.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 45vw"
                          priority
                          className="hx-img object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5 opacity-60" />
                    <div className="hx-card-sheen" />
                  </div>

                  {card.badges && card.badges.length > 0 && (
                    <div className="pointer-events-none absolute inset-0 z-20 md:skew-x-[9deg]">
                      <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2 sm:left-4 sm:top-4 md:left-[44px] xl:gap-[22px]">
                        {card.badges.map((b, bIdx) => {
                          const isDark = b.style === "dark";

                          return (
                            <div
                              key={bIdx}
                              style={{
                                animationDelay: `${1.15 + bIdx * 0.12}s`,
                              }}
                              className={`hx-pop pointer-events-auto relative inline-flex items-center gap-2 overflow-hidden rounded-full px-3.5 py-2 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(40,0,60,0.2)] backdrop-blur-sm transition-all duration-300 hover:scale-105 sm:text-sm lg:gap-2.5 lg:px-5 lg:py-3 lg:text-base ${
                                isDark ? "bg-[#52006D]" : "bg-[#9918C5]"
                              }`}
                            >
                              {b.icon === "paw" && (
                                <PawSvg
                                  size={17}
                                  fill="#FFFFFF"
                                  className="hx-wiggle h-4 w-4 lg:h-5 lg:w-5"
                                />
                              )}

                              {b.icon === "stethoscope" && (
                                <StethoscopeIcon className="h-4 w-4 text-white lg:h-5 lg:w-5" />
                              )}

                              <span>{b.text}</span>
                              <span
                                className="hx-bsheen pointer-events-none"
                                style={{ animationDelay: `${3 + bIdx * 1.3}s` }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
