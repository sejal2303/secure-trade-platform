import dotenv from 'dotenv';
dotenv.config();
export const CONFIG = {
PORT: process.env.PORT || 8080,
JWT_SECRET: process.env.JWT_SECRET || 'change-me',
DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/trades',
CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};