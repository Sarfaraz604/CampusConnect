const normalizeOrigin = (origin) => {
  if (!origin || typeof origin !== 'string') {
    return '';
  }

  return origin.trim().replace(/\/+$/, '');
};

// FRONTEND_URL is the deployed frontend URL (e.g. https://campus-connect-53ua.vercel.app)
// Do NOT use VITE_API_BASE_URL here — that is the backend URL, not the frontend.
const getFrontendOrigin = () =>
  normalizeOrigin(process.env.FRONTEND_URL);

const getAllowedOrigins = () => {
  const staticOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://campus-connect-53ua.vercel.app/',
    'https://campusconnect-2-c1s6.onrender.com',
    'http://127.0.0.1:3000',
    getFrontendOrigin(),
  ];

  // Support comma-separated extra origins via ALLOWED_ORIGINS env var
  const extraOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : [];

  const origins = [...staticOrigins, ...extraOrigins].filter(Boolean);

  return [...new Set(origins.map(normalizeOrigin).filter(Boolean))];
};

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  return getAllowedOrigins().includes(normalizeOrigin(origin));
};

const corsOriginHandler = (origin, callback) => {
  if (isAllowedOrigin(origin)) {
    callback(null, true);
    return;
  }

  console.warn(`CORS blocked origin: ${origin}`);
  console.warn(`Allowed origins: ${getAllowedOrigins().join(', ')}`);
  callback(new Error(`Not allowed by CORS: ${origin}`));
};

module.exports = {
  corsOriginHandler,
  getAllowedOrigins,
  getFrontendOrigin,
  isAllowedOrigin,
  normalizeOrigin,
};
