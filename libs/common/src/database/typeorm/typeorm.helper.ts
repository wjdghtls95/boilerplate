import { getDataSource } from '@libs/common/database/typeorm/typeorm-ex.module';
import { QueryRunner } from 'typeorm';
import { ContextProvider } from '@libs/common/provider/context.provider';

export class TypeOrmHelper {
  static async Transactional(
    dataSourceNames: (string | Uint8Array)[],
  ): Promise<Record<string, QueryRunner>> {
    // 중복 생성 방지
    const uniqueDataSourceNames = dataSourceNames.distinct();

    const existQueryRunners = TypeOrmHelper.getQueryRunners() ?? {};

    const newDataSourceNames: string[] = uniqueDataSourceNames
      .filter((name: string) => !existQueryRunners[name])
      .map((it) => it as string);

    const newQueryRunners =
      await TypeOrmHelper.createQueryRunners(newDataSourceNames);

    await TypeOrmHelper.startTransactions([
      ...Object.values(existQueryRunners).filter(
        (it) => !it.isTransactionActive,
      ),
      ...Object.values(newQueryRunners),
    ]);

    const allQueryRunners = { ...existQueryRunners, ...newQueryRunners };

    TypeOrmHelper.setQueryRunners(allQueryRunners);

    return allQueryRunners;
  }

  static async createQueryRunner(dataSourceName: string): Promise<QueryRunner> {
    const dataSource = getDataSource(dataSourceName);
    if (!dataSource) return null;

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    return queryRunner;
  }

  static async createQueryRunners(
    dataSourceNames: string[],
  ): Promise<Record<string, QueryRunner>> {
    const dataSources = await Promise.all(
      dataSourceNames.map((it) => TypeOrmHelper.createQueryRunner(it)),
    );

    return Object.fromEntries(
      dataSources.filter((it) => !!it).map((it) => [it.connection.name, it]),
    );
  }

  static async startTransactions(queryRunners: QueryRunner[]): Promise<void> {
    await Promise.all(queryRunners.map((it) => it.startTransaction()));
  }

  static async commitTransactions(): Promise<void> {
    const queryRunnerRecord = TypeOrmHelper.getQueryRunners();
    if (!queryRunnerRecord) {
      return;
    }

    const queryRunners = Object.values(queryRunnerRecord).filter(
      (it) => it.isTransactionActive,
    );

    if (!queryRunners?.length) {
      return;
    }

    await Promise.all(queryRunners.map((it) => it.commitTransaction()));
  }

  static async rollbackTransactions(): Promise<void> {
    const queryRunnerRecord = TypeOrmHelper.getQueryRunners();
    if (!queryRunnerRecord) {
      return;
    }

    const queryRunners = Object.values(queryRunnerRecord).filter(
      (it) => it.isTransactionActive,
    );

    if (!queryRunners?.length) {
      return;
    }

    await Promise.all(queryRunners.map((it) => it.rollbackTransaction()));
  }

  static async releases(): Promise<void> {
    const queryRunnerRecord = TypeOrmHelper.getQueryRunners();
    if (!queryRunnerRecord) {
      return;
    }

    const queryRunners = Object.values(queryRunnerRecord).filter(
      (it) => !it.isReleased,
    );

    if (!queryRunners?.length) {
      return;
    }

    await Promise.all(queryRunners.map((it) => it.release()));
  }

  static setQueryRunners(queryRunners: Record<string, QueryRunner>): void {
    ContextProvider.set('queryRunners', queryRunners);
  }

  static addQueryRunner(database: string, queryRunner: QueryRunner): void {
    const queryRunners = this.getQueryRunners() ?? {};

    if (queryRunners[database]) {
      return;
    }

    queryRunners[database] = queryRunner;

    this.setQueryRunners(queryRunners);
  }

  static getQueryRunners(): Record<string, QueryRunner> {
    return ContextProvider.get('queryRunners');
  }

  static getQueryRunner(database: string): QueryRunner {
    const queryRunners = TypeOrmHelper.getQueryRunners();

    return !queryRunners || Object.values(queryRunners).isEmpty()
      ? undefined
      : queryRunners[database];
  }

  static releaseQueryRunner(): void {
    ContextProvider.set('queryRunners', undefined);
  }
}
