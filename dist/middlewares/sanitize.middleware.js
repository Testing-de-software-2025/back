"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeMiddleware = sanitizeMiddleware;
let xssLib = null;
try {
    const xss = require('xss');
    if (typeof xss === 'function') {
        xssLib = xss;
    }
    else if (xss && typeof xss.filterXSS === 'function') {
        xssLib = (v) => xss.filterXSS(v);
    }
}
catch (e) {
}
function escapeBasic(s) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}
function sanitizeValue(value) {
    if (typeof value === 'string') {
        try {
            if (xssLib)
                return xssLib(value);
        }
        catch (e) {
        }
        return escapeBasic(value);
    }
    if (Array.isArray(value))
        return value.map(sanitizeValue);
    if (value && typeof value === 'object')
        return sanitizeObject(value);
    return value;
}
function sanitizeObject(obj) {
    if (!obj || typeof obj !== 'object')
        return obj;
    for (const k of Object.keys(obj)) {
        try {
            obj[k] = sanitizeValue(obj[k]);
        }
        catch (e) {
        }
    }
    return obj;
}
function sanitizeMiddleware(req, _res, next) {
    if (req.body)
        sanitizeObject(req.body);
    if (req.query)
        sanitizeObject(req.query);
    if (req.params)
        sanitizeObject(req.params);
    next();
}
//# sourceMappingURL=sanitize.middleware.js.map