/**
 * Screen Size Indicator Component
 * Displays the current Tailwind breakpoint and window size
 * Only visible during development
 */

import { useEffect, useState } from "react";

type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl" | "mobile";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export function ScreenSizeIndicator() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("mobile");
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setWindowSize({ width, height });

      // Determine current breakpoint
      if (width >= BREAKPOINTS["2xl"]) {
        setBreakpoint("2xl");
      } else if (width >= BREAKPOINTS.xl) {
        setBreakpoint("xl");
      } else if (width >= BREAKPOINTS.lg) {
        setBreakpoint("lg");
      } else if (width >= BREAKPOINTS.md) {
        setBreakpoint("md");
      } else if (width >= BREAKPOINTS.sm) {
        setBreakpoint("sm");
      } else {
        setBreakpoint("mobile");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="ml-auto w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white rounded-lg shadow-lg border border-slate-700 transition-colors"
        title={isVisible ? "Hide" : "Show"}
      >
        {isVisible ? "−" : "+"}
      </button>

      {isVisible && (
        <>
          {/* Screen Size Display */}
          <div className="bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg font-mono text-sm border border-slate-700">
            <div className="font-semibold mb-1">📱 Screen Size</div>
            <div className="text-xs space-y-1">
              <div>
                Breakpoint:{" "}
                <span className="font-bold text-blue-400">{breakpoint}</span>
              </div>
              <div>
                Width:{" "}
                <span className="font-bold text-green-400">
                  {windowSize.width}px
                </span>
              </div>
              <div>
                Height:{" "}
                <span className="font-bold text-yellow-400">
                  {windowSize.height}px
                </span>
              </div>
            </div>
          </div>

          {/* Breakpoints Reference */}
          <div className="bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg font-mono text-xs border border-slate-700 max-w-xs">
            <div className="font-semibold mb-2">Tailwind Breakpoints</div>
            <div className="space-y-1 text-slate-300">
              <div>sm: 640px</div>
              <div>md: 768px</div>
              <div>lg: 1024px</div>
              <div>xl: 1280px</div>
              <div>2xl: 1536px</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
