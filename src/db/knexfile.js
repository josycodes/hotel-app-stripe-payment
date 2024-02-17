import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const knexConfig = {
  production: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      ssl: { rejectUnauthorized: false },
    },
  },
};

export default knexConfig;
