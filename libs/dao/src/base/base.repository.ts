import { EntityManager, Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { getCustomRepository } from '@libs/common/database/typeorm/typeorm-ex.module';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { ClassConstructor } from 'class-transformer';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { InsertResult } from 'typeorm/query-builder/result/InsertResult';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { SaveOptions } from 'typeorm/repository/SaveOptions';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { TypeOrmHelper } from '@libs/common/database/typeorm/typeorm.helper';

export abstract class BaseRepository<Entity> extends Repository<Entity> {
  protected readonly alias: string = this.metadata.tableName;

  private get entityManager(): EntityManager {
    const queryRunner = TypeOrmHelper.getQueryRunner(
      this.metadata.connection.name,
    );

    return queryRunner ? queryRunner.manager : this.manager;
  }

  protected getQueryBuilder(): SelectQueryBuilder<Entity> {
    return this.entityManager.createQueryBuilder(this.target, this.alias);
  }

  async findById(id: number): Promise<Entity> {
    return await this.getQueryBuilder()
      .where(`${this.alias}.id=:id`, { id: id })
      .getOne();
  }

  async findByIdIn(ids: number[]): Promise<Entity[]> {
    return await this.getQueryBuilder().whereInIds(ids).getMany();
  }

  async insert(
    entityOrEntities:
      | QueryDeepPartialEntity<Entity>
      | QueryDeepPartialEntity<Entity>[],
  ): Promise<InsertResult> {
    return await this.getQueryBuilder()
      .insert()
      .values(entityOrEntities)
      .execute();
  }

  async upsert(
    entityOrEntities:
      | QueryDeepPartialEntity<Entity>
      | QueryDeepPartialEntity<Entity>[],
    conflictPathsOrOptions: string[] | UpsertOptions<Entity>,
  ): Promise<InsertResult> {
    return await this.entityManager.upsert(
      this.target,
      entityOrEntities,
      conflictPathsOrOptions,
    );
  }

  async save<T>(entity: T, options?: SaveOptions): Promise<T>;

  async save<T>(entities: T[], options?: SaveOptions): Promise<T[]>;

  async save<T>(
    entityOrEntities: T | T[],
    options?: SaveOptions,
  ): Promise<T | T[]> {
    return await this.entityManager.save(entityOrEntities, options);
  }

  async updateById<Entity>(
    id: number,
    values: QueryDeepPartialEntity<Entity>,
  ): Promise<UpdateResult> {
    const result = await this.getQueryBuilder()
      .update(this.alias)
      .set(values)
      .where(`${this.alias}.id=:id`, { id: id })
      .execute();

    if (!result.affected) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.DB_UPDATE_FAILED,
        `${this.alias.toUpperCase()}_DB_UPDATE_FAILED`,
      );
    }

    return result;
  }

  async updateByIdIn<Entity>(
    ids: number[],
    values: QueryDeepPartialEntity<Entity>,
  ): Promise<UpdateResult> {
    const result = await this.getQueryBuilder()
      .update(this.alias)
      .set(values)
      .whereInIds(ids)
      .execute();

    if (!result.affected) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.DB_UPDATE_FAILED,
        `${this.alias.toUpperCase()}_DB_UPDATE_FAILED`,
      );
    }

    return result;
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return await this.getQueryBuilder()
      .delete()
      .from(this.alias)
      .where(`${this.alias}.id = :id`, { id: id })
      .execute();
  }

  async deleteByIdIn(ids: number[]): Promise<DeleteResult> {
    return await this.getQueryBuilder()
      .delete()
      .from(this.alias)
      .whereInIds(ids)
      .execute();
  }

  static instance<T>(this: ClassConstructor<T>, database: string): T {
    return getCustomRepository(this, database);
  }
}
