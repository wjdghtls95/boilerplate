import { SetMetadata } from '@nestjs/common';

export const TYPEORM_ENTITY_REPOSITORY = 'TYPEORM_ENTITY_REPOSITORY';

// eslint-disable-next-line @typescript-eslint/ban-types
export function EntityRepository(entity: Function): ClassDecorator {
  return SetMetadata(TYPEORM_ENTITY_REPOSITORY, entity);
}
