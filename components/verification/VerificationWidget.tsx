"use client";

import { useEffect, useRef } from "react";
import type { VerificationStatus } from "@/lib/types";

const verificationStatuses: readonly string[] = [
  "not_opened",
  "started",
  "submitted",
  "abandoned",
  "approved",
  "reproved",
  "review",
];

function isVerificationStatus(value: unknown): value is VerificationStatus {
  return typeof value === "string" && verificationStatuses.includes(value);
}

interface Props {
  sdkUrl: string;
  onComplete: (status: VerificationStatus) => void;
}

export function VerificationWidget({ sdkUrl, onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let completed = false;
    let destroyed = false;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    let handle: { destroy: () => void } | undefined;

    const destroy = () => {
      if (destroyed) return;
      destroyed = true;
      handle?.destroy();
    };

    const finish = (status: unknown) => {
      if (completed || !isVerificationStatus(status)) return;
      completed = true;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      onComplete(status);
    };

    handle = window.Legitimuz.mount({
      sdkUrl,
      target: containerRef.current,
      onReady: () => console.info("widget pronto"),
      onComplete: (result) => {
        if (completed || fallbackTimer) return;
        fallbackTimer = setTimeout(() => finish(result.status), 2000);
      },
      onError: (error) => console.error(error.code, error.user_message),
      onEvent: (event) => {
        if (event.type === "session.completed") {
          destroy();
          finish(event.payload?.status);
        }
      },
    });

    return () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      destroy();
    };
  }, [onComplete, sdkUrl]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}