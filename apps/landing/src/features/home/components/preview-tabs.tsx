"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";

const tabs = ["Dashboard", "Documents", "Members", "Settings"];

export function PreviewTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pillRef = useRef<HTMLSpanElement>(null);

  const movePill = (withTransition: boolean) => {
    const tab = tabRefs.current[activeIndex];
    const pill = pillRef.current;
    if (!tab || !pill) return;

    if (!withTransition) {
      pill.style.transition = "none";
    }

    pill.style.transform = `translateX(${tab.offsetLeft}px)`;
    pill.style.width = `${tab.offsetWidth}px`;

    if (!withTransition) {
      pill.getBoundingClientRect();
      pill.style.transition = "";
    }
  };

  useEffect(() => {
    movePill(false);
    const handleResize = () => movePill(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    movePill(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <div className="relative inline-flex items-center" role="tablist">
      <span
        ref={pillRef}
        aria-hidden="true"
        className="absolute top-0 left-0 z-0 h-9 w-0 rounded-full bg-bg-3 transition-[transform,width] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[transform,width] motion-reduce:transition-none"
      />
      {tabs.map((tab, index) => (
        <button
          key={tab}
          ref={(el) => {
            tabRefs.current[index] = el;
          }}
          type="button"
          role="tab"
          aria-selected={index === activeIndex}
          onClick={() => setActiveIndex(index)}
          className={cn(
            "relative z-10 h-9 px-3 text-sm font-medium transition-colors motion-reduce:transition-none",
            index === activeIndex ? "text-fg-4" : "text-fg-3 hover:text-fg-4",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
