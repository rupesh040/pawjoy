"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import contentData from "@/data/content.json";
import { AboutData } from "@/data/type";

interface AboutProps {
  data?: AboutData;
}

function PawSvg({
  fill = "#8B1EB7",
  className = "",
  size = 32,
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

function ImageCard({
  side,
  src,
  alt,
  className = "",
  delay,
}: {
  side: "left" | "right";
  src: string;
  alt: string;
  className?: string;
  delay: number;
}) {
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", String((0.5 - y) * 10));
    el.style.setProperty("--ry", String((x - 0.5) * 12));
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

  const l = side === "left";

  return (
    <div
      className={`ab-rv ${l ? "ab-img-l" : "ab-img-r"} ${className}`}
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
    >
      <div className={`ab-par ${l ? "ab-par-l" : "ab-par-r"}`}>
        <div
          className={`ab-float ${l ? "ab-float-l" : "ab-float-r"}`}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
        >
          <div className="ab-card relative aspect-[7/8] rounded-[26px] sm:rounded-[30px] overflow-hidden bg-purple-50 shadow-[0_8px_30px_rgba(58,0,78,0.06)] hover:shadow-[0_26px_55px_rgba(58,0,78,0.22)]">
            <div className="ab-media absolute inset-0">
              <div className="ab-photo absolute inset-0">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 32vw"
                  className="object-cover object-center"
                />
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 transition-opacity duration-500 ab-hover-fade" />
            <div className="ab-spot pointer-events-none absolute inset-0" />
            <div className="ab-sheen pointer-events-none absolute inset-y-0 -left-1/2 w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function About({ data: customData }: AboutProps) {
  const aboutData =
    customData ||
    (contentData.PawJoy.sections.About.variants.PawJoyAbout1 as AboutData);

  const sectionRef = useRef<HTMLElement>(null);
  const burstId = useRef(0);
  const [inView, setInView] = useState(false);
  const [bursts, setBursts] = useState<
    { id: number; parts: { a: number; r: number }[] }[]
  >([]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
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
  }, []);

  const burstPaws = () => {
    const id = ++burstId.current;
    const n = 8;
    const parts = Array.from({ length: n }, (_, i) => ({
      a: (360 / n) * i + Math.random() * 25,
      r: 42 + Math.random() * 34,
    }));
    setBursts((b) => [...b, { id, parts }]);
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1000);
  };

  const d = (ms: number) => ({ "--d": `${ms}ms` } as React.CSSProperties);

  const renderWords = (text: string, startIdx: number, highlight = false) =>
    text
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((w, i) => (
        <React.Fragment key={`${startIdx}-${i}`}>
          <span className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]">
            <span className="ab-rv ab-word inline-block" style={d(620 + (startIdx + i) * 100)}>
              <span className={highlight ? "ab-shine" : ""}>{w}</span>
            </span>
          </span>{" "}
        </React.Fragment>
      ));

  const part1Words = aboutData.headingPart1.trim().split(/\s+/).filter(Boolean).length;
  const prefixWords = aboutData.headingPart2Prefix.trim().split(/\s+/).filter(Boolean).length;

  return (
    <section
      ref={sectionRef}
      id={aboutData.id || "about"}
      className={`ab-root relative w-full bg-white py-16 sm:py-20 lg:py-24 overflow-hidden ${
        inView ? "ab-in" : ""
      }`}
    >
      <div className="max-w-[1500px] mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1fr)] gap-8 lg:gap-10 items-start">
          <ImageCard
            side="left"
            src={aboutData.leftImage.src}
            alt={aboutData.leftImage.alt}
            delay={150}
            className="order-2 lg:order-1 w-full max-w-md mx-auto lg:max-w-none"
          />

          <div className="order-1 lg:order-2 flex flex-col items-center text-center px-2 sm:px-4 lg:pt-1">
            <div
              className="ab-rv ab-paw relative mb-2 cursor-pointer select-none"
              style={d(250)}
              onClick={burstPaws}
            >
              <div className="ab-paw-hover">
                <div className="ab-paw-idle">
                  <PawSvg size={36} fill="#8B1EB7" className="w-8 h-8 sm:w-9 sm:h-9" />
                </div>
              </div>
              {bursts.map((b) =>
                b.parts.map((p, i) => (
                  <span
                    key={`${b.id}-${i}`}
                    className="ab-burst pointer-events-none absolute left-1/2 top-1/2 -ml-[7px] -mt-[7px]"
                    style={{ "--a": `${p.a}deg`, "--r": `${p.r}px` } as React.CSSProperties}
                  >
                    <PawSvg size={14} fill="#8B1EB7" />
                  </span>
                ))
              )}
            </div>

            <div className="flex items-center justify-center gap-4 w-full">
              <span
                className="ab-rv ab-line-l w-8 sm:w-[52px] h-[1.5px] bg-[#8B1EB7] rounded-full"
                style={d(400)}
              />
              <span
                aria-label={aboutData.tagline}
                className="text-[#2E004F] font-bold text-lg sm:text-xl lg:text-2xl tracking-tight"
              >
                <span aria-hidden>
                  {Array.from(aboutData.tagline).map((ch, i) => (
                    <span
                      key={i}
                      className="ab-rv ab-char inline-block"
                      style={d(450 + i * 45)}
                    >
                      {ch === " " ? "\u00A0" : ch}
                    </span>
                  ))}
                </span>
              </span>
              <span
                className="ab-rv ab-line-r w-8 sm:w-[52px] h-[1.5px] bg-[#8B1EB7] rounded-full"
                style={d(400)}
              />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#2E004F] tracking-tight leading-[1.2] mt-5 mb-5 sm:mb-6">
              {renderWords(aboutData.headingPart1, 0)}
              <br />
              {renderWords(aboutData.headingPart2Prefix, part1Words)}
              {renderWords(
                aboutData.headingHighlight,
                part1Words + prefixWords,
                true
              )}
            </h2>

            <div className="group flex justify-center w-full py-3 -my-3 mb-3 sm:mb-4">
              <span
                className="ab-rv ab-divider block h-[2px] bg-[#8B1EB7] rounded-full w-24 sm:w-[134px] transition-[width] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:w-52"
                style={d(1050)}
              />
            </div>

            <p
              className="ab-rv ab-para text-[#4A2E5B] text-sm sm:text-base lg:text-[16.5px] font-medium leading-relaxed max-w-sm sm:max-w-[540px] mx-auto"
              style={d(1150)}
            >
              {aboutData.description}
            </p>
          </div>

          <ImageCard
            side="right"
            src={aboutData.rightImage.src}
            alt={aboutData.rightImage.alt}
            delay={300}
            className="order-3 lg:order-3 w-full max-w-md mx-auto lg:max-w-none"
          />
        </div>
      </div>

      <style jsx global>{`
        .ab-root {
          --amp: 14px;
        }
        @media (min-width: 1024px) {
          .ab-root {
            --amp: 30px;
          }
        }

        .ab-root:not(.ab-in) .ab-rv {
          opacity: 0;
        }

        .ab-in .ab-img-l {
          animation: ab-wipe-l 1.4s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms)
            backwards;
        }
        .ab-in .ab-img-r {
          animation: ab-wipe-r 1.4s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms)
            backwards;
        }
        @keyframes ab-wipe-l {
          from {
            opacity: 0;
            transform: translate3d(-70px, 0, 0) rotate(-3deg) scale(0.92);
            clip-path: inset(0 100% 0 0 round 30px);
          }
          to {
            opacity: 1;
            transform: none;
            clip-path: inset(0 0 0 0 round 30px);
          }
        }
        @keyframes ab-wipe-r {
          from {
            opacity: 0;
            transform: translate3d(70px, 0, 0) rotate(3deg) scale(0.92);
            clip-path: inset(0 0 0 100% round 30px);
          }
          to {
            opacity: 1;
            transform: none;
            clip-path: inset(0 0 0 0 round 30px);
          }
        }

        .ab-in .ab-media {
          animation: ab-settle 1.9s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms)
            backwards;
        }
        @keyframes ab-settle {
          from {
            transform: scale(1.4);
          }
          to {
            transform: scale(1);
          }
        }

        .ab-par {
          will-change: transform;
        }
        .ab-par-l {
          transform: translate3d(0, calc(var(--p, 0) * var(--amp) * 1), 0);
        }
        .ab-par-r {
          transform: translate3d(0, calc(var(--p, 0) * var(--amp) * -1), 0);
        }

        .ab-in .ab-float-l {
          animation: ab-float 7s ease-in-out 1.9s infinite;
        }
        .ab-in .ab-float-r {
          animation: ab-float 8s ease-in-out 2.3s infinite reverse;
        }
        @keyframes ab-float {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -9px, 0);
          }
        }

        .ab-card {
          transform: perspective(1000px) rotateX(calc(var(--rx, 0) * 1deg))
            rotateY(calc(var(--ry, 0) * 1deg)) translateY(var(--lift, 0px));
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.5s ease;
          will-change: transform;
        }
        .ab-float:hover .ab-card {
          --lift: -8px;
        }
        .ab-photo {
          transform: translate3d(
              calc(var(--mx, 0) * -10px),
              calc(var(--my, 0) * -10px),
              0
            )
            scale(var(--zoom, 1.06));
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ab-float:hover .ab-photo {
          --zoom: 1.12;
        }
        .ab-float:hover .ab-hover-fade {
          opacity: 1;
        }
        .ab-spot {
          opacity: 0;
          background: radial-gradient(
            circle at var(--sx, 50%) var(--sy, 50%),
            rgba(255, 255, 255, 0.38),
            rgba(255, 255, 255, 0) 55%
          );
          mix-blend-mode: soft-light;
          transition: opacity 0.5s ease;
        }
        .ab-float:hover .ab-spot {
          opacity: 1;
        }
        .ab-sheen {
          background: linear-gradient(
            100deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transform: translateX(-120%) skewX(-18deg);
          opacity: 0;
        }
        .ab-float:hover .ab-sheen {
          opacity: 1;
          animation: ab-sheen 1s ease-out;
        }
        @keyframes ab-sheen {
          from {
            transform: translateX(-120%) skewX(-18deg);
          }
          to {
            transform: translateX(520%) skewX(-18deg);
          }
        }

        .ab-in .ab-paw {
          animation: ab-paw-in 1s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0ms)
            backwards;
        }
        @keyframes ab-paw-in {
          from {
            opacity: 0;
            transform: scale(0) rotate(-200deg);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .ab-paw-hover {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .ab-paw:hover .ab-paw-hover {
          transform: scale(1.18) rotate(-8deg);
        }
        .ab-paw:active .ab-paw-hover {
          transform: scale(0.9);
        }
        .ab-paw-idle {
          transform-origin: 50% 70%;
          animation: ab-wiggle 4.5s ease-in-out 2.2s infinite;
        }
        @keyframes ab-wiggle {
          0%,
          70%,
          100% {
            transform: rotate(0deg);
          }
          76% {
            transform: rotate(-14deg) scale(1.08);
          }
          84% {
            transform: rotate(12deg) scale(1.08);
          }
          92% {
            transform: rotate(-6deg);
          }
        }
        .ab-burst {
          animation: ab-burst 0.95s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes ab-burst {
          from {
            opacity: 1;
            transform: rotate(var(--a)) translateX(0) rotate(calc(var(--a) * -1))
              scale(0.3);
          }
          to {
            opacity: 0;
            transform: rotate(var(--a)) translateX(var(--r))
              rotate(calc(var(--a) * -1 + 50deg)) scale(1.1);
          }
        }

        .ab-in .ab-line-l,
        .ab-in .ab-line-r {
          animation: ab-line 0.9s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms)
            backwards;
        }
        .ab-line-l {
          transform-origin: right center;
        }
        .ab-line-r {
          transform-origin: left center;
        }
        @keyframes ab-line {
          from {
            opacity: 0;
            transform: scaleX(0);
          }
          to {
            opacity: 1;
            transform: scaleX(1);
          }
        }
        .ab-in .ab-char {
          animation: ab-char 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0ms)
            backwards;
        }
        @keyframes ab-char {
          from {
            opacity: 0;
            transform: translate3d(0, 16px, 0) rotate(8deg);
            filter: blur(3px);
          }
          to {
            opacity: 1;
            transform: none;
            filter: blur(0);
          }
        }

        .ab-word {
          transform-origin: left bottom;
        }
        .ab-in .ab-word {
          animation: ab-word 0.95s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms)
            backwards;
        }
        @keyframes ab-word {
          from {
            opacity: 0;
            transform: translate3d(0, 115%, 0) rotate(6deg);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .ab-shine {
          background: linear-gradient(
            100deg,
            #8b1eb7 0%,
            #8b1eb7 40%,
            #cf55f5 50%,
            #8b1eb7 60%,
            #8b1eb7 100%
          );
          background-size: 250% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: ab-shine 5s ease-in-out 2.4s infinite;
        }
        @keyframes ab-shine {
          0% {
            background-position: 100% 0;
          }
          55%,
          100% {
            background-position: -50% 0;
          }
        }

        .ab-in .ab-divider {
          animation: ab-divider 0.9s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms)
            backwards;
        }
        @keyframes ab-divider {
          from {
            opacity: 0;
            transform: scaleX(0);
          }
          to {
            opacity: 1;
            transform: scaleX(1);
          }
        }
        .ab-in .ab-para {
          animation: ab-para 1s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms)
            backwards;
        }
        @keyframes ab-para {
          from {
            opacity: 0;
            transform: translate3d(0, 18px, 0);
            filter: blur(6px);
          }
          to {
            opacity: 1;
            transform: none;
            filter: blur(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ab-rv,
          .ab-media,
          .ab-float,
          .ab-paw-idle,
          .ab-shine,
          .ab-float:hover .ab-sheen {
            opacity: 1 !important;
            animation: none !important;
          }
          .ab-card,
          .ab-photo {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}