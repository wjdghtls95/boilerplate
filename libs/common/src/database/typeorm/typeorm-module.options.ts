import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export function getGameDbIdFromUserId(userId: number): number {
  const enableDbList = Object.keys(gameTypeOrmModuleOptions).map((it) =>
    Number(it),
  );
  const shardId = enableDbList.length;
  const dbIndex = userId % shardId;
  return enableDbList[dbIndex];
}

export function getDatabaseByGameDbId(gameDbId: number): string {
  return gameTypeOrmModuleOptions[gameDbId].database;
}

export const defaultTypeOrmOptions: DataSourceOptions = {
  type: 'mysql',
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
};

export const gameBaseTypeOrmModuleOptions = {
  ...defaultTypeOrmOptions,

  entities: ['dist/libs/dao/src/game/**/*.entity.!(js.map){,+(ts,js)}'],
};

export const gameTypeOrmModuleOptions = {
  100: {
    ...gameBaseTypeOrmModuleOptions,
    host: process.env.GAME00_DB_HOST,
    port: Number(process.env.GAME00_DB_PORT),
    username: process.env.GAME00_DB_ID,
    password: process.env.GAME00_DB_PW,
    name: process.env.GAME00_DB_NAME,
    database: process.env.GAME00_DB_NAME,
    synchronize:
      process.env.GAME00_DB_SYNCHRONIZE &&
      JSON.parse(process.env.GAME00_DB_SYNCHRONIZE),
  },
  101: {
    ...gameBaseTypeOrmModuleOptions,
    host: process.env.GAME01_DB_HOST,
    port: Number(process.env.GAME01_DB_PORT),
    username: process.env.GAME01_DB_ID,
    password: process.env.GAME01_DB_PW,
    name: process.env.GAME01_DB_NAME,
    database: process.env.GAME01_DB_NAME,
    synchronize:
      process.env.GAME01_DB_SYNCHRONIZE &&
      JSON.parse(process.env.GAME01_DB_SYNCHRONIZE),
  },
};

export const gameShardDatabases: string[] = Object.values(
  gameTypeOrmModuleOptions,
).map((it) => it.database);

export const commonTypeOrmModuleOptions: DataSourceOptions = {
  ...defaultTypeOrmOptions,
  host: process.env.COMMON_DB_HOST,
  port: Number(process.env.COMMON_DB_PORT),
  username: process.env.COMMON_DB_ID,
  password: process.env.COMMON_DB_PW,
  name: process.env.COMMON_DB_NAME,
  database: process.env.COMMON_DB_NAME,
  entities: ['dist/libs/dao/src/common/**/*.entity.!(js.map){,+(ts,js)}'],
  synchronize:
    process.env.COMMON_DB_SYNCHRONIZE &&
    JSON.parse(process.env.COMMON_DB_SYNCHRONIZE),
};
