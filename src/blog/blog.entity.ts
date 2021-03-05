import { Entity, Column, AfterInsert } from 'typeorm';

// DOMAIN
import { DOMAIN } from '@/constant';

// BASE CLASS
import { BaseEntity } from '@/base/base.entity';

// FIREBASE
import * as admin from 'firebase-admin';

@Entity({ name: DOMAIN.BLOG })
export class BlogEntity extends BaseEntity {
  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: false,
  })
  img_url: string;

  @Column({
    nullable: false,
    type: 'text',
  })
  content: string;
}
