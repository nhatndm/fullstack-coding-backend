import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// DOMAIN
import { DOMAIN } from '../constant';

// BASE CLASS
import { BaseEntity } from '../base/base.entity';

@Entity({ name: DOMAIN.BLOG })
export class BlogEntity extends BaseEntity {
  @ApiProperty()
  @Column({
    nullable: false,
  })
  title: string;

  @ApiProperty()
  @Column({
    nullable: false,
  })
  img_url: string;

  @ApiProperty()
  @Column({
    nullable: false,
    type: 'text',
  })
  content: string;
}
