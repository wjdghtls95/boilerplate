import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '@libs/dao/base/time/base-time.entity';
import { compare } from 'bcrypt';
import { ADMIN_ROLE_TYPE } from '@libs/dao/admin/admin-user/role.constants';

@Entity('admin_user')
export class AdminUser extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ comment: '관리자 아이디', unsigned: true })
  id: number;

  @Index({ unique: true })
  @Column({ comment: '관리자 이메일' })
  email: string;

  @Column({
    comment: '관리자 권한',
    type: 'enum',
    enum: ADMIN_ROLE_TYPE,
    default: ADMIN_ROLE_TYPE.GUEST,
  })
  role: ADMIN_ROLE_TYPE;

  @Column({ comment: '비밀번호' })
  password: string;

  async checkPassword(password: string): Promise<boolean> {
    try {
      return await compare(password, this.password);
    } catch (e) {
      throw new Error(e);
    }
  }
}
