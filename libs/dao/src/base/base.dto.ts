import { instanceToPlain, plainToInstance } from 'class-transformer';

export abstract class BaseDto {
  public static fromEntity<Dto, Entity>(
    this: { new (): Dto },
    entity: Entity,
  ): Dto {
    return plainToInstance(this, instanceToPlain(entity));
  }

  public static fromEntities<Dto, Entity>(
    this: { new (): Dto },
    entities: Entity[],
  ): Dto[] {
    return plainToInstance(this, instanceToPlain(entities) as Entity[]);
  }

  _validate: boolean;
}
