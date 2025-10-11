import { useRef, useState } from "react";

export function useThrottle(fn, limit = 800) {
  const lastRun = useRef(0);
  const [pending, setPending] = useState(false);

  const throttled = (...args) => {
    const now = Date.now();
    if (now - lastRun.current >= limit && !pending) {
      lastRun.current = now;
      const res = fn(...args);
      setPending(true);
      Promise.resolve(res).finally(() => setPending(false));
    }
  };

  return { throttled, pending };
}
