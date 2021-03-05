import {
  Controller,
  UseGuards,
  HttpException,
  HttpStatus,
  Body,
  UsePipes,
  Post,
  Delete,
  Put,
  Param,
} from '@nestjs/common';

// DTO
import { CreateBlogDto, UpdateBlogDto } from './dto';

// SERVICE
import { BlogService } from './blog.service';

// ENTITY
import { BlogEntity } from './blog.entity';

// CONSTANT
import { API_ROUTE, ERROR_MESSAGE_CODE } from '@/constant';

// HELPERS
import { AuthAdminTokenGuard } from '@/shared/guard/index.admin';
import { SchemaValidationPipes } from '@/shared/SchemaValidation';

@Controller(API_ROUTE.BLOG)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('/')
  @UseGuards(AuthAdminTokenGuard)
  @UsePipes(new SchemaValidationPipes())
  async createBlog(@Body() createBlogDTO: CreateBlogDto): Promise<BlogEntity> {
    const newBlogIns = new BlogEntity();
    newBlogIns.content = createBlogDTO.content;
    newBlogIns.title = createBlogDTO.title;
    newBlogIns.img_url = createBlogDTO.img_url;

    const blog = await this.blogService.save(newBlogIns);

    return blog;
  }

  @Put(':id')
  @UseGuards(AuthAdminTokenGuard)
  @UsePipes(new SchemaValidationPipes())
  async updateChapter(
    @Param('id') id: number,
    @Body() updateBlogDTO: UpdateBlogDto,
  ): Promise<BlogEntity> {
    const blog = await this.blogService.findOneBlog({ id });

    if (!blog) {
      throw new HttpException(
        {
          code: HttpStatus.BAD_REQUEST,
          message: ERROR_MESSAGE_CODE.error_004,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (updateBlogDTO.title) blog.title = updateBlogDTO.title;
    if (updateBlogDTO.content) blog.content = updateBlogDTO.content;
    if (updateBlogDTO.img_url) blog.img_url = updateBlogDTO.img_url;

    const updatedData = await this.blogService.save(blog);

    return updatedData;
  }

  @Delete(':id')
  @UseGuards(AuthAdminTokenGuard)
  async deleteChapter(@Param('id') id: number): Promise<boolean> {
    const blog = await this.blogService.findOneBlog({ id });

    if (!blog) {
      throw new HttpException(
        {
          code: HttpStatus.BAD_REQUEST,
          message: ERROR_MESSAGE_CODE.error_004,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.blogService.deleteNote(blog);

    return true;
  }
}
