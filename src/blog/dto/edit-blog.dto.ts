import { IsOptional } from 'class-validator';

export class UpdateBlogDto {
  @IsOptional()
  readonly title: string;

  @IsOptional()
  readonly img_url: string;

  @IsOptional()
  readonly content: string;
}
