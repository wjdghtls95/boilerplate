import { QueryRunner } from 'typeorm';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { getDataSource } from '@libs/common/database/typeorm/typeorm-ex.module';

export class TypeOrmHelper {
  static async Transactional(
    dataSourceNames: string[],
  ): Promise<Record<string, QueryRunner>> {
    // 중복 생성 방지
    const uniqueDataSourceNames = dataSourceNames.distinct();

    const existQueryRunners = ContextProvider.getQueryRunners() ?? {};

    const newDataSourceNames = uniqueDataSourceNames.filter(
      (name) => !existQueryRunners[name],
    );

    const newQueryRunners =
      await TypeOrmHelper.getQueryRunners(newDataSourceNames);

    await TypeOrmHelper.startTransactions([
      ...Object.values(existQueryRunners).filter(
        (it) => !it.isTransactionActive,
      ),
      ...Object.values(newQueryRunners),
    ]);

    const allQueryRunners = { ...existQueryRunners, ...newQueryRunners };

    ContextProvider.setQueryRunners(allQueryRunners);

    return allQueryRunners;
  }

  // Internal Functions
  static async getQueryRunner(dataSourceName: string): Promise<QueryRunner> {
    const dataSource = getDataSource(dataSourceName);
    if (!dataSource) return null;

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    return queryRunner;
  }

  static async getQueryRunners(
    dataSourceNames: string[],
  ): Promise<Record<string, QueryRunner>> {
    const dataSources = await Promise.all(
      dataSourceNames.map((it) => TypeOrmHelper.getQueryRunner(it)),
    );

    return Object.fromEntries(
      dataSources.filter((it) => !!it).map((it) => [it.connection.name, it]),
    );
  }

  static async startTransactions(queryRunners: QueryRunner[]): Promise<void> {
    await Promise.all(queryRunners.map((it) => it.startTransaction()));
  }

  static async commitTransactions(queryRunners: QueryRunner[]): Promise<void> {
    await Promise.all(queryRunners.map((it) => it.commitTransaction()));
  }

  static async rollbackTransactions(
    queryRunners: QueryRunner[],
  ): Promise<void> {
    await Promise.all(queryRunners.map((it) => it.rollbackTransaction()));
  }

  static async releases(queryRunners: QueryRunner[]): Promise<void> {
    await Promise.all(queryRunners.map((it) => it.release()));
  }
}
