import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// ENTITY
import { BlogEntity } from './blog.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
  ) {}

  async save(blog: BlogEntity): Promise<BlogEntity> {
    return await this.blogRepository.save(blog);
  }

  async findOneBlog(blog: Partial<BlogEntity>): Promise<BlogEntity> {
    return await this.blogRepository.findOne({ where: { ...blog } });
  }

  async deleteNote(blog: BlogEntity): Promise<any> {
    return await this.blogRepository.remove([blog]);
  }
}
