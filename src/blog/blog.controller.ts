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
import {
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

// DTO
import { CreateBlogDto, UpdateBlogDto } from './dto';

// SERVICE
import { BlogService } from './blog.service';

// ENTITY
import { BlogEntity } from './blog.entity';

// CONSTANT
import { API_ROUTE, ERROR_MESSAGE_CODE } from '../constant';

// HELPERS
import { AuthAdminTokenGuard } from '../shared/guard/index.admin';
import { SchemaValidationPipes } from '../shared/SchemaValidation';

import * as firbaseAdmin from 'firebase-admin';

@ApiBearerAuth()
@ApiTags(API_ROUTE.BLOG.toUpperCase())
@Controller(API_ROUTE.BLOG)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('/')
  @UseGuards(AuthAdminTokenGuard)
  @UsePipes(new SchemaValidationPipes())
  @ApiCreatedResponse({ description: 'New Blog', type: BlogEntity })
  @ApiUnauthorizedResponse({
    description: 'You are not allowed to access this request',
  })
  async createBlog(@Body() createBlogDTO: CreateBlogDto): Promise<BlogEntity> {
    const newBlogIns = new BlogEntity();
    newBlogIns.content = createBlogDTO.content;
    newBlogIns.title = createBlogDTO.title;
    newBlogIns.img_url = createBlogDTO.img_url;

    const blog = await this.blogService.save(newBlogIns);

    firbaseAdmin
      .firestore()
      .collection('blog')
      .doc()
      .set({
        title: blog.title,
        img_url: blog.img_url,
        content: blog.content,
        pid: blog.id,
      });

    return blog;
  }

  @Put(':id')
  @UseGuards(AuthAdminTokenGuard)
  @UsePipes(new SchemaValidationPipes())
  @ApiCreatedResponse({ description: 'Updated Blog', type: BlogEntity })
  @ApiBadRequestResponse({ description: 'This resource is not valid' })
  @ApiUnauthorizedResponse({
    description: 'You are not allowed to access this request',
  })
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

    const blogs = await firbaseAdmin
      .firestore()
      .collection('blog')
      .where('pid', '==', Number(updatedData.id))
      .get();

    const currentIns = blogs.docs[0];

    await currentIns.ref.update({
      title: updatedData.title,
      img_url: updatedData.img_url,
      content: updatedData.content,
      pid: updatedData.id,
    });

    return updatedData;
  }

  @Delete(':id')
  @UseGuards(AuthAdminTokenGuard)
  @ApiCreatedResponse({ description: 'Status', type: Boolean })
  @ApiBadRequestResponse({ description: 'This resource is not valid' })
  @ApiUnauthorizedResponse({
    description: 'You are not allowed to access this request',
  })
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

    const blogs = await firbaseAdmin
      .firestore()
      .collection('blog')
      .where('pid', '==', Number(id))
      .get();

    const currentIns = blogs.docs[0];

    await currentIns.ref.delete();

    return true;
  }
}
