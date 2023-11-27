import { ContextProvider } from '@libs/common/provider/context.provider';
import { TypeOrmHelper } from '@libs/common/database/typeorm/typeorm.helper';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';

export function UserLevelLock(): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originMethod = descriptor.value;

    descriptor.value = async function (
      ...originMethodArgs: any[]
    ): Promise<PropertyDescriptor> {
      const { userId, database } = ContextProvider.getSession();

      const queryRunner = await TypeOrmHelper.getQueryRunner(database);

      const USER_LEVEL_LOCK_TIME = 3;

      // lock
      const result = await queryRunner.query(
        `SELECT GET_LOCK('${userId}', ${USER_LEVEL_LOCK_TIME});`,
      );

      // check result
      if (Number(Object.values(result[0])[0]) !== 1) {
        throw new ServerErrorException(
          INTERNAL_ERROR_CODE.DB_USER_LEVEL_LOCK_NOT_RELEASE,
        );
      }

      ContextProvider.addQueryRunner(database, queryRunner);

      return await originMethod.apply(this, originMethodArgs);
    };

    Object.defineProperty(descriptor.value, 'name', {
      value: propertyKey,
    });

    return descriptor;
  };
}
