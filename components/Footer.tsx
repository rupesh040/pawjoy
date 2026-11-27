"use client";
import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import contentData from "@/data/content.json";
import { FooterData } from "@/data/type";
 
interface FooterProps {
  data?: FooterData;
}
const InViewContext = createContext(false);
function useInView<T extends Element>(threshold = 0.12) {
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
const TRANSITION =
  "transition-[opacity,transform,translate,scale,filter] motion-reduce:transition-none";
const REDUCED =
  "motion-reduce:opacity-100 motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:blur-[0px]";
 
type VariantKey =
  | "rise"
  | "blur"
  | "left"
  | "pop"
  | "spring"
  | "lineL"
  | "lineR"
  | "growY"
  | "peek";
 
const VARIANTS: Record<VariantKey, { base: string; hidden: string; shown: string }> = {
  rise: {
    base: "duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)]",
    hidden: "opacity-0 translate-y-6",
    shown: "opacity-100 translate-y-0",
  },
  blur: {
    base: "duration-[1000ms] ease-[cubic-bezier(.22,1,.36,1)]",
    hidden: "opacity-0 translate-y-3.5 blur-[8px]",
    shown: "opacity-100 translate-y-0 blur-[0px]",
  },
  left: {
    base: "duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)]",
    hidden: "opacity-0 -translate-x-8",
    shown: "opacity-100 translate-x-0",
  },
  pop: {
    base: "duration-[1000ms] ease-[cubic-bezier(.22,1,.36,1)]",
    hidden: "opacity-0 translate-y-8 scale-95",
    shown: "opacity-100 translate-y-0 scale-100",
  },
  spring: {
    base: "duration-[800ms] ease-[cubic-bezier(.34,1.56,.64,1)]",
    hidden: "opacity-0 scale-50",
    shown: "opacity-100 scale-100",
  },
  lineL: {
    base: "origin-left duration-[1100ms] ease-[cubic-bezier(.22,1,.36,1)]",
    hidden: "opacity-0 scale-x-0",
    shown: "opacity-100 scale-x-100",
  },
  lineR: {
    base: "origin-right duration-[1100ms] ease-[cubic-bezier(.22,1,.36,1)]",
    hidden: "opacity-0 scale-x-0",
    shown: "opacity-100 scale-x-100",
  },
  growY: {
    base: "origin-top duration-[700ms] ease-[cubic-bezier(.22,1,.36,1)]",
    hidden: "opacity-0 scale-y-0",
    shown: "opacity-100 scale-y-100",
  },
  peek: {
    base: "duration-[1200ms] ease-[cubic-bezier(.22,1.18,.36,1)]",
    hidden:
      "opacity-0 translate-y-8 lg:translate-y-[105%] lg:motion-reduce:translate-y-0",
    shown: "opacity-100 translate-y-0",
  },
};
function Reveal({
  variant,
  delay = 0,
  as = "div",
  className = "",
  children,
}: {
  variant: VariantKey;
  delay?: number;
  as?: "div" | "p" | "span";
  className?: string;
  children?: React.ReactNode;
}) {
  const inView = useContext(InViewContext);
  const v = VARIANTS[variant];
  const Tag = as as React.ElementType;
 
  return (
    <Tag
      className={`${TRANSITION} ${v.base} ${
        inView ? v.shown : `${v.hidden} ${REDUCED}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
function SplitWords({
  text,
  delayMs = 0,
  step = 90,
  shimmer = false,
  underlineLast = false,
}: {
  text: string;
  delayMs?: number;
  step?: number;
  shimmer?: boolean;
  underlineLast?: boolean;
}) {
  const inView = useContext(InViewContext);
  const words = text.trim().split(/\s+/).filter(Boolean);
 
  return (
    <>
      {words.map((word, i) => {
        const wordDelay = delayMs + i * step;
        const isLast = i === words.length - 1;
 
        const masked = (
          <span className="-mx-[0.06em] -mt-[0.06em] -mb-[0.2em] inline-block overflow-hidden px-[0.06em] pt-[0.06em] pb-[0.2em] align-top">
            <span
              className={`inline-block origin-bottom-left transition-transform duration-[1000ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${
                inView
                  ? "translate-y-0 rotate-0"
                  : "translate-y-[135%] rotate-[4deg] motion-reduce:translate-y-0 motion-reduce:rotate-0"
              }`}
              style={{ transitionDelay: `${wordDelay}ms` }}
            >
              {shimmer ? (
                <span
                  className={`bg-[image:linear-gradient(100deg,#fff_0%,#fff_40%,#EDA6FF_50%,#fff_60%,#fff_100%)] bg-[length:260%_100%] bg-no-repeat bg-clip-text text-transparent transition-[background-position] duration-[1800ms] ease-in-out motion-reduce:transition-none ${
                    inView ? "bg-[position:0%_0]" : "bg-[position:100%_0]"
                  }`}
                  style={{ transitionDelay: `${2200 + i * 170}ms` }}
                >
                  {word}
                </span>
              ) : (
                word
              )}
            </span>
          </span>
        );
 
        return (
          <React.Fragment key={i}>
            {underlineLast && isLast ? (
              <span className="relative inline-block align-top">
                {masked}
                <svg
                  className="pointer-events-none absolute inset-x-0 -bottom-[0.14em] h-[0.3em] w-full overflow-visible"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 7 Q14 1 26 7 T50 7 T74 7 T98 7"
                    pathLength={1}
                    stroke="#F1B8FF"
                    strokeWidth={3.2}
                    strokeLinecap="round"
                    strokeDasharray={1}
                    className={`transition-[stroke-dashoffset] duration-[1000ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${
                      inView
                        ? "[stroke-dashoffset:0]"
                        : "[stroke-dashoffset:1] motion-reduce:[stroke-dashoffset:0]"
                    }`}
                    style={{ transitionDelay: `${wordDelay + 550}ms` }}
                  />
                </svg>
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
function ChevronUpIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}
 
function InstagramIcon({ className = "" }: { className?: string }) {
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
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
 
function MailIcon({ className = "" }: { className?: string }) {
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
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
export default function Footer({ data: customData }: FooterProps) {
  const footerData =
    customData ||
    (contentData.PawJoy.sections.Footer.variants.PawJoyFooter1 as FooterData);
 
  const [ref, inView] = useInView<HTMLElement>();
 
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const HEADING_START = 800;
  const HEADING_STEP = 90;
  const headingWords = footerData.ctaHeading.trim().split(/\s+/).filter(Boolean).length;
  const contactStart = HEADING_START + headingWords * HEADING_STEP + 250;
  const contactCount = footerData.contactItems.length;
  const copyrightDelay = contactStart + contactCount * 240 + 150;
  const midLinkIndex = Math.ceil(footerData.quickLinks.length / 2);
  const leftQuickLinks = footerData.quickLinks.slice(0, midLinkIndex);
  const rightQuickLinks = footerData.quickLinks.slice(midLinkIndex);
 
  return (
    <footer
      ref={ref}
      className="relative isolate -mt-4 w-full overflow-hidden bg-[#850b9c] pt-0 pb-8 text-white sm:-mt-6 lg:-mt-8 lg:pb-[88px]"
    >
      <InViewContext.Provider value={inView}>
        <div className="pointer-events-none absolute -right-24 top-16 -z-10 h-[360px] w-[360px] rounded-full bg-white/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 -z-10 h-[300px] w-[300px] rounded-full bg-[#c040e0]/20 blur-3xl" />
        <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-10">
          <div className="relative flex items-center gap-1.5 pt-7 sm:pt-11 lg:pt-[54px]">
            <div className="relative flex-1">
              <Reveal
                variant="left"
                className="absolute bottom-1.5 left-0 shrink-0 sm:bottom-2"
              >
                <Link
                  href={footerData.logoHref || "/"}
                  className="inline-block transition-transform duration-300 hover:scale-105"
                >
                  <Image
                    src={footerData.logo}
                    alt={footerData.logoAlt}
                    width={230}
                    height={66}
                    className="h-9 w-auto object-contain sm:h-14 lg:h-[64px]"
                    priority
                  />
                </Link>
              </Reveal>
              <Reveal variant="lineL" delay={200} className="h-[2px] w-full bg-white/95" />
            </div>

            <Reveal variant="spring" delay={700} className="shrink-0">
              <button
                type="button"
                onClick={scrollToTop}
                aria-label={footerData.scrollToTopAriaLabel || "Scroll to top"}
                className="group flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-[#850b9c] shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80 active:scale-95 sm:h-[38px] sm:w-[38px]"
              >
                <ChevronUpIcon className="h-5 w-5 text-[#850b9c] transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:-translate-y-0.5" />
              </button>
            </Reveal>

            <div className="relative flex-1">
              <div className="absolute bottom-1.5 right-0 flex items-center gap-4 sm:bottom-2 sm:gap-5">
                {footerData.socialLinks.map((social, i) => (
                  <Reveal key={social.name} variant="spring" delay={120 + i * 100}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="relative flex h-7 w-7 items-center justify-center text-white transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] before:absolute before:-inset-[7px] before:scale-50 before:rounded-full before:bg-white/[0.18] before:opacity-0 before:transition-[transform,opacity] before:duration-[400ms] before:ease-[cubic-bezier(.34,1.56,.64,1)] before:content-[''] hover:-translate-y-[3px] hover:-rotate-[8deg] hover:scale-110 hover:before:scale-100 hover:before:opacity-100 focus-visible:-translate-y-[3px] focus-visible:before:scale-100 focus-visible:before:opacity-100 sm:h-8 sm:w-8"
                    >
                      {social.icon === "instagram" && (
                        <InstagramIcon className="relative h-full w-full" />
                      )}
                      {social.icon === "facebook" && (
                        <FacebookIcon className="relative h-full w-full" />
                      )}
                    </a>
                  </Reveal>
                ))}
              </div>
              <Reveal variant="lineR" delay={200} className="h-[2px] w-full bg-white/95" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-6 pt-8 text-center lg:flex-row lg:items-start lg:gap-10 lg:pt-9 lg:text-left">
            <div className="grid w-fit gap-6 sm:contents">
            <div>
              <Reveal
                as="p"
                variant="blur"
                delay={520}
                className="text-[14px] font-medium leading-[1.65] text-white sm:text-[15px] xl:text-[17px]"
              >
                {footerData.tagline}
              </Reveal>
              <Reveal
                as="p"
                variant="blur"
                delay={640}
                className="text-[14px] font-medium leading-[1.65] text-white sm:text-[15px] xl:text-[17px]"
              >
                {footerData.location}
              </Reveal>
            </div>
 
            <nav className="grid w-0 min-w-full grid-cols-[1fr_auto_1fr] items-stretch gap-x-6 sm:flex sm:w-auto sm:min-w-0 sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-5 sm:gap-y-3 lg:justify-end lg:pt-1 xl:gap-x-7">
              {[
                { links: leftQuickLinks, offset: 0 },
                { links: rightQuickLinks, offset: midLinkIndex },
              ].map((group, colIdx) => (
                <React.Fragment key={colIdx}>
                  {colIdx > 0 && (
                    <Reveal
                      variant="growY"
                      delay={650}
                      className="w-[1.5px] shrink-0 self-stretch bg-gradient-to-b from-white/0 via-white to-white/0 sm:hidden"
                    />
                  )}
                  <div className="flex flex-col gap-y-3 text-left sm:contents">
                    {group.links.map((link, i) => (
                      <Reveal key={link.name} variant="rise" delay={580 + (group.offset + i) * 60}>
                        <Link
                          href={link.href}
                          className="relative inline-block rounded text-[14px] font-medium text-white transition-transform duration-300 after:absolute after:inset-x-0 after:-bottom-[5px] after:h-0.5 after:origin-right after:scale-x-0 after:rounded-sm after:bg-white after:transition-transform after:duration-500 after:ease-[cubic-bezier(.22,1,.36,1)] after:content-[''] hover:-translate-y-0.5 hover:after:origin-left hover:after:scale-x-100 focus-visible:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80 focus-visible:after:origin-left focus-visible:after:scale-x-100 xl:text-[16px]"
                        >
                          {link.name}
                        </Link>
                      </Reveal>
                    ))}
                  </div>
                </React.Fragment>
              ))}
            </nav>
            </div>
          </div>
          <div className="relative z-10 mt-14 flex flex-col items-center justify-center text-center lg:mt-[84px]">
            <h2 className="mb-7 text-[32px] font-extrabold leading-[1.15] tracking-tight text-white sm:mb-8 sm:text-[44px] lg:text-[52px] xl:text-[56px]">
              <span className="sr-only">{footerData.ctaHeading}</span>
              <span aria-hidden="true">
                <SplitWords
                  text={footerData.ctaHeading}
                  delayMs={HEADING_START}
                  step={HEADING_STEP}
                  shimmer
                  underlineLast
                />
              </span>
            </h2>
 
            <div className="mx-auto flex w-fit flex-col items-start justify-center gap-5 sm:w-auto sm:flex-row sm:items-center sm:gap-10 lg:gap-14">
              {footerData.contactItems.map((item, idx) => {
                const isLast = idx === contactCount - 1;
                const base = contactStart + idx * 240;
 
                return (
                  <React.Fragment key={idx}>
                    <Reveal variant="pop" delay={base}>
                      <a
                        href={item.href}
                        className="group inline-flex items-center gap-4 rounded-2xl transition-transform duration-[400ms] ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-[3px] focus-visible:-translate-y-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-white/80 sm:gap-5"
                      >
                        <span className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[14px] bg-[#E9D4F3] text-[#5A0A74] transition-all duration-[450ms] ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:-rotate-6 group-hover:scale-[1.07] group-hover:bg-white group-hover:shadow-[0_10px_22px_rgba(40,0,55,0.28)] group-focus-visible:-rotate-6 group-focus-visible:scale-[1.07] group-focus-visible:bg-white sm:h-[55px] sm:w-[55px]">
                          {item.icon === "mail" && (
                            <MailIcon className="h-6 w-6 transition-transform duration-[400ms] ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:-translate-y-0.5 group-hover:scale-110 sm:h-7 sm:w-7" />
                          )}
                          {item.icon === "phone" && (
                            <PhoneIcon className="h-6 w-6 transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:-rotate-[14deg] group-hover:scale-110 sm:h-7 sm:w-7" />
                          )}
                        </span>
                        <span className="bg-[image:linear-gradient(currentColor,currentColor)] bg-no-repeat pb-[3px] text-[18px] font-medium text-white transition-[background-size] duration-[450ms] ease-[cubic-bezier(.22,1,.36,1)] [background-position:0_100%] [background-size:0%_2px] group-hover:[background-size:100%_2px] group-focus-visible:[background-size:100%_2px] sm:text-[22px] lg:text-[26px]">
                          {item.value}
                        </span>
                      </a>
                    </Reveal>
 
                    {!isLast && (
                      <Reveal
                        variant="growY"
                        delay={base + 120}
                        className="hidden h-[52px] w-[2px] bg-white/90 sm:block"
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          <Reveal
            variant="peek"
            delay={1000}
            className="pointer-events-none z-0 mx-auto mt-10 w-[220px] sm:w-[260px] lg:absolute lg:bottom-0 lg:left-0 lg:mx-0 lg:mt-0 lg:w-[280px] xl:w-[360px] 2xl:w-[430px]"
          >
            <Image
              src={footerData.petsImage.src}
              alt={footerData.petsImage.alt}
              width={295}
              height={220}
              className="h-auto w-full object-contain drop-shadow-xl"
              priority
            />
          </Reveal>
          <Reveal
            as="p"
            variant="blur"
            delay={copyrightDelay}
            className="relative z-10 mt-6 text-center text-[13px] font-normal text-white/90 sm:text-[15px] lg:mt-[118px] lg:text-[17px]"
          >
            {footerData.copyright}
          </Reveal>
        </div>
      </InViewContext.Provider>
    </footer>
  );
}
