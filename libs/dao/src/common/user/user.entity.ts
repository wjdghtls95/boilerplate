import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '@libs/dao/base/time/base-time.entity';

@Entity('user')
export class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ comment: '유저 아이디', unsigned: true })
  id: number;

  @Index({ unique: true })
  @Column({ comment: '유저 nid' })
  nid: string;

  @Index({ unique: true })
  @Column({ comment: '유저 닉네임', nullable: true })
  nickName: string;

  @Column({
    comment: '유저 게임 데이터베이스 아이디(샤드 넘버)',
    type: 'tinyint',
    unsigned: true,
    default: 0,
  })
  gameDbId: number;
}
