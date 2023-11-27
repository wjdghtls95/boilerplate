import { gameShardDatabases } from '@libs/common/database/typeorm/typeorm-module.options';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { TestingModule } from '@nestjs/testing';
import { DATABASE_NAME } from '@libs/common/constants/database.constants';

export class TestDataSourceUtils {
  static async clearDataSource(module: TestingModule): Promise<void> {
    const dataSourcesMap = new Map<string, DataSource>();

    for (const database of Object.values(DATABASE_NAME)) {
      if (dataSourcesMap.has(database)) {
        continue;
      }

      try {
        const datasource = module.get<DataSource>(getDataSourceToken(database));

        dataSourcesMap.set(database, datasource);
      } catch (e) {}
    }

    for (const database of gameShardDatabases) {
      try {
        dataSourcesMap.set(
          database,
          module.get<DataSource>(getDataSourceToken(database)),
        );
      } catch (e) {}
    }

    // release
    if (dataSourcesMap.size) {
      await Promise.all(
        [...dataSourcesMap.values()].map((dataSource) => dataSource.destroy()),
      );
    }
  }
}
