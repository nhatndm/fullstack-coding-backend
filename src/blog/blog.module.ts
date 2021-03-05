import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ENTITY
import { BlogEntity } from './blog.entity';

// CONTROLLER
import { BlogController } from './blog.controller';

// SERVICE
import { BlogService } from './blog.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity])],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
