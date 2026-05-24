"use client";

import { useEffect, useRef, useState } from "react";

import { getOrderStatus } from "@/services/order";
import { isTerminalOrderStatus } from "@/constants/orderStatus";

// Polls GET /api/orders/{id}/status while the order is still Unpaid.
// Uses recursive setTimeout (not setInterval) so a slow response can't trigger
// overlapping fetches, and an in-flight fetch can be ignored on unmount.
// Pauses when the tab is hidden — BE will mark the order Expired on its own
// timer, so we don't lose correctness by skipping polls.
export function useOrderStatus(orderId, { intervalMs = 3000 } = {}) {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  // Latest setStatus result, kept in a ref so the scheduler can stop polling
  // once the order reaches a terminal state without re-running the effect.
  const latestStatusRef = useRef(null);

  useEffect(() => {
    if (!orderId) {
      setStatus(null);
      setIsPolling(false);
      return;
    }

    let cancelled = false;
    let timer = null;
    setIsPolling(true);

    const runOnce = async () => {
      try {
        const res = await getOrderStatus(orderId);
        if (cancelled) return;
        const data = res?.data ?? res;
        setStatus(data);
        latestStatusRef.current = data;
        setError(null);
      } catch (err) {
        if (cancelled) return;
        // Keep polling on transient errors — the user may simply be offline
        // for a moment. We surface the error so the view can show a "đang
        // thử lại" hint, but we don't stop the loop.
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    const schedule = () => {
      if (cancelled) return;
      const current = latestStatusRef.current;
      if (current && isTerminalOrderStatus(current.status)) {
        setIsPolling(false);
        return;
      }
      // Skip the fetch while the tab is hidden, but keep checking — the user
      // may return at any time and we want the UI to refresh promptly.
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        timer = setTimeout(schedule, intervalMs);
        return;
      }
      runOnce().finally(() => {
        if (cancelled) return;
        const latest = latestStatusRef.current;
        if (latest && isTerminalOrderStatus(latest.status)) {
          setIsPolling(false);
          return;
        }
        timer = setTimeout(schedule, intervalMs);
      });
    };

    schedule();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      setIsPolling(false);
    };
  }, [orderId, intervalMs]);

  return { status, error, isPolling };
}
