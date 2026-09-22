export function errorMiddleware(err, _req, res, _next) {
  console.error('[Server Error]', err);

  const status = err.status || 500;
  const message = status === 500 ? 'Internal server error' : err.message;

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}
