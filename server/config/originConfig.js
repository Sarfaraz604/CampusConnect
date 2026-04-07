const normalizeOrigin = (origin) => {
  if (!origin || typeof origin !== 'string') {
    return '';
  }

  return origin.trim().replace(/\/+$/, '');
};

const getFrontendOrigin = () =>
  normalizeOrigin(process.env.FRONTEND_URL || process.env.VITE_API_BASE_URL);

const getAllowedOrigins = () => {
  const origins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    getFrontendOrigin(),
  ].filter(Boolean);

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

  callback(new Error(`Not allowed by CORS: ${origin}`));
};

module.exports = {
  corsOriginHandler,
  getAllowedOrigins,
  getFrontendOrigin,
  isAllowedOrigin,
  normalizeOrigin,
};
