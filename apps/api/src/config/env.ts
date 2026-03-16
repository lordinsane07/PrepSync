interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  MONGODB_URI: string;
  REDIS_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  CLIENT_URL: string;
}

function getEnvVar(name: string, required = true): string {
  const value = process.env[name];
  if (!value && required) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || '';
}

function getEnvVarWithDefault(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

export function validateEnv(): EnvConfig {
  return {
    PORT: parseInt(getEnvVarWithDefault('PORT', '3001'), 10),
    NODE_ENV: getEnvVarWithDefault('NODE_ENV', 'development'),
    MONGODB_URI: getEnvVar('MONGODB_URI'),
    REDIS_URL: getEnvVar('REDIS_URL'),
    JWT_ACCESS_SECRET: getEnvVar('JWT_ACCESS_SECRET'),
    JWT_REFRESH_SECRET: getEnvVar('JWT_REFRESH_SECRET'),
    CLIENT_URL: getEnvVarWithDefault('CLIENT_URL', 'http://localhost:5173'),
  };
}

export const env = validateEnv();
