/// <reference types="vite/client" />

const isDev: boolean = import.meta.env.DEV;

const logger = {
  log:   (...args: unknown[]) => { if (isDev) console.log(...args); },
  info:  (...args: unknown[]) => { if (isDev) console.info(...args); },
  warn:  (...args: unknown[]) => { if (isDev) console.warn(...args); },
  error: (...args: unknown[]) => { if (isDev) console.error(...args); },
  debug: (...args: unknown[]) => { if (isDev) console.debug(...args); },
};

export default logger;
