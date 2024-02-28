// @ts-check

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const migrations = {
  directory: path.join(__dirname, 'server', 'migrations'),
};

export const production = {
  client: 'pg',
  connection: {
    connectionString: process.env.DB_CONNECTION_STRING,
  },
  useNullAsDefault: true,
  migrations,
};

export const development = {
  ...production,
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, 'database.sqlite'),
  },
  debug: true
};

export const test = {
  ...development,
  connection: ':memory:',
};

