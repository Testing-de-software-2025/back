import { Request, Response, NextFunction } from 'express';

let xssLib: ((input: string) => string) | null = null;
try {
  // Intentar cargar xss si está instalado
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const xss = require('xss');
  if (typeof xss === 'function') {
    xssLib = xss;
  } else if (xss && typeof xss.filterXSS === 'function') {
    xssLib = (v: string) => xss.filterXSS(v);
  }
} catch (e) {
  // no-op, usaremos fallback
}

function escapeBasic(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function sanitizeValue(value: any): any {
  if (typeof value === 'string') {
    try {
      if (xssLib) return xssLib(value);
    } catch (e) {
      // si falla xss, caemos al fallback
    }
    return escapeBasic(value);
  }
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === 'object') return sanitizeObject(value);
  return value;
}

function sanitizeObject(obj: any) {
  if (!obj || typeof obj !== 'object') return obj;
  for (const k of Object.keys(obj)) {
    try {
      obj[k] = sanitizeValue(obj[k]);
    } catch (e) {
      // ignore per-field errors
    }
  }
  return obj;
}

export function sanitizeMiddleware(req: Request, _res: Response, next: NextFunction) {
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  next();
}
