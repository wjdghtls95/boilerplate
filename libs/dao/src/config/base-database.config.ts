import { registerAs } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export default registerAs('base-database', () => ({
  type: 'mysql' as const,
  namingStrategy: new SnakeNamingStrategy(),
  charset: 'utf8mb4',
  timezone: 'Z',
  extra: {
    connectionLimit:
      process.env.NODE_ENV === 'prod'
        ? Number(process.env.DB_CONNECTION_LIMIT)
        : 10,
  },
  maxQueryExecutionTime: 1000,
  // logging: ['query'],
}));
