// lib/ticker.ts
// Background-safe interval. Browsers throttle main-thread timers in hidden
// tabs (Chrome: ~1/min), which delays the break chime and notification by up
// to a minute. Web Worker timers are exempt from tab-visibility throttling,
// so the tick keeps firing on schedule.

const WORKER_SOURCE = `
let id = null;
onmessage = (e) => {
  if (e.data === 'start' && id === null) {
    id = setInterval(() => postMessage(0), 250);
  } else if (e.data === 'stop' && id !== null) {
    clearInterval(id);
    id = null;
  }
};
`;

export type Ticker = { stop: () => void };

// Starts calling onTick ~every 250ms; falls back to setInterval when Workers
// are unavailable (old browsers, some embedded webviews).
export function startTicker(onTick: () => void): Ticker {
  if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
    try {
      const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: 'text/javascript' }));
      const worker = new Worker(url);
      URL.revokeObjectURL(url);
      worker.onmessage = onTick;
      worker.postMessage('start');
      return {
        stop: () => {
          worker.postMessage('stop');
          worker.terminate();
        },
      };
    } catch {
      // CSP or webview restrictions — fall back below.
    }
  }
  const id = setInterval(onTick, 250);
  return { stop: () => clearInterval(id) };
}
