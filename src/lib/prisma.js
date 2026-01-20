import { PrismaClient } from '@prisma/client';

// PrismaClient requires a non-empty options object in this runtime build,
// pass an empty object to satisfy the constructor check while using
// the generated client.
export const prisma = global.prisma ?? new PrismaClient({});

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
