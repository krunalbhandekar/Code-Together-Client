import React, { useCallback, useEffect, useRef, useState } from "react";
import { BASE_URL } from "../constants/api";

// The server runs on Render's free plan, which sleeps after ~15 minutes idle
// and takes up to about a minute to start again. While it starts, show a
// centered overlay so users know the app is working, not broken.

const SHOW_AFTER_MS = 1500; // a normal response arrives before this, so no flash
const ATTEMPT_TIMEOUT_MS = 10000;
const RETRY_DELAY_MS = 3000;
const RECHECK_AFTER_IDLE_MS = 10 * 60 * 1000; // re-check when the tab returns after this long
const SLOW_HINT_AFTER_S = 90;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const pingServer = async () => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ATTEMPT_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}/`, {
      signal: controller.signal,
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
};

const ServerWakeup = () => {
  const [visible, setVisible] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const checkingRef = useRef(false);
  const mountedRef = useRef(true);
  const lastOkRef = useRef(0);

  const checkServer = useCallback(async () => {
    if (checkingRef.current) return;
    checkingRef.current = true;

    const startedAt = Date.now();
    const showTimer = setTimeout(() => setVisible(true), SHOW_AFTER_MS);
    const ticker = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    while (mountedRef.current && !(await pingServer())) {
      await wait(RETRY_DELAY_MS);
    }

    clearTimeout(showTimer);
    clearInterval(ticker);
    lastOkRef.current = Date.now();
    checkingRef.current = false;
    if (mountedRef.current) {
      setVisible(false);
      setElapsed(0);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    checkServer();

    // The server may have gone back to sleep while the tab was in the background.
    const onVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        Date.now() - lastOkRef.current > RECHECK_AFTER_IDLE_MS
      ) {
        checkServer();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      mountedRef.current = false;
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [checkServer]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="server-wakeup-title"
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-2xl"
        role="status"
        aria-live="polite"
      >
        <div
          className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
          aria-hidden="true"
        />
        <h2
          id="server-wakeup-title"
          className="mb-3 text-xl font-bold text-gray-800"
        >
          Waking up the server…
        </h2>
        <p className="mb-4 text-gray-600">
          This project runs on Render's free plan, which puts the server to
          sleep when no one is using it. Starting it again usually takes 30 to
          60 seconds. Thanks for waiting!
        </p>
        <p className="text-sm text-gray-500">Waiting for {elapsed}s</p>

        {elapsed >= SLOW_HINT_AFTER_S && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <p className="mb-3 text-sm text-gray-600">
              This is taking longer than usual. You can keep waiting or reload
              the page.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Reload page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerWakeup;
