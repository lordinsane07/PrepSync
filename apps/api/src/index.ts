import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/db';
import { connectRedis } from './config/redis';

async function start(): Promise<void> {
  try {
    // Connect to databases
    await connectDatabase();
    connectRedis();

    // Start server
    app.listen(env.PORT, () => {
      console.log(`[Server] Running on port ${env.PORT}`);
      console.log(`[Server] Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
}

start();
