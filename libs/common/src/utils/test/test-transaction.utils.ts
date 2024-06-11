import { TypeOrmHelper } from '@libs/common/database/typeorm/typeorm.helper';
import { ContextProvider } from '@libs/common/provider/context.provider';

export class TestTransactionUtils {
  static async executeWithTransaction<T>(
    supplier: () => Promise<T>,
    databaseNames?: string[],
  ): Promise<T> {
    try {
      const session = ContextProvider.getSession();

      const databases = session
        ? [session.database, ...(databaseNames || [])]
        : databaseNames;

      await TypeOrmHelper.Transactional(databases);

      return await supplier();
    } finally {
      await TestTransactionUtils.rollback();
    }
  }

  static async rollback(): Promise<void> {
    await TypeOrmHelper.rollbackTransactions();
    await TypeOrmHelper.releases();

    TypeOrmHelper.releaseQueryRunner();
  }
}
