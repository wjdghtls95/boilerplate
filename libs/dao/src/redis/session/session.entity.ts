import { randomUUID } from 'crypto';

export class Session {
  id: string;
  nid: string;
  userId: number;
  gameDbId: number;
  database: string;
  nickName: string;

  static create(partial?: Partial<Session>): Session {
    return Object.assign(new this(), { id: randomUUID(), ...partial });
  }
}
