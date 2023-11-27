import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '@libs/dao/base/time/base-time.entity';

@Entity('user_detail')
export class UserDetail extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ comment: '유저 아이디', unsigned: true })
  userId: number;

  @Column({
    comment: '로그인 시간',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  loginAt: Date;
}
