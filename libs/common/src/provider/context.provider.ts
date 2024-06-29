import { ClsServiceManager } from 'nestjs-cls';
import { QueryRunner } from 'typeorm';
import * as process from 'process';
import { Session } from '@libs/dao/redis/session/session.entity';

// test debugging 용
export const context = {};

export class ContextProvider {
  static get<T>(key: string): T {
    return process.env.NODE_ENV === 'test'
      ? context[key]
      : ClsServiceManager.getClsService().get(key);
  }

  static set<T>(key: string, value: T): void {
    process.env.NODE_ENV === 'test'
      ? (context[key] = value)
      : ClsServiceManager.getClsService().set(key, value);
  }

  static getSession(): Session {
    return ContextProvider.get('session');
  }

  static setSession(value: Session): void {
    ContextProvider.set('session', value);
  }

  static getNow(): Date {
    return ContextProvider.get('now');
  }

  static setNow(now: Date): void {
    ContextProvider.set('now', now);
  }
}
