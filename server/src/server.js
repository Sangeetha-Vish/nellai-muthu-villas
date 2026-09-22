import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import apiRouter from './routes/api.js';

const app = express();

app.use(cors({
  origin: [env.clientUrl, env.adminUrl],
  credentials: true,
}));
app.use(express.json());
app.use('/api', apiRouter);
app.use((error, _request, response, _next) => {
  console.error('[API Error]', error);
  response.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
});

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});

export { app };
