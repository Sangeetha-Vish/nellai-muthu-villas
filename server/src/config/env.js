import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'development-secret',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:3001',
};
