"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import contentData from "@/data/content.json";
import { GalleryData } from "@/data/type";

const MAX_ROTATE = 38;
const MAX_SCALE = 0.16;
const MAX_LIFT = 0;
const PERSPECTIVE = 900;

const PAD = 28;
const GAP = 6;

const AUTOPLAY_MS = 3200;
const INTERACTION_PAUSE_MS = 5000;
const PARALLAX_SHIFT = 9;

interface GalleryProps {
  data?: GalleryData;
}

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

function ChevronLeftIcon({ className = "" }: { className?: string }) {
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
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon({ className = "" }: { className?: string }) {
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
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function Gallery({ data: customData }: GalleryProps) {
  const galleryData =
    customData ||
    (contentData.PawJoy.sections.Gallery.variants.PawJoyGallery1 as GalleryData);

  const items = galleryData.items;
  const count = items.length;
  const totalDots = galleryData.pagination.totalDots;

  const loopItems = [...items, ...items, ...items];

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);

  const visibleRef = useRef(false);
  const hoverRef = useRef(false);
  const resumeAtRef = useRef(0);

  const [inView, setInView] = useState(false);
  const [activeDot, setActiveDot] = useState<number>(
    galleryData.pagination.activeDotIndex
  );

  const pauseAutoplay = useCallback((ms = INTERACTION_PAUSE_MS) => {
    resumeAtRef.current = Date.now() + ms;
  }, []);

  const getMetrics = useCallback(() => {
    const first = itemRefs.current[0];
    const second = itemRefs.current[1];
    const nextSet = itemRefs.current[count];
    if (!first || !second || !nextSet) return null;
    return {
      origin: first.offsetLeft,
      stride: second.offsetLeft - first.offsetLeft,
      setW: nextSet.offsetLeft - first.offsetLeft,
    };
  }, [count]);

  const applyCurve = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const half = track.clientWidth / 2;
    const viewCenter = track.scrollLeft + half;

    itemRefs.current.forEach((el) => {
      if (!el) return;
      const itemCenter = el.offsetLeft + el.offsetWidth / 2;
      const raw = (itemCenter - viewCenter) / half;
      const d = Math.max(-1.3, Math.min(1.3, raw));
      const abs = Math.abs(d);

      const rotate = -d * MAX_ROTATE;
      const scale = 1 + Math.pow(abs, 1.4) * MAX_SCALE;
      const lift = Math.pow(abs, 2) * MAX_LIFT;
      const opacity = abs <= 0.95 ? 1 : Math.max(0, 1 - (abs - 0.95) / 0.15);

      el.style.transform = `perspective(${PERSPECTIVE}px) translate3d(0, ${lift}px, 0) rotateY(${rotate}deg) scale(${scale})`;
      el.style.opacity = String(opacity);
      el.style.pointerEvents = opacity < 0.5 ? "none" : "auto";
      el.style.zIndex = String(Math.round(10 - abs * 5));

      el.style.setProperty("--shift", String(-d * PARALLAX_SHIFT));
    });
  }, []);

  const settle = useCallback(() => {
    const track = trackRef.current;
    const m = getMetrics();
    if (!track || !m) return;

    let left = track.scrollLeft;
    const rel = left + PAD - m.origin;

    if (rel < m.setW * 0.5) left += m.setW;
    else if (rel > m.setW * 1.5) left -= m.setW;

    if (left !== track.scrollLeft) {
      track.scrollTo({ left, behavior: "auto" });
    }

    const idx = Math.round((left + PAD - m.origin) / m.stride);
    const target = m.origin + idx * m.stride - PAD;
    if (Math.abs(target - left) > 1) {
      track.scrollTo({ left: target, behavior: "smooth" });
    }
  }, [getMetrics]);

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      applyCurve();

      const track = trackRef.current;
      const m = getMetrics();
      if (!track || !m) return;

      const rel =
        (((track.scrollLeft + PAD - m.origin) % m.setW) + m.setW) % m.setW;
      setActiveDot(Math.round((rel / m.setW) * totalDots) % totalDots);
    });

    if (idleRef.current) clearTimeout(idleRef.current);
    idleRef.current = setTimeout(settle, 140);
  }, [applyCurve, getMetrics, settle, totalDots]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !count) return;

    const init = () => {
      const m = getMetrics();
      if (m && !initializedRef.current) {
        track.scrollTo({ left: m.origin + m.setW - PAD, behavior: "auto" });
        initializedRef.current = true;
      }
      applyCurve();
    };

    init();
    const ro = new ResizeObserver(() => {
      init();
      settle();
    });
    ro.observe(track);
    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (idleRef.current) clearTimeout(idleRef.current);
    };
  }, [count, getMetrics, applyCurve, settle]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      if (hoverRef.current || document.hidden || !visibleRef.current) return;
      if (Date.now() < resumeAtRef.current) return;
      const track = trackRef.current;
      const m = getMetrics();
      if (!track || !m) return;
      track.scrollBy({ left: m.stride, behavior: "smooth" });
    }, AUTOPLAY_MS);

    return () => clearInterval(id);
  }, [getMetrics]);

  const scrollByPanels = (dir: 1 | -1) => {
    const track = trackRef.current;
    const m = getMetrics();
    if (!track || !m) return;
    pauseAutoplay();
    const visible = Math.max(1, Math.round((track.clientWidth - PAD * 2) / m.stride));
    const step = Math.max(1, Math.floor(visible / 2));
    track.scrollBy({ left: dir * step * m.stride, behavior: "smooth" });
  };

  const scrollToDot = (idx: number) => {
    const track = trackRef.current;
    const m = getMetrics();
    if (!track || !m) return;
    pauseAutoplay();
    track.scrollTo({
      left: m.origin + m.setW + (idx / totalDots) * m.setW - PAD,
      behavior: "smooth",
    });
  };

  const [lbIndex, setLbIndex] = useState<number | null>(null);
  const [lbDir, setLbDir] = useState<1 | -1 | 0>(0);
  const [lbClosing, setLbClosing] = useState(false);
  const swipeStartRef = useRef<number | null>(null);
  const lbOpen = lbIndex !== null;

  const openLightbox = (i: number) => {
    setLbDir(0);
    setLbClosing(false);
    setLbIndex(i);
  };

  const closeLightbox = useCallback(() => {
    setLbClosing(true);
    setTimeout(() => {
      setLbIndex(null);
      setLbClosing(false);
    }, 260);
  }, []);

  const stepLightbox = useCallback(
    (dir: 1 | -1) => {
      setLbDir(dir);
      setLbIndex((i) => (i === null ? i : (i + dir + count) % count));
    },
    [count]
  );

  const jumpLightbox = (i: number) => {
    setLbDir(lbIndex !== null && i < lbIndex ? -1 : 1);
    setLbIndex(i);
  };

  useEffect(() => {
    if (!lbOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    resumeAtRef.current = Date.now() + 24 * 60 * 60 * 1000;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") stepLightbox(1);
      else if (e.key === "ArrowLeft") stepLightbox(-1);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      resumeAtRef.current = Date.now() + 2000;
    };
  }, [lbOpen, closeLightbox, stepLightbox]);

  const lbPos = lbIndex ?? 0;
  const lbItem = lbIndex !== null ? items[lbIndex] : null;
  const lbPrev = items[(lbPos - 1 + count) % count];
  const lbNext = items[(lbPos + 1) % count];
  const lbFrameAnim =
    lbDir === 1 ? "gx-lb-next" : lbDir === -1 ? "gx-lb-prev" : "gx-lb-open";

  const onCardMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", String((x - 0.5) * 2));
    el.style.setProperty("--my", String((y - 0.5) * 2));
    el.style.setProperty("--sx", `${x * 100}%`);
    el.style.setProperty("--sy", `${y * 100}%`);
  };

  const onCardLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--mx", "0");
    el.style.setProperty("--my", "0");
    el.style.setProperty("--sx", "50%");
    el.style.setProperty("--sy", "50%");
  };

  const reveal = (delay: number, extra = "") => ({
    className: `gx-reveal ${extra} ${inView ? "gx-in" : ""}`,
    style: { "--d": `${delay}ms` } as React.CSSProperties,
  });

  return (
    <section
      ref={sectionRef}
      id={galleryData.id || "gallery"}
      className="relative w-full bg-gradient-to-b from-[#F8F1FD] via-[#F6EEFB] to-[#FBF7FE] py-14 sm:py-16 lg:py-20 overflow-hidden"
    >
      {galleryData.backgroundPaws.map((paw, idx) => (
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
          className="absolute pointer-events-none select-none z-0"
        >
          <div
            className={`gx-paw ${inView ? "gx-in" : ""}`}
            style={{ "--d": `${200 + idx * 140}ms` } as React.CSSProperties}
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

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-3 w-full mb-2">
            <span
              className={`gx-line gx-line-l w-12 sm:w-20 h-[2px] bg-[#8B1EB7] rounded-full ${
                inView ? "gx-in" : ""
              }`}
            />
            <div
              {...reveal(0, "gx-badge")}
              className={`${reveal(0, "gx-badge").className} inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#EFE4F8] border border-[#DFCCF0]/80 shadow-xs`}
            >
              <span className="gx-wiggle inline-flex">
                <PawSvg size={20} fill="#6B0F96" className="w-5 h-5" />
              </span>
              <span className="text-sm sm:text-base font-bold text-[#4A0A72] tracking-wide">
                {galleryData.tagline}
              </span>
            </div>
            <span
              className={`gx-line gx-line-r w-12 sm:w-20 h-[2px] bg-[#8B1EB7] rounded-full ${
                inView ? "gx-in" : ""
              }`}
            />
          </div>

          <h2
            {...reveal(160)}
            className={`${reveal(160).className} text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#3A0A5C] tracking-tight leading-tight mb-3`}
          >
            {galleryData.headingPart1}
            <span className="gx-shine-text text-[#9B14C4]">
              {galleryData.headingHighlight}
            </span>
          </h2>

          <p
            {...reveal(300)}
            className={`${reveal(300).className} text-[#3F2A55] text-sm sm:text-base font-medium leading-relaxed max-w-xl`}
          >
            {galleryData.description}
          </p>
        </div>

        <div
          className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6"
          onPointerEnter={() => {
            hoverRef.current = true;
          }}
          onPointerLeave={() => {
            hoverRef.current = false;
          }}
          onPointerDown={() => pauseAutoplay()}
        >
          <button
            type="button"
            onClick={() => scrollByPanels(-1)}
            aria-label={galleryData.prevSlideAriaLabel || "Previous gallery slide"}
            {...reveal(420, "gx-from-left")}
            className={`${reveal(420, "gx-from-left").className} gx-nav group shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#4A0A72] hover:bg-[#5E0E8F] text-white flex items-center justify-center border-[3px] border-white shadow-[0_8px_20px_rgba(58,0,78,0.3)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_28px_rgba(58,0,78,0.4)] active:scale-95 cursor-pointer`}
          >
            <span className="gx-chev gx-chev-l inline-flex">
              <ChevronLeftIcon className="w-5 h-5" />
            </span>
          </button>

          <div
            {...reveal(380, "gx-track-wrap")}
            className={`${reveal(380, "gx-track-wrap").className} flex-1 min-w-0`}
          >
            <div
              ref={trackRef}
              onScroll={handleScroll}
              className="gallery-track relative flex items-center overflow-x-auto overflow-y-hidden py-12 sm:py-14"
              style={{
                gap: GAP,
                paddingLeft: PAD,
                paddingRight: PAD,
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                overscrollBehaviorX: "contain",
              }}
            >
              {loopItems.map((item, idx) => (
                <div
                  key={`${Math.floor(idx / count)}-${item.id}`}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  onPointerMove={onCardMove}
                  onPointerLeave={onCardLeave}
                  onClick={() => openLightbox(idx % count)}
                  role="button"
                  tabIndex={idx >= count && idx < count * 2 ? 0 : -1}
                  aria-label={item.title || item.alt}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openLightbox(idx % count);
                    }
                  }}
                  aria-hidden={idx < count || idx >= count * 2 ? true : undefined}
                  className="gx-card relative shrink-0 basis-[calc((100%-6px)/2)] sm:basis-[calc((100%-12px)/3)] lg:basis-[calc((100%-30px)/6)] aspect-[1/1.05] overflow-hidden group cursor-pointer rounded-md border-[3px] border-white bg-white shadow-[0_10px_28px_rgba(120,40,170,0.25)] transition-shadow duration-500 hover:shadow-[0_18px_44px_rgba(139,30,183,0.45)]"
                  style={{ willChange: "transform, opacity" }}
                >
                  <div
                    className={`gx-media absolute inset-0 ${inView ? "gx-in" : ""}`}
                    style={
                      { "--d": `${600 + (idx % count) * 90}ms` } as React.CSSProperties
                    }
                  >
                    <div className="gx-parallax absolute inset-y-0 -inset-x-[12%]">
                      <div className="gx-mouse absolute inset-0">
                        <Image
                          src={item.image}
                          alt={item.alt}
                          fill
                          sizes="(max-width: 640px) 58vw, (max-width: 1024px) 39vw, 20vw"
                          className="object-cover object-center"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="gx-spot pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="gx-sheen pointer-events-none absolute inset-y-0 -left-1/2 w-1/2" />

                  <div className="gx-stamp pointer-events-none absolute top-2 right-2">
                    <PawSvg size={22} fill="#FFFFFF" />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-3 sm:p-4">
                    <span className="text-white text-xs sm:text-sm font-semibold tracking-wide drop-shadow-md translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] delay-75">
                      {item.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollByPanels(1)}
            aria-label={galleryData.nextSlideAriaLabel || "Next gallery slide"}
            {...reveal(420, "gx-from-right")}
            className={`${reveal(420, "gx-from-right").className} gx-nav group shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#4A0A72] hover:bg-[#5E0E8F] text-white flex items-center justify-center border-[3px] border-white shadow-[0_8px_20px_rgba(58,0,78,0.3)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_28px_rgba(58,0,78,0.4)] active:scale-95 cursor-pointer`}
          >
            <span className="gx-chev gx-chev-r inline-flex">
              <ChevronRightIcon className="w-5 h-5" />
            </span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 pt-1">
          {Array.from({ length: totalDots }).map((_, idx) => {
            const isActive = activeDot === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToDot(idx)}
                aria-label={`${galleryData.tagline} ${idx + 1}`}
                style={{ "--d": `${700 + idx * 70}ms` } as React.CSSProperties}
                className={`gx-dot relative rounded-full cursor-pointer transition-all duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] ${
                  inView ? "gx-in" : ""
                } ${
                  isActive
                    ? "w-[22px] h-[22px] bg-[#4A0A72]"
                    : "w-[18px] h-[18px] bg-[#D9B8EE] hover:bg-[#c9a0e4] hover:scale-125"
                }`}
              >
                {isActive && (
                  <span
                    key={activeDot}
                    className="gx-ping pointer-events-none absolute inset-0 rounded-full bg-[#4A0A72]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {lbItem &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={lbItem.title || lbItem.alt}
            className={`gx-lb fixed inset-0 z-[100] flex flex-col items-center justify-center ${
              lbClosing ? "gx-lb-out" : ""
            }`}
            onClick={closeLightbox}
          >
            <div className="gx-lb-backdrop absolute inset-0" />

            <div className="gx-lb-chrome pointer-events-none absolute top-0 inset-x-0 flex items-center justify-between p-4 sm:p-6">
              <span className="px-4 py-1.5 rounded-full bg-white/15 text-white text-sm font-bold tracking-wide backdrop-blur-sm">
                {lbPos + 1} / {count}
              </span>
              <button
                type="button"
                autoFocus
                aria-label={galleryData.closeLightboxAriaLabel || "Close image viewer"}
                onClick={(e) => {
                  e.stopPropagation();
                  closeLightbox();
                }}
                className="gx-lb-close pointer-events-auto w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-sm transition-colors duration-300 cursor-pointer"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="w-5 h-5"
                >
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
            </div>

            {count > 1 && (
              <>
                <button
                  type="button"
                  aria-label={galleryData.prevImageAriaLabel || "Previous image"}
                  onClick={(e) => {
                    e.stopPropagation();
                    stepLightbox(-1);
                  }}
                  className="gx-lb-chrome gx-nav group absolute left-3 sm:left-6 top-1/2 -mt-6 w-12 h-12 rounded-full bg-[#4A0A72] hover:bg-[#6B0F96] text-white flex items-center justify-center border-[3px] border-white shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer z-20"
                >
                  <span className="gx-chev gx-chev-l inline-flex">
                    <ChevronLeftIcon className="w-5 h-5" />
                  </span>
                </button>
                <button
                  type="button"
                  aria-label={galleryData.nextImageAriaLabel || "Next image"}
                  onClick={(e) => {
                    e.stopPropagation();
                    stepLightbox(1);
                  }}
                  className="gx-lb-chrome gx-nav group absolute right-3 sm:right-6 top-1/2 -mt-6 w-12 h-12 rounded-full bg-[#4A0A72] hover:bg-[#6B0F96] text-white flex items-center justify-center border-[3px] border-white shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer z-20"
                >
                  <span className="gx-chev gx-chev-r inline-flex">
                    <ChevronRightIcon className="w-5 h-5" />
                  </span>
                </button>
              </>
            )}

            <div
              className="gx-lb-stage relative z-10 flex flex-col items-center px-4"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => {
                if (e.pointerType === "touch") swipeStartRef.current = e.clientX;
              }}
              onPointerUp={(e) => {
                if (swipeStartRef.current === null) return;
                const dx = e.clientX - swipeStartRef.current;
                swipeStartRef.current = null;
                if (Math.abs(dx) > 50) stepLightbox(dx < 0 ? 1 : -1);
              }}
            >
              <div className="flex items-center justify-center gap-5 lg:gap-8">
                {count > 1 && (
                  <button
                    type="button"
                    key={`prev-${lbPos}`}
                    aria-label={galleryData.prevImageAriaLabel || "Previous image"}
                    onClick={() => stepLightbox(-1)}
                    className="gx-lb-side gx-lb-side-l relative hidden md:block w-[120px] lg:w-[170px] aspect-[1/1.05] shrink-0 overflow-hidden rounded-md border-[3px] border-white/80 cursor-pointer"
                  >
                    <Image
                      src={lbPrev.image}
                      alt={lbPrev.alt}
                      fill
                      sizes="170px"
                      className="object-cover object-center"
                    />
                  </button>
                )}

                <div
                  key={`main-${lbPos}`}
                  className={`gx-lb-frame ${lbFrameAnim} relative w-[min(86vw,540px)] h-[min(62vh,560px)] rounded-lg overflow-hidden border-4 border-white bg-white shadow-[0_30px_80px_rgba(0,0,0,0.55)]`}
                >
                  <Image
                    src={lbItem.image}
                    alt={lbItem.alt}
                    fill
                    priority
                    sizes="(max-width: 768px) 86vw, 540px"
                    className="object-contain object-center select-none"
                    draggable={false}
                  />
                </div>

                {count > 1 && (
                  <button
                    type="button"
                    key={`next-${lbPos}`}
                    aria-label={galleryData.nextImageAriaLabel || "Next image"}
                    onClick={() => stepLightbox(1)}
                    className="gx-lb-side gx-lb-side-r relative hidden md:block w-[120px] lg:w-[170px] aspect-[1/1.05] shrink-0 overflow-hidden rounded-md border-[3px] border-white/80 cursor-pointer"
                  >
                    <Image
                      src={lbNext.image}
                      alt={lbNext.alt}
                      fill
                      sizes="170px"
                      className="object-cover object-center"
                    />
                  </button>
                )}
              </div>

              <div
                key={`cap-${lbPos}`}
                className="gx-lb-caption mt-5 flex flex-col items-center gap-3"
              >
                <div className="flex items-center gap-2 text-white">
                  <PawSvg size={18} fill="#E9CBFA" />
                  <span className="text-base sm:text-lg font-bold tracking-wide drop-shadow-md">
                    {lbItem.title}
                  </span>
                </div>
                {count > 1 && count <= 14 && (
                  <div className="flex items-center gap-2">
                    {items.map((it, i) => (
                      <button
                        key={it.id}
                        type="button"
                        aria-label={it.title || it.alt}
                        onClick={() => jumpLightbox(i)}
                        className={`rounded-full cursor-pointer transition-all duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] ${
                          i === lbPos
                            ? "w-6 h-2.5 bg-white"
                            : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      <style jsx global>{`
        .gallery-track::-webkit-scrollbar {
          display: none;
        }

        .gx-reveal:not(.gx-in) {
          opacity: 0;
        }
        .gx-reveal.gx-in {
          animation: gx-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms)
            backwards;
        }
        .gx-reveal.gx-from-left.gx-in {
          animation-name: gx-from-left;
          animation-duration: 1s;
        }
        .gx-reveal.gx-from-right.gx-in {
          animation-name: gx-from-right;
          animation-duration: 1s;
        }
        .gx-reveal.gx-track-wrap.gx-in {
          animation-name: gx-track-in;
          animation-duration: 1.1s;
        }
        .gx-reveal.gx-badge.gx-in {
          animation-name: gx-badge-in;
        }

        @keyframes gx-rise {
          from {
            opacity: 0;
            transform: translate3d(0, 28px, 0) scale(0.97);
            filter: blur(6px);
          }
          to {
            opacity: 1;
            transform: none;
            filter: blur(0);
          }
        }
        @keyframes gx-badge-in {
          0% {
            opacity: 0;
            transform: translate3d(0, 18px, 0) scale(0.6);
          }
          60% {
            opacity: 1;
            transform: translate3d(0, -3px, 0) scale(1.06);
          }
          100% {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes gx-from-left {
          from {
            opacity: 0;
            transform: translate3d(-48px, 0, 0) rotate(-120deg) scale(0.4);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes gx-from-right {
          from {
            opacity: 0;
            transform: translate3d(48px, 0, 0) rotate(120deg) scale(0.4);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes gx-track-in {
          from {
            opacity: 0;
            transform: perspective(1200px) translate3d(0, 40px, -120px)
              rotateX(8deg);
            filter: blur(8px);
          }
          to {
            opacity: 1;
            transform: none;
            filter: blur(0);
          }
        }

        .gx-line {
          transform: scaleX(0);
        }
        .gx-line-l {
          transform-origin: right center;
        }
        .gx-line-r {
          transform-origin: left center;
        }
        .gx-line.gx-in {
          transform: scaleX(1);
          transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.25s;
        }

        .gx-wiggle {
          transform-origin: 50% 70%;
          animation: gx-wiggle 3.2s ease-in-out 1.4s infinite;
        }
        @keyframes gx-wiggle {
          0%,
          70%,
          100% {
            transform: rotate(0deg) scale(1);
          }
          76% {
            transform: rotate(-16deg) scale(1.15);
          }
          84% {
            transform: rotate(14deg) scale(1.15);
          }
          92% {
            transform: rotate(-8deg) scale(1.05);
          }
        }

        .gx-shine-text {
          background: linear-gradient(
            100deg,
            #9b14c4 0%,
            #9b14c4 35%,
            #d65bff 50%,
            #9b14c4 65%,
            #6b0f96 100%
          );
          background-size: 250% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: gx-shine 4.5s ease-in-out 1.2s infinite;
        }
        @keyframes gx-shine {
          0% {
            background-position: 100% 0;
          }
          60%,
          100% {
            background-position: -50% 0;
          }
        }

        .gx-paw:not(.gx-in) {
          opacity: 0;
        }
        .gx-paw.gx-in {
          animation: gx-paw-in 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0ms)
            backwards;
        }
        @keyframes gx-paw-in {
          from {
            opacity: 0;
            transform: scale(0) rotate(-50deg);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        .gx-nav:hover .gx-chev-l {
          animation: gx-nudge-l 0.7s ease-in-out infinite;
        }
        .gx-nav:hover .gx-chev-r {
          animation: gx-nudge-r 0.7s ease-in-out infinite;
        }
        @keyframes gx-nudge-l {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-3px);
          }
        }
        @keyframes gx-nudge-r {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(3px);
          }
        }

        .gx-card {
          --mx: 0;
          --my: 0;
          --sx: 50%;
          --sy: 50%;
          --zoom: 1;
        }
        .gx-card:hover {
          --zoom: 1.1;
        }

        .gx-media:not(.gx-in) {
          opacity: 0;
        }
        .gx-media.gx-in {
          animation: gx-media-in 1.1s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms)
            backwards;
        }
        @keyframes gx-media-in {
          from {
            opacity: 0;
            clip-path: inset(100% 0 0 0);
          }
          to {
            opacity: 1;
            clip-path: inset(0 0 0 0);
          }
        }

        .gx-parallax {
          transform: translate3d(calc(var(--shift, 0) * 1%), 0, 0);
          will-change: transform;
        }
        .gx-mouse {
          transform: translate3d(
              calc(var(--mx) * -9px),
              calc(var(--my) * -9px),
              0
            )
            scale(var(--zoom));
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .gx-spot {
          background: radial-gradient(
            circle at var(--sx) var(--sy),
            rgba(255, 255, 255, 0.38),
            rgba(255, 255, 255, 0) 55%
          );
          mix-blend-mode: soft-light;
        }

        .gx-sheen {
          background: linear-gradient(
            100deg,
            transparent,
            rgba(255, 255, 255, 0.45),
            transparent
          );
          transform: translateX(-120%) skewX(-18deg);
          opacity: 0;
        }
        .gx-card:hover .gx-sheen {
          opacity: 1;
          animation: gx-sheen 0.9s ease-out;
        }
        @keyframes gx-sheen {
          from {
            transform: translateX(-120%) skewX(-18deg);
          }
          to {
            transform: translateX(520%) skewX(-18deg);
          }
        }

        .gx-stamp {
          opacity: 0;
          transform: scale(0) rotate(-90deg);
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
          transition: transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1),
            opacity 0.3s ease;
        }
        .gx-card:hover .gx-stamp {
          opacity: 0.95;
          transform: scale(1) rotate(12deg);
        }

        .gx-dot:not(.gx-in) {
          opacity: 0;
        }
        .gx-dot.gx-in {
          animation: gx-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0ms)
            backwards;
        }
        @keyframes gx-pop {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .gx-ping {
          animation: gx-ping 0.8s cubic-bezier(0, 0, 0.2, 1) forwards;
        }
        @keyframes gx-ping {
          from {
            opacity: 0.5;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(2.4);
          }
        }

        .gx-lb-backdrop {
          background: radial-gradient(
            circle at 50% 40%,
            rgba(74, 10, 114, 0.82),
            rgba(20, 2, 35, 0.95)
          );
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          animation: gx-lb-fade 0.35s ease both;
        }
        .gx-lb-out .gx-lb-backdrop {
          animation: gx-lb-fade-out 0.26s ease forwards;
        }
        .gx-lb-chrome {
          animation: gx-lb-fade 0.45s ease 0.15s both;
        }
        .gx-lb-out .gx-lb-chrome {
          animation: gx-lb-fade-out 0.2s ease forwards;
        }
        .gx-lb-out .gx-lb-stage {
          animation: gx-lb-shrink 0.26s ease forwards;
        }
        .gx-lb-close:hover {
          transform: rotate(90deg);
        }
        .gx-lb-close {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
            background-color 0.3s ease;
        }

        .gx-lb-frame {
          will-change: transform, opacity;
        }
        .gx-lb-open {
          animation: gx-lb-pop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .gx-lb-next {
          animation: gx-lb-slide-next 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .gx-lb-prev {
          animation: gx-lb-slide-prev 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .gx-lb-side {
          opacity: 0.55;
          transform: scale(0.92);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          transition: opacity 0.35s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .gx-lb-side:hover {
          opacity: 1;
          transform: scale(1);
        }
        .gx-lb-side-l {
          animation: gx-lb-side-in-l 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.1s backwards;
        }
        .gx-lb-side-r {
          animation: gx-lb-side-in-r 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.1s backwards;
        }
        .gx-lb-caption {
          animation: gx-lb-rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
        }

        @keyframes gx-lb-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes gx-lb-fade-out {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        @keyframes gx-lb-shrink {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.9);
          }
        }
        @keyframes gx-lb-pop {
          from {
            opacity: 0;
            transform: translate3d(0, 40px, 0) scale(0.6) rotate(-4deg);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes gx-lb-slide-next {
          from {
            opacity: 0;
            transform: translate3d(90px, 0, 0) scale(0.9) rotate(2deg);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes gx-lb-slide-prev {
          from {
            opacity: 0;
            transform: translate3d(-90px, 0, 0) scale(0.9) rotate(-2deg);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes gx-lb-side-in-l {
          from {
            opacity: 0;
            transform: translate3d(-40px, 0, 0) scale(0.7);
          }
          to {
            opacity: 0.55;
            transform: scale(0.92);
          }
        }
        @keyframes gx-lb-side-in-r {
          from {
            opacity: 0;
            transform: translate3d(40px, 0, 0) scale(0.7);
          }
          to {
            opacity: 0.55;
            transform: scale(0.92);
          }
        }
        @keyframes gx-lb-rise {
          from {
            opacity: 0;
            transform: translate3d(0, 16px, 0);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gx-reveal,
          .gx-media,
          .gx-paw,
          .gx-dot {
            opacity: 1 !important;
            animation: none !important;
          }
          .gx-line {
            transform: scaleX(1) !important;
          }
          .gx-wiggle,
          .gx-shine-text,
          .gx-ping,
          .gx-card:hover .gx-sheen,
          .gx-nav:hover .gx-chev {
            animation: none !important;
          }
          .gx-mouse {
            transition: none;
          }
          .gx-lb-backdrop,
          .gx-lb-chrome,
          .gx-lb-frame,
          .gx-lb-side,
          .gx-lb-caption,
          .gx-lb-out .gx-lb-stage {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
