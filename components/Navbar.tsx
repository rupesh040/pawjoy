"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import contentData from "@/data/content.json";
import { HeaderData } from "@/data/type";

interface NavbarProps {
  data?: HeaderData;
}

type Pill = { left: number; width: number };
type HoverPill = Pill & { visible: boolean };

function PawIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="currentColor" className={className}>
      <ellipse cx="60" cy="92" rx="15" ry="20" transform="rotate(-22 60 92)" />
      <ellipse cx="82" cy="54" rx="15.5" ry="22" transform="rotate(-12 82 54)" />
      <ellipse cx="121" cy="46" rx="15" ry="22" transform="rotate(2 121 46)" />
      <ellipse cx="155" cy="72" rx="15" ry="21.5" transform="rotate(8 155 72)" />
      <path d="M111 82 C127 81 137 92 147 104 C158 117 161 133 148 141 C138 147 128 141 117 144 C106 147 97 157 84 154 C71 151 70 135 76 121 C82 106 93 83 111 82 Z" />
    </svg>
  );
}

function CtaButton({
  href,
  label,
  onClick,
  className = "",
  magnetic = false,
  icon = false,
  tabIndex,
}: {
  href: string;
  label: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  magnetic?: boolean;
  icon?: boolean;
  tabIndex?: number;
}) {
  const zoneRef = useRef<HTMLSpanElement>(null);
  const idRef = useRef(0);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const onMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const el = zoneRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--bx", String((e.clientX - (r.left + r.width / 2)) * 0.22));
    el.style.setProperty("--by", String((e.clientY - (r.top + r.height / 2)) * 0.3));
  };

  const onLeave = () => {
    const el = zoneRef.current;
    if (!el) return;
    el.style.setProperty("--bx", "0");
    el.style.setProperty("--by", "0");
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = ++idRef.current;
    setRipples((p) => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setRipples((p) => p.filter((i) => i.id !== id)), 700);
    onClick(e);
  };

  const link = (
    <Link
      href={href}
      tabIndex={tabIndex}
      onClick={handleClick}
      className={`nv-cta group relative overflow-hidden ${className}`}
      style={
        magnetic
          ? {
              transform:
                "translate3d(calc(var(--bx, 0) * 1px), calc(var(--by, 0) * 1px), 0)",
            }
          : undefined
      }
    >
      <span className="nv-cta-sheen pointer-events-none" />
      <span className="relative z-10 inline-flex items-center">
        {label}
        {icon && (
          <span className="inline-flex w-0 ml-0 overflow-hidden opacity-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:w-4 group-hover:ml-2 group-hover:opacity-100">
            <PawIcon className="nv-cta-paw w-4 h-4 shrink-0" />
          </span>
        )}
      </span>
      {ripples.map((r) => (
        <span
          key={r.id}
          className="nv-ripple pointer-events-none absolute rounded-full bg-white/40"
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </Link>
  );

  if (!magnetic) return link;

  return (
    <span
      ref={zoneRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-flex p-3 -m-3"
    >
      {link}
    </span>
  );
}

export default function Navbar({ data: customData }: NavbarProps) {
  const headerData =
    customData ||
    (contentData.PawJoy.sections.Header.variants.PawJoyHeader1 as HeaderData);
  const [activeItem, setActiveItem] = useState<string>(
    headerData.links.find((link) => link.active)?.name ||
      headerData.links[0]?.name ||
      "Home"
  );
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [activePill, setActivePill] = useState<Pill | null>(null);
  const [hoverPill, setHoverPill] = useState<HoverPill | null>(null);

  const spyLockRef = useRef(false);
  const spyRecomputeRef = useRef(false);
  const spyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateActiveRef = useRef<(() => void) | null>(null);

  const releaseSpy = useCallback(() => {
    spyLockRef.current = false;
    if (spyRecomputeRef.current) updateActiveRef.current?.();
  }, []);

  const lockSpy = (recompute: boolean) => {
    spyLockRef.current = true;
    spyRecomputeRef.current = recompute;
    if (spyTimerRef.current) clearTimeout(spyTimerRef.current);
    spyTimerRef.current = setTimeout(releaseSpy, 250);
  };

  useEffect(() => {
    const updateActive = () => {
      const links = headerData.links;
      if (!links || links.length === 0) return;

      if (window.scrollY < 80) {
        const firstLink = links[0];
        if (firstLink) {
          setActiveItem(firstLink.name);
        }
        return;
      }

      const isBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 60;

      let currentActive = "";
      const offset = 140;

      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const targetId = link.href.startsWith("#")
          ? link.href.slice(1)
          : link.href === "/"
          ? "home"
          : "";

        if (!targetId) continue;

        const el = document.getElementById(targetId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset) {
            currentActive = link.name;
          }
        }
      }

      if (isBottom) {
        currentActive = links[links.length - 1].name;
      }

      if (currentActive) {
        setActiveItem(currentActive);
      }
    };
    updateActiveRef.current = updateActive;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);

      if (spyLockRef.current) {
        if (spyTimerRef.current) clearTimeout(spyTimerRef.current);
        spyTimerRef.current = setTimeout(releaseSpy, 150);
        return;
      }

      updateActive();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (spyTimerRef.current) clearTimeout(spyTimerRef.current);
    };
  }, [headerData.links, releaseSpy]);

  const measureActive = useCallback(() => {
    const el = linkRefs.current[activeItem];
    if (!el) return;
    const next = { left: el.offsetLeft, width: el.offsetWidth };
    setActivePill((prev) =>
      prev && prev.left === next.left && prev.width === next.width ? prev : next
    );
  }, [activeItem]);

  useEffect(() => {
    measureActive();
    const nav = navRef.current;
    if (!nav) return;
    const ro = new ResizeObserver(measureActive);
    ro.observe(nav);
    document.fonts?.ready.then(measureActive);
    return () => ro.disconnect();
  }, [measureActive]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1280) setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("resize", onResize);
    };
  }, [isMobileMenuOpen]);

  const showHover = (el: HTMLElement) =>
    setHoverPill({ left: el.offsetLeft, width: el.offsetWidth, visible: true });
  const hideHover = () =>
    setHoverPill((p) => (p ? { ...p, visible: false } : p));

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    name: string
  ) => {
    setActiveItem(name);
    lockSpy(false);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    if (href.startsWith("#")) {
      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        e.preventDefault();
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetElement.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        window.history.pushState(null, "", href);
      }
    } else if (href === "/") {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      window.history.pushState(null, "", "/");
    }
  };

  const handleButtonClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) lockSpy(true);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    if (href.startsWith("#")) {
      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        e.preventDefault();
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetElement.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <header
      ref={headerRef}
      className={`nv-header sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(58,0,78,0.08)] py-2.5"
          : "bg-gradient-to-r from-purple-50/40 via-white to-purple-50/50 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href={headerData.links[0]?.href || "#home"}
              onClick={(e) =>
                handleNavClick(
                  e,
                  headerData.links[0]?.href || "#home",
                  headerData.links[0]?.name || "Home"
                )
              }
              className="nv-logo nv-logo-in flex items-center active:scale-95 transition-transform duration-300"
            >
              <Image
                src={headerData.logo}
                alt={headerData.logoAlt}
                width={140}
                height={46}
                className={`nv-logo-img w-auto object-contain ${
                  isScrolled ? "h-9 sm:h-10" : "h-10 sm:h-11"
                }`}
                priority
              />
            </Link>

            <div className="nv-divider hidden xl:block h-7 w-[1.5px] bg-[#d8b4e2]/70 mx-6 self-center" />
          </div>

          <nav
            ref={navRef}
            onMouseLeave={hideHover}
            onBlur={hideHover}
            className="relative hidden xl:flex items-center space-x-1 lg:space-x-2"
          >
            {hoverPill && (
              <span
                aria-hidden
                className="nv-hover-pill pointer-events-none absolute top-0 bottom-0 rounded-full bg-purple-100/80"
                style={{
                  left: hoverPill.left,
                  width: hoverPill.width,
                  opacity: hoverPill.visible ? 1 : 0,
                  transform: hoverPill.visible ? "scale(1)" : "scale(0.85)",
                }}
              />
            )}

            {activePill && (
              <span
                aria-hidden
                className="nv-active-pill pointer-events-none absolute top-0 bottom-0 rounded-full bg-[#3a004e] shadow-[0_4px_14px_rgba(58,0,78,0.3)]"
                style={{ left: activePill.left, width: activePill.width }}
              />
            )}

            {headerData.links.map((link, i) => {
              const isActive = activeItem === link.name;
              return (
                <Link
                  key={link.name}
                  ref={(el) => {
                    linkRefs.current[link.name] = el;
                  }}
                  href={link.href}
                  data-active={isActive}
                  onClick={(e) => handleNavClick(e, link.href, link.name)}
                  onMouseEnter={(e) => showHover(e.currentTarget)}
                  onFocus={(e) => showHover(e.currentTarget)}
                  style={{ "--d": `${250 + i * 70}ms` } as React.CSSProperties}
                  className={`nv-link nv-rise relative z-10 px-4 py-2 rounded-full text-[14.5px] font-medium tracking-normal transition-colors duration-300 active:scale-95 ${
                    isActive
                      ? "text-white"
                      : "text-[#3a004e] hover:text-[#580075]"
                  }`}
                >
                  <span className="nv-roll relative block overflow-hidden leading-[1.4]">
                    <span className="nv-roll-a block">{link.name}</span>
                    <span aria-hidden className="nv-roll-b absolute inset-0 block">
                      {link.name}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>

          <div
            className="nv-pop hidden xl:flex items-center"
            style={{ "--d": `${250 + headerData.links.length * 70}ms` } as React.CSSProperties}
          >
            <CtaButton
              href={headerData.buttonHref}
              label={headerData.button}
              onClick={(e) => handleButtonClick(e, headerData.buttonHref)}
              magnetic
              icon
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-[14.5px] font-semibold text-white bg-[#3a004e] hover:bg-[#4f006b] shadow-[0_4px_14px_rgba(58,0,78,0.25)] hover:shadow-[0_8px_24px_rgba(58,0,78,0.4)] active:scale-95 transition-[background-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            />
          </div>

          <div className="nv-pop flex xl:hidden items-center space-x-3" style={{ "--d": "300ms" } as React.CSSProperties}>
            <CtaButton
              href={headerData.buttonHref}
              label={headerData.button}
              onClick={(e) => handleButtonClick(e, headerData.buttonHref)}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#3a004e] hover:bg-[#4f006b] shadow-sm active:scale-95 transition-all duration-300"
            />

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[#3a004e] hover:bg-purple-100/60 active:scale-90 focus:outline-none transition-all duration-200"
              aria-label={headerData.mobileMenuAriaLabel || "Toggle navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="nv-mobile-menu"
            >
              <div
                className={`w-6 h-5 flex flex-col justify-between items-center relative transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  isMobileMenuOpen ? "rotate-180" : ""
                }`}
              >
                <span
                  className={`w-6 h-0.5 bg-[#3a004e] rounded-full transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? "rotate-45 translate-y-[9px]" : ""
                  }`}
                />
                <span
                  className={`w-6 h-0.5 bg-[#3a004e] rounded-full transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? "opacity-0 scale-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`w-6 h-0.5 bg-[#3a004e] rounded-full transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? "-rotate-45 -translate-y-[9px]" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div
        id="nv-mobile-menu"
        aria-hidden={!isMobileMenuOpen}
        className={`xl:hidden grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isMobileMenuOpen
            ? "grid-rows-[1fr] opacity-100 border-b border-purple-100 shadow-lg bg-white/95 backdrop-blur-md"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-5 pt-3 pb-6 space-y-2">
            {headerData.links.map((link, i) => {
              const isActive = activeItem === link.name;
              return (
                <div
                  key={link.name}
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${90 + i * 55}ms` : "0ms",
                  }}
                  className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isMobileMenuOpen
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-6"
                  }`}
                >
                  <Link
                    href={link.href}
                    tabIndex={isMobileMenuOpen ? 0 : -1}
                    onClick={(e) => handleNavClick(e, link.href, link.name)}
                    className={`group flex items-center px-4 py-2.5 rounded-full text-sm font-medium active:scale-[0.98] transition-all duration-300 ${
                      isActive
                        ? "bg-[#3a004e] text-white shadow-sm"
                        : "text-[#3a004e] hover:bg-purple-50 hover:pl-6"
                    }`}
                  >
                    <PawIcon
                      className={`shrink-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                        isActive
                          ? "w-4 h-4 mr-2 scale-100 rotate-0 opacity-100"
                          : "w-0 h-4 mr-0 scale-0 -rotate-45 opacity-0"
                      }`}
                    />
                    {link.name}
                  </Link>
                </div>
              );
            })}
            <div
              className={`pt-2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{
                transitionDelay: isMobileMenuOpen
                  ? `${90 + headerData.links.length * 55}ms`
                  : "0ms",
              }}
            >
              <CtaButton
                href={headerData.buttonHref}
                label={headerData.button}
                tabIndex={isMobileMenuOpen ? 0 : -1}
                onClick={(e) => handleButtonClick(e, headerData.buttonHref)}
                className="w-full flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[#3a004e] hover:bg-[#4f006b] shadow-md active:scale-[0.98] transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .nv-header {
          animation: nv-drop 0.9s cubic-bezier(0.22, 1, 0.36, 1) backwards;
        }
        @keyframes nv-drop {
          from {
            opacity: 0;
            transform: translate3d(0, -100%, 0);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        .nv-logo-in {
          animation: nv-logo-in 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards;
        }
        @keyframes nv-logo-in {
          from {
            opacity: 0;
            transform: translate3d(-14px, 0, 0) rotate(-10deg) scale(0.7);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        .nv-divider {
          transform-origin: center;
          animation: nv-divider 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.4s backwards;
        }
        @keyframes nv-divider {
          from {
            transform: scaleY(0);
            opacity: 0;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        .nv-rise {
          animation: nv-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) backwards;
        }
        @keyframes nv-rise {
          from {
            opacity: 0;
            transform: translate3d(0, -14px, 0);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: none;
            filter: blur(0);
          }
        }

        .nv-pop {
          animation: nv-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0ms) backwards;
        }
        @keyframes nv-pop {
          from {
            opacity: 0;
            transform: scale(0.4);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        .nv-logo-img {
          transition: transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1),
            height 0.5s ease;
        }
        .nv-logo:hover .nv-logo-img {
          transform: rotate(-4deg) scale(1.07);
        }

        .nv-active-pill {
          animation: nv-pill-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
          transition: left 0.6s cubic-bezier(0.34, 1.35, 0.64, 1),
            width 0.6s cubic-bezier(0.34, 1.35, 0.64, 1);
        }
        @keyframes nv-pill-in {
          from {
            opacity: 0;
            transform: scale(0.6);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .nv-hover-pill {
          transition: left 0.4s cubic-bezier(0.22, 1, 0.36, 1),
            width 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease,
            transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .nv-roll-a,
        .nv-roll-b {
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nv-roll-b {
          transform: translateY(110%);
        }
        .nv-link[data-active="false"]:hover .nv-roll-a {
          transform: translateY(-110%);
        }
        .nv-link[data-active="false"]:hover .nv-roll-b {
          transform: translateY(0);
        }

        .nv-cta {
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            background-color 0.3s ease, box-shadow 0.3s ease;
        }
        .nv-cta-sheen {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 40%;
          background: linear-gradient(
            100deg,
            transparent,
            rgba(255, 255, 255, 0.35),
            transparent
          );
          transform: translateX(-160%) skewX(-20deg);
          animation: nv-sheen 5s ease-in-out 2.5s infinite;
        }
        @keyframes nv-sheen {
          0% {
            transform: translateX(-160%) skewX(-20deg);
          }
          24%,
          100% {
            transform: translateX(340%) skewX(-20deg);
          }
        }
        .nv-cta:hover .nv-cta-paw {
          animation: nv-paw-wiggle 0.7s ease-in-out;
        }
        @keyframes nv-paw-wiggle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-18deg);
          }
          55% {
            transform: rotate(16deg);
          }
          80% {
            transform: rotate(-8deg);
          }
        }
        .nv-ripple {
          width: 120px;
          height: 120px;
          margin: -60px 0 0 -60px;
          animation: nv-ripple 0.7s ease-out forwards;
        }
        @keyframes nv-ripple {
          from {
            opacity: 0.55;
            transform: scale(0);
          }
          to {
            opacity: 0;
            transform: scale(2.6);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nv-header,
          .nv-logo-in,
          .nv-divider,
          .nv-rise,
          .nv-pop,
          .nv-active-pill,
          .nv-cta-sheen,
          .nv-cta:hover .nv-cta-paw {
            animation: none !important;
          }
          .nv-active-pill,
          .nv-hover-pill,
          .nv-roll-a,
          .nv-roll-b,
          .nv-logo-img,
          .nv-cta {
            transition: none !important;
          }
          .nv-link[data-active="false"]:hover .nv-roll-a {
            transform: none;
          }
          .nv-link[data-active="false"]:hover .nv-roll-b {
            transform: translateY(110%);
          }
        }
      `}</style>
    </header>
  );
}
