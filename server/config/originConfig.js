// Hardcoded allowed origins — no env vars required
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://campus-connect-53ua.vercel.app',   // frontend (no trailing slash)
  'https://campusconnect-2-c1s6.onrender.com', // backend (for same-origin API calls)
];

const normalizeOrigin = (origin) => {
  if (!origin || typeof origin !== 'string') return '';
  return origin.trim().replace(/\/+$/, '');
};

const getAllowedOrigins = () => ALLOWED_ORIGINS;

const getFrontendOrigin = () => 'https://campus-connect-53ua.vercel.app';

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // allow server-to-server / curl
  return ALLOWED_ORIGINS.includes(normalizeOrigin(origin));
};

const corsOriginHandler = (origin, callback) => {
  if (isAllowedOrigin(origin)) {
    callback(null, true);
  } else {
    console.warn(`CORS blocked: ${origin}`);
    callback(new Error(`Not allowed by CORS: ${origin}`));
  }
};

module.exports = {
  corsOriginHandler,
  getAllowedOrigins,
  getFrontendOrigin,
  isAllowedOrigin,
  normalizeOrigin,
};
