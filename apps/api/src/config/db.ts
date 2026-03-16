import mongoose from 'mongoose';
import { env } from './env';

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('[MongoDB] Connected successfully');
  } catch (error) {
    if (env.NODE_ENV === 'development') {
      console.warn('[MongoDB] Connection failed — running without database.');
      console.warn('[MongoDB] Start a local MongoDB or provide a MongoDB Atlas URI in MONGODB_URI.');
    } else {
      console.error('[MongoDB] Connection failed:', error);
      process.exit(1);
    }
  }

  mongoose.connection.on('error', (error) => {
    console.error('[MongoDB] Runtime error:', error);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Disconnected');
  });
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
