import { IsNotEmpty } from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly img_url: string;

  @IsNotEmpty()
  readonly content: string;
}
