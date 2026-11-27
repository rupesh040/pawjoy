"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import contentData from "@/data/content.json";
import { ContactData } from "@/data/type";

interface ContactProps {
  data?: ContactData;
}

const ANIMATION_CSS = `
.pj-root{--pj-ease:cubic-bezier(.22,1,.36,1);--pj-spring:cubic-bezier(.34,1.56,.64,1)}

.pj-reveal{opacity:0}
.pj-block[data-in="true"] .pj-reveal{
  opacity:1;
  animation-duration:.9s;
  animation-timing-function:var(--pj-ease);
  animation-fill-mode:backwards;
  animation-delay:var(--d,0ms);
}
.pj-block[data-in="true"] .pj-rise{animation-name:pj-rise}
.pj-block[data-in="true"] .pj-blur{animation-name:pj-blur;animation-duration:1s}
.pj-block[data-in="true"] .pj-left{animation-name:pj-left}
.pj-block[data-in="true"] .pj-pop{animation-name:pj-pop;animation-duration:1.1s}
.pj-block[data-in="true"] .pj-spring{animation-name:pj-spring;animation-duration:.8s;animation-timing-function:var(--pj-spring)}
.pj-block[data-in="true"] .pj-card{animation-name:pj-card;animation-duration:1.1s}
.pj-block[data-in="true"] .pj-line-l{animation-name:pj-line;animation-duration:.8s}
.pj-block[data-in="true"] .pj-line-r{animation-name:pj-line;animation-duration:.8s}
.pj-block[data-in="true"] .pj-grow{animation-name:pj-grow;animation-duration:.7s}
.pj-line-l{transform-origin:right center}
.pj-line-r{transform-origin:left center}
.pj-grow{transform-origin:top center}

@keyframes pj-rise{from{opacity:0;transform:translate3d(0,26px,0)}}
@keyframes pj-blur{from{opacity:0;transform:translate3d(0,16px,0);filter:blur(8px)}}
@keyframes pj-left{from{opacity:0;transform:translate3d(-36px,0,0)}}
@keyframes pj-pop{from{opacity:0;transform:translate3d(0,34px,0) scale(.92)}}
@keyframes pj-spring{from{opacity:0;transform:scale(.6)}}
@keyframes pj-card{from{opacity:0;transform:translate3d(0,56px,0) scale(.96)}}
@keyframes pj-line{from{opacity:0;transform:scaleX(0)}}
@keyframes pj-grow{from{opacity:0;transform:scaleY(0)}}

.pj-mask{
  display:inline-block;overflow:hidden;vertical-align:top;
  padding:.05em .06em .18em;margin:-.05em -.06em -.18em;
}
.pj-word{display:inline-block;transform:translate3d(0,135%,0) rotate(5deg);transform-origin:0 100%}
.pj-block[data-in="true"] .pj-word{
  transform:none;
  animation:pj-word 1s var(--pj-ease) var(--d,0ms) backwards;
}
@keyframes pj-word{from{transform:translate3d(0,135%,0) rotate(5deg)}}

.pj-hl{position:relative;display:inline-block;vertical-align:top;isolation:isolate}
.pj-hl-bar{
  position:absolute;left:-2%;right:-2%;bottom:.06em;height:.22em;border-radius:999px;
  background:linear-gradient(90deg,#F2D9FC,#E2A6F4);opacity:.8;z-index:-1;
  transform:scaleX(0);transform-origin:left center;
}
.pj-block[data-in="true"] .pj-hl-bar{
  transform:none;
  animation:pj-bar .9s var(--pj-ease) var(--d,0ms) backwards;
}
@keyframes pj-bar{from{transform:scaleX(0)}}

@supports ((-webkit-background-clip:text) or (background-clip:text)){
  .pj-shimmer{
    background-image:linear-gradient(100deg,#8B1EB7 0%,#8B1EB7 40%,#D456F2 50%,#8B1EB7 60%,#8B1EB7 100%);
    background-size:260% 100%;background-repeat:no-repeat;
    -webkit-background-clip:text;background-clip:text;
    -webkit-text-fill-color:transparent;color:transparent;
    animation:pj-shimmer 5.5s ease-in-out 1.8s infinite;
  }
}
@keyframes pj-shimmer{0%{background-position:0% 0}60%,100%{background-position:100% 0}}

.pj-paw-wiggle{transform-origin:50% 80%;animation:pj-wiggle 3.6s ease-in-out 1.6s infinite}
@keyframes pj-wiggle{
  0%,58%,100%{transform:rotate(0)}
  66%{transform:rotate(-16deg)}
  74%{transform:rotate(12deg)}
  82%{transform:rotate(-8deg)}
  90%{transform:rotate(3deg)}
}

.pj-row-icon{transition:transform .45s var(--pj-spring),background-color .3s,box-shadow .3s}
.pj-row-icon svg{transition:transform .5s var(--pj-spring)}
.pj-row:hover .pj-row-icon{transform:translateY(-2px) rotate(-6deg) scale(1.07);background-color:#EBD0F8;box-shadow:0 10px 22px rgba(120,0,158,.18)}
.pj-row:hover .pj-row-icon svg{transform:scale(1.08)}
.pj-row-text{transition:transform .45s var(--pj-ease)}
.pj-row:hover .pj-row-text{transform:translateX(6px)}
.pj-row-bar{transition:background-color .3s}
.pj-row:hover .pj-row-bar{background-color:#C94EE6}

.pj-shadow{
  position:absolute;left:18%;right:18%;bottom:-6px;height:14px;border-radius:50%;
  background:radial-gradient(ellipse at center,rgba(65,0,80,.22),transparent 70%);
}
.pj-img{transition:transform .6s var(--pj-spring)}
.pj-pets:hover .pj-img{transform:scale(1.04) rotate(-1deg)}

.pj-breathe{animation:pj-breathe 9s ease-in-out infinite}
@keyframes pj-breathe{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.14);opacity:.75}}
.pj-riser{position:absolute;bottom:18px;opacity:0;animation:pj-riser 10s ease-in-out infinite;will-change:transform,opacity}
@keyframes pj-riser{
  0%{opacity:0;transform:translate3d(0,0,0) rotate(-10deg)}
  15%{opacity:.5}
  50%{transform:translate3d(14px,-130px,0) rotate(8deg)}
  85%{opacity:.18}
  100%{opacity:0;transform:translate3d(-8px,-250px,0) rotate(-6deg)}
}

.pj-label{transition:color .3s}
.pj-field:focus-within .pj-label{color:#8B1EB7}
.pj-ico{transition:transform .4s var(--pj-spring),color .3s}
.pj-field:focus-within .pj-ico{transform:scale(1.18) rotate(-8deg);color:#A020C5}
.pj-chevron{transition:transform .35s var(--pj-ease)}
.pj-field:focus-within .pj-chevron{transform:rotate(180deg)}

.pj-btn{position:relative;overflow:hidden;isolation:isolate}
.pj-btn::after{
  content:"";position:absolute;top:0;bottom:0;left:0;width:40%;pointer-events:none;
  background:linear-gradient(100deg,transparent,rgba(255,255,255,.4),transparent);
  transform:translateX(-160%) skewX(-18deg);
}
.pj-btn:hover::after{animation:pj-sheen .9s var(--pj-ease) 1}
@keyframes pj-sheen{from{transform:translateX(-160%) skewX(-18deg)}to{transform:translateX(360%) skewX(-18deg)}}
.pj-send{transition:transform .45s var(--pj-spring)}
.pj-btn:hover .pj-send{transform:translate(5px,-5px) rotate(8deg)}
.pj-btn-done{animation:pj-ripple 1s ease-out 1}
@keyframes pj-ripple{0%{box-shadow:0 0 0 0 rgba(169,0,189,.45)}100%{box-shadow:0 0 0 24px rgba(169,0,189,0)}}

.pj-swap{display:grid;place-items:center;text-align:center}
.pj-swap>span{grid-area:1/1;transition:opacity .45s var(--pj-ease),transform .45s var(--pj-ease),filter .45s var(--pj-ease)}
.pj-out-up{opacity:0;transform:translateY(-60%);filter:blur(4px);pointer-events:none}
.pj-out-down{opacity:0;transform:translateY(60%);filter:blur(4px);pointer-events:none}

.pj-check{animation:pj-pop-in .5s var(--pj-spring) both}
.pj-check path{stroke-dasharray:1;stroke-dashoffset:1;animation:pj-draw .5s var(--pj-ease) .1s forwards}
@keyframes pj-pop-in{from{opacity:0;transform:scale(.4) rotate(-30deg)}}
@keyframes pj-draw{to{stroke-dashoffset:0}}

.pj-burst{position:absolute;left:50%;top:50%;width:0;height:0;pointer-events:none;z-index:20}
.pj-burst>span{
  position:absolute;left:0;top:0;opacity:0;
  animation:pj-burst 1.2s var(--pj-ease) var(--bd,0ms) forwards;
}
@keyframes pj-burst{
  0%{opacity:0;transform:translate(-50%,-50%) scale(.2) rotate(0)}
  15%{opacity:1}
  100%{opacity:0;transform:translate(calc(-50% + var(--tx)),calc(-50% + var(--ty))) scale(1) rotate(var(--r))}
}

@media (prefers-reduced-motion:reduce){
  .pj-root *,.pj-root *::before,.pj-root *::after{animation:none!important;transition:none!important}
  .pj-reveal{opacity:1!important}
  .pj-word,.pj-hl-bar{transform:none!important}
}
`;

const RISERS = [
  { left: "8%", size: 16, delay: "0s", dur: "9s" },
  { left: "22%", size: 12, delay: "2.5s", dur: "11s" },
  { left: "41%", size: 18, delay: "5s", dur: "10s" },
  { left: "63%", size: 13, delay: "1.2s", dur: "12s" },
  { left: "80%", size: 17, delay: "3.8s", dur: "9.5s" },
  { left: "93%", size: 11, delay: "6.5s", dur: "10.5s" },
];

const BURST = [
  { tx: -150, ty: -70, r: -35, s: 18 },
  { tx: -100, ty: -110, r: -15, s: 14 },
  { tx: -40, ty: -135, r: -8, s: 20 },
  { tx: 40, ty: -135, r: 8, s: 16 },
  { tx: 100, ty: -110, r: 15, s: 20 },
  { tx: 150, ty: -70, r: 35, s: 14 },
  { tx: -190, ty: -10, r: -50, s: 12 },
  { tx: 190, ty: -10, r: 50, s: 12 },
];

const delay = (ms: number) => ({ "--d": `${ms}ms` } as React.CSSProperties);

function useInView<T extends Element>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

function SplitWords({
  text,
  delayMs = 0,
  step = 80,
  highlight = false,
}: {
  text: string;
  delayMs?: number;
  step?: number;
  highlight?: boolean;
}) {
  const words = text.trim().split(/\s+/).filter(Boolean);

  return (
    <>
      {words.map((word, i) => {
        const wordDelay = delayMs + i * step;

        const masked = (
          <span className="pj-mask">
            <span className="pj-word" style={delay(wordDelay)}>
              {highlight ? <span className="pj-shimmer">{word}</span> : word}
            </span>
          </span>
        );

        return (
          <React.Fragment key={i}>
            {highlight ? (
              <span className="pj-hl">
                {masked}
                <i className="pj-hl-bar" style={delay(wordDelay + 350)} />
              </span>
            ) : (
              masked
            )}
            {i < words.length - 1 && " "}
          </React.Fragment>
        );
      })}
    </>
  );
}

function PawSvg({
  fill = "#DFCCF0",
  className = "",
  size = 20,
}: {
  fill?: string;
  className?: string;
  size?: number | string;
}) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} fill="none" className={className}>
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

function Icon({
  type,
  className = "",
}: {
  type: string;
  className?: string;
}) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
  };

  switch (type) {
    case "stethoscope":
      return (
        <svg {...common}>
          <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1" />
          <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4" />
          <circle cx="20" cy="10" r="2" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="m3 10 9-8 9 8v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 22v-9h6v9" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18M8 14h2v2H8zM14 14h2v2h-2z" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common}>
          <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" />
          <path d="M8 12h.01M12 12h.01M16 12h.01" />
        </svg>
      );
    case "send":
      return (
        <svg {...common}>
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="M22 2 11 13" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M20 6 9 17l-5-5" pathLength={1} />
        </svg>
      );
    default:
      return null;
  }
}

export default function Contact({ data: customData }: ContactProps) {
  const contactData =
    customData ||
    (contentData.PawJoy.sections.Contact.variants.PawJoyContact1 as ContactData);

  const [formData, setFormData] = useState({
    name: "",
    petName: "",
    date: "",
    time: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [minDate, setMinDate] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [leftRef, leftIn] = useInView<HTMLDivElement>();
  const [formRef, formIn] = useInView<HTMLDivElement>();

  useEffect(() => {
    setMinDate(new Date().toISOString().split("T")[0]);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (timerRef.current) clearTimeout(timerRef.current);
    setSubmitCount((c) => c + 1);
    setIsSubmitted(true);

    timerRef.current = setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  const inputClass =
    "w-full h-[54px] rounded-[15px] border border-[#E7C8F8] bg-[#FAF5FD]/80 pl-12 pr-4 text-[15px] text-[#35104D] placeholder:text-[#817687] outline-none transition-all duration-300 hover:border-[#D79BF0] focus:border-[#A020C5] focus:bg-white focus:ring-2 focus:ring-purple-100 focus:shadow-[0_10px_24px_rgba(160,32,197,0.14)]";

  const labelClass =
    "pj-label mb-1.5 block text-[16px] font-extrabold text-[#300044]";

  const headingGap =
    /\s$/.test(contactData.headingPart1) || /^\s/.test(contactData.headingHighlight)
      ? " "
      : "";
  const part1Words = contactData.headingPart1.trim().split(/\s+/).filter(Boolean).length;
  const HEADING_START = 250;
  const HEADING_STEP = 80;
  const descStart = HEADING_START + (part1Words + 2) * HEADING_STEP + 150;
  const rowsStart = descStart + contactData.descriptionLines.length * 110 + 80;

  return (
    <section
      id={contactData.id || "contact"}
      className="pj-root relative isolate w-full overflow-hidden bg-[#FFFCFF] pt-6 pb-14 sm:pt-8 sm:pb-16 lg:pt-5 lg:pb-16"
    >
      <style dangerouslySetInnerHTML={{ __html: ANIMATION_CSS }} />

      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#FCF8FF] via-white to-[#F8EFFF]" />

      <div className="pj-breathe absolute -right-24 -top-36 -z-10 h-[420px] w-[420px] rounded-full bg-[#F4E3FC]/60 blur-3xl" />

      <div className="pj-breathe absolute left-0 top-[55%] -z-10 h-40 w-40 rounded-full bg-[#F8EBFF]/60 blur-3xl [animation-delay:-4s]" />

      {contactData.backgroundPaws.map((paw, idx) => (
        <div
          key={idx}
          style={{
            top: paw.top,
            bottom: paw.bottom,
            left: paw.left,
            right: paw.right,
            transform: `rotate(${paw.rotate}deg)`,
            opacity: paw.opacity,
          }}
          className="absolute -z-10 pointer-events-none animate-float-slow"
        >
          <PawSvg size={paw.size} fill="#DFCCF0" />
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-0 -z-10 h-[225px] sm:h-[245px] lg:h-[230px] pointer-events-none">
        <svg
          viewBox="0 0 1500 250"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0 30 C180 80 260 120 400 100 C580 78 680 105 840 140 C1060 190 1200 150 1500 88 V250 H0 Z"
            fill="#C77DE0"
            fillOpacity="0.35"
          />
        </svg>

        <svg
          viewBox="0 0 1500 250"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0 48 C160 100 225 160 380 137 C550 115 650 140 820 177 C1030 230 1180 188 1500 125 V250 H0 Z"
            fill="#850b9c"
          />
        </svg>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[300px] overflow-hidden"
      >
        {RISERS.map((r, i) => (
          <span
            key={i}
            className="pj-riser"
            style={{ left: r.left, animationDelay: r.delay, animationDuration: r.dur }}
          >
            <PawSvg size={r.size} fill="#D9A0EE" />
          </span>
        ))}
      </div>

      <div className="absolute right-0 bottom-0 -z-20 h-[190px] w-full bg-[#EFD5FA]/60 [clip-path:polygon(100%_0,100%_100%,0_100%)]" />

      <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-start gap-9 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-8">
        <div
          ref={leftRef}
          data-in={leftIn ? "true" : "false"}
          className="pj-block relative flex min-w-0 flex-col justify-between self-stretch lg:col-span-5"
        >
          <div>
            <div className="mb-4 flex items-center gap-4">
              <span
                className="pj-reveal pj-line-l h-[2px] w-9 shrink-0 bg-[#8B1EB7] sm:w-12"
                style={delay(150)}
              />

              <div
                className="pj-reveal pj-spring inline-flex items-center gap-2 rounded-full border border-[#EBD3F8] bg-[#F1DDFB] px-4 py-2"
                style={delay(60)}
              >
                <PawSvg size={23} fill="#670087" className="pj-paw-wiggle" />
                <span className="whitespace-nowrap text-[17px] font-extrabold text-[#4A075F] sm:text-[19px]">
                  {contactData.tagline}
                </span>
              </div>

              <span
                className="pj-reveal pj-line-r h-[2px] w-9 shrink-0 bg-[#8B1EB7] sm:w-12"
                style={delay(150)}
              />
            </div>

            <h2 className="mb-3 text-[32px] font-extrabold leading-[1.13] tracking-[-1.2px] text-[#300044] sm:text-[38px] lg:text-[42px]">
              <span className="sr-only">
                {contactData.headingPart1}
                {contactData.headingHighlight}
              </span>
              <span aria-hidden="true">
                <SplitWords
                  text={contactData.headingPart1}
                  delayMs={HEADING_START}
                  step={HEADING_STEP}
                />
                {headingGap}
                <SplitWords
                  text={contactData.headingHighlight}
                  delayMs={HEADING_START + part1Words * HEADING_STEP}
                  step={HEADING_STEP}
                  highlight
                />
              </span>
            </h2>

            <div className="mb-7 space-y-0.5">
              {contactData.descriptionLines.map((line, idx) => (
                <p
                  key={idx}
                  style={delay(descStart + idx * 110)}
                  className="pj-reveal pj-blur text-[16px] font-medium leading-[1.55] text-[#625D67] sm:text-[18px]"
                >
                  {line}
                </p>
              ))}
            </div>

            <div className="relative z-10 mb-3 space-y-5">
              {contactData.scheduleHours.map((item, i) => (
                <div
                  key={item.id}
                  style={delay(rowsStart + i * 140)}
                  className="pj-row pj-reveal pj-left flex items-center gap-4"
                >
                  <div className="pj-row-icon flex h-[65px] w-[65px] shrink-0 items-center justify-center rounded-[17px] border border-[#EEDAF8] bg-[#F3E5FB] text-[#78009E]">
                    {item.icon === "stethoscope" ? (
                      <Icon type="stethoscope" className="h-9 w-9" />
                    ) : (
                      <Icon type="home" className="h-9 w-9" />
                    )}
                  </div>

                  <div
                    className="pj-row-bar pj-reveal pj-grow h-[57px] w-[3px] shrink-0 rounded-full bg-[#A12AC4]"
                    style={delay(rowsStart + i * 140 + 120)}
                  />

                  <div className="pj-row-text">
                    <h4 className="text-[21px] font-extrabold leading-tight tracking-tight text-[#4C075F] sm:text-[23px]">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-[15px] font-medium text-[#625D67] sm:text-[17px]">
                      {item.hours}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={delay(rowsStart + 300)}
            className="pj-pets pj-reveal pj-pop relative z-10 mt-6 w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] self-start lg:-ml-2"
          >
            <div className="pj-shadow" aria-hidden="true" />
            <div className="relative">
              <Image
                src={contactData.petsImage.src}
                alt={contactData.petsImage.alt}
                width={450}
                height={270}
                priority
                className="pj-img h-auto w-full object-contain object-bottom drop-shadow-[0_8px_12px_rgba(65,0,80,0.13)]"
                sizes="(max-width: 1024px) 90vw, 440px"
              />
            </div>
          </div>
        </div>

        <div
          ref={formRef}
          data-in={formIn ? "true" : "false"}
          className="pj-block relative z-10 min-w-0 lg:col-span-7"
        >
          <div
            style={delay(0)}
            className="pj-reveal pj-card rounded-[30px] border-2 border-[#E7C1F7] bg-white/90 p-5 shadow-[0_12px_40px_rgba(104,0,130,0.10)] sm:rounded-[36px] sm:p-7 lg:rounded-[40px] lg:p-9 xl:p-10"
          >
            <div className="mb-7 flex items-center justify-center gap-3 sm:mb-8">
              <span
                className="pj-reveal pj-line-l h-[2px] w-7 shrink-0 bg-[#8B1EB7] sm:w-12"
                style={delay(450)}
              />

              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className="pj-reveal pj-spring flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-gradient-to-br from-[#8D00A9] to-[#51006E] text-white"
                  style={delay(350)}
                >
                  <Icon type="calendar" className="h-6 w-6" />
                </div>

                <h3 className="whitespace-nowrap text-[19px] font-extrabold tracking-tight text-[#560071] sm:text-[25px] lg:text-[28px]">
                  <span className="sr-only">{contactData.formTitle}</span>
                  <span aria-hidden="true">
                    <SplitWords text={contactData.formTitle} delayMs={420} step={70} />
                  </span>
                </h3>
              </div>

              <span
                className="pj-reveal pj-line-r h-[2px] w-7 shrink-0 bg-[#8B1EB7] sm:w-12"
                style={delay(450)}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                <div className="pj-field pj-reveal pj-rise" style={delay(560)}>
                  <label htmlFor="pj-name" className={labelClass}>
                    {contactData.form.nameLabel}
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#71008F]">
                      <Icon type="user" className="pj-ico h-6 w-6" />
                    </span>

                    <input
                      id="pj-name"
                      type="text"
                      name="name"
                      required
                      placeholder={contactData.form.namePlaceholder}
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="pj-field pj-reveal pj-rise" style={delay(640)}>
                  <label htmlFor="pj-pet" className={labelClass}>
                    {contactData.form.petNameLabel}
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                      <PawSvg size={25} fill="#71008F" className="pj-ico" />
                    </span>

                    <input
                      id="pj-pet"
                      type="text"
                      name="petName"
                      required
                      placeholder={contactData.form.petNamePlaceholder}
                      value={formData.petName}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                <div className="pj-field pj-reveal pj-rise" style={delay(720)}>
                  <label htmlFor="pj-date" className={labelClass}>
                    {contactData.form.dateLabel}
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#71008F]">
                      <Icon type="calendar" className="pj-ico h-6 w-6" />
                    </span>

                    <input
                      id="pj-date"
                      type="date"
                      name="date"
                      required
                      min={minDate || undefined}
                      value={formData.date}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="pj-field pj-reveal pj-rise" style={delay(800)}>
                  <label htmlFor="pj-time" className={labelClass}>
                    {contactData.form.timeLabel}
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#71008F]">
                      <Icon type="clock" className="pj-ico h-6 w-6" />
                    </span>

                    <select
                      id="pj-time"
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className={`${inputClass} cursor-pointer appearance-none`}
                    >
                      <option value="" disabled>
                        {contactData.form.timePlaceholder}
                      </option>

                      {contactData.form.timeOptions.map((opt, idx) => (
                        <option key={idx} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#71008F]">
                      <svg viewBox="0 0 24 24" className="pj-chevron h-4 w-4 fill-current">
                        <path d="m6 9 6 6 6-6z" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              <div className="pj-field pj-reveal pj-rise" style={delay(880)}>
                <label htmlFor="pj-message" className={labelClass}>
                  {contactData.form.messageLabel}
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-5 top-4 text-[#71008F]">
                    <Icon type="chat" className="pj-ico h-6 w-6" />
                  </span>

                  <textarea
                    id="pj-message"
                    name="message"
                    rows={4}
                    placeholder={contactData.form.messagePlaceholder}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full resize-none rounded-[16px] border border-[#E7C8F8] bg-[#FAF5FD]/80 py-4 pl-16 pr-4 text-[15px] text-[#35104D] placeholder:text-[#817687] outline-none transition-all duration-300 hover:border-[#D79BF0] focus:border-[#A020C5] focus:bg-white focus:ring-2 focus:ring-purple-100 focus:shadow-[0_10px_24px_rgba(160,32,197,0.14)]"
                  />
                </div>
              </div>

              <div
                className="pj-reveal pj-rise relative flex justify-center pt-1"
                style={delay(980)}
              >
                {isSubmitted && (
                  <div key={submitCount} className="pj-burst" aria-hidden="true">
                    {BURST.map((b, i) => (
                      <span
                        key={i}
                        style={
                          {
                            "--tx": `${b.tx}px`,
                            "--ty": `${b.ty}px`,
                            "--r": `${b.r}deg`,
                            "--bd": `${i * 40}ms`,
                          } as React.CSSProperties
                        }
                      >
                        <PawSvg size={b.s} fill="#A900BD" />
                      </span>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  className={`pj-btn ${
                    isSubmitted ? "pj-btn-done" : ""
                  } flex min-h-[66px] w-full max-w-[435px] items-center justify-center gap-4 rounded-full bg-gradient-to-r from-[#A900BD] via-[#87009F] to-[#590078] px-7 py-4 text-[17px] font-extrabold text-white shadow-[0_7px_20px_rgba(113,0,143,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(113,0,143,0.35)] active:scale-[0.98] sm:text-[20px]`}
                >
                  <span className="pj-swap" aria-live="polite">
                    <span className={isSubmitted ? "pj-out-up" : ""}>
                      {contactData.form.submitButtonText}
                    </span>
                    <span
                      className={isSubmitted ? "" : "pj-out-down"}
                      aria-hidden={!isSubmitted}
                    >
                      {contactData.form.successMessage || "Appointment Submitted!"}
                    </span>
                  </span>

                  {isSubmitted ? (
                    <Icon type="check" className="pj-check h-7 w-7 shrink-0" />
                  ) : (
                    <Icon type="send" className="pj-send h-7 w-7 shrink-0" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}