import { TypeOrmHelper } from '@libs/common/database/typeorm/typeorm.helper';
import {
  DATABASE_NAME,
  DataBaseName,
} from '@libs/common/constants/database.constants';
import { ContextProvider } from '@libs/common/provider/context.provider';

/**
 * 게임 데이터 베이스 포함
 * With Shard Database
 */
export function Transactional(
  ...databaseNames: DataBaseName[]
): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originMethod = descriptor.value;

    descriptor.value = async function (
      ...originMethodArgs: any[]
    ): Promise<PropertyDescriptor> {
      const { database } = ContextProvider.getSession();

      const validateDatabase = databaseNames.filter((name) =>
        Object.values(DATABASE_NAME)
          .filter((name) => !!name)
          .includes(name),
      );

      await TypeOrmHelper.Transactional([...validateDatabase, database]);

      return await originMethod.apply(this, originMethodArgs);
    };

    return descriptor;
  };
}

/**
 * 게임 데이터 베이스 비 포함
 * Without Shard Database
 */
export function TransactionalEx(
  ...databaseNames: DataBaseName[]
): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originMethod = descriptor.value;

    descriptor.value = async function (
      ...originMethodArgs: any[]
    ): Promise<PropertyDescriptor> {
      const validateDatabase = databaseNames.filter((name) =>
        Object.values(DATABASE_NAME)
          .filter((name) => !!name)
          .includes(name),
      );

      await TypeOrmHelper.Transactional(validateDatabase);

      return await originMethod.apply(this, originMethodArgs);
    };

    return descriptor;
  };
}
