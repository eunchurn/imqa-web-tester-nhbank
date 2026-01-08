"use client";

import { useEffect, useState } from "react";
import { useIMQA } from "./imqa-provider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface WebVitalsMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
  inp?: number;
}

export function IMQAStatus() {
  const { isInitialized, config } = useIMQA();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [webVitals, setWebVitals] = useState<WebVitalsMetrics>({});

  useEffect(() => {
    const getSessionInfo = async () => {
      if (!isInitialized) {
        setSessionId(null);
        return;
      }

      try {
        const IMQA = await import("@imqa/web-agent");
        const id = IMQA.default.getSessionId?.() || null;
        setSessionId(id);
      } catch {
        setSessionId(null);
      }
    };

    getSessionInfo();
  }, [isInitialized]);

  // Web Vitals 업데이트
  useEffect(() => {
    if (!isInitialized) {
      setWebVitals({});
      return;
    }

    const updateWebVitals = async () => {
      try {
        const IMQA = await import("@imqa/web-agent");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const metrics = (IMQA.default as any).getWebVitals?.() || {};
        setWebVitals(metrics);
      } catch {
        // Ignore errors
      }
    };

    updateWebVitals();
    const interval = setInterval(updateWebVitals, 2000);
    return () => clearInterval(interval);
  }, [isInitialized]);

  const formatMetric = (value: number | undefined, unit = "ms") => {
    if (value === undefined) return "-";
    if (unit === "ms") return `${Math.round(value)}ms`;
    return value.toFixed(3);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            isInitialized ? "bg-green-500 animate-pulse" : "bg-red-500"
          }`}
        />
        <span className="text-sm font-medium">
          {isInitialized ? "Active" : "Inactive"}
        </span>
      </div>

      {isInitialized && sessionId && (
        <div>
          <p className="text-xs text-muted-foreground">Session ID</p>
          <p className="text-xs font-mono truncate" title={sessionId}>
            {sessionId.slice(0, 16)}...
          </p>
        </div>
      )}

      {isInitialized && (
        <>
          <Separator />
          <div>
            <p className="text-xs font-medium mb-2">Active Features</p>
            <div className="flex flex-wrap gap-1">
              {config.consoleCapture && (
                <Badge variant="secondary" className="text-xs">
                  Console
                </Badge>
              )}
              {config.advancedNetworkCapture && (
                <Badge variant="secondary" className="text-xs">
                  Network
                </Badge>
              )}
              {!config.disableReplay && (
                <Badge variant="secondary" className="text-xs">
                  Replay
                </Badge>
              )}
              {config.captureMetrics && (
                <Badge variant="secondary" className="text-xs">
                  Metrics
                </Badge>
              )}
              {config.debug && (
                <Badge variant="secondary" className="text-xs">
                  Debug
                </Badge>
              )}
            </div>
          </div>
        </>
      )}

      {isInitialized && Object.keys(webVitals).length > 0 && (
        <>
          <Separator />
          <div>
            <p className="text-xs font-medium mb-2">Web Vitals</p>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {webVitals.lcp !== undefined && (
                <div>
                  <span className="text-muted-foreground">LCP:</span>{" "}
                  {formatMetric(webVitals.lcp)}
                </div>
              )}
              {webVitals.fid !== undefined && (
                <div>
                  <span className="text-muted-foreground">FID:</span>{" "}
                  {formatMetric(webVitals.fid)}
                </div>
              )}
              {webVitals.cls !== undefined && (
                <div>
                  <span className="text-muted-foreground">CLS:</span>{" "}
                  {formatMetric(webVitals.cls, "")}
                </div>
              )}
              {webVitals.fcp !== undefined && (
                <div>
                  <span className="text-muted-foreground">FCP:</span>{" "}
                  {formatMetric(webVitals.fcp)}
                </div>
              )}
              {webVitals.ttfb !== undefined && (
                <div>
                  <span className="text-muted-foreground">TTFB:</span>{" "}
                  {formatMetric(webVitals.ttfb)}
                </div>
              )}
              {webVitals.inp !== undefined && (
                <div>
                  <span className="text-muted-foreground">INP:</span>{" "}
                  {formatMetric(webVitals.inp)}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
