import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBlogDto {
  @ApiPropertyOptional()
  @IsOptional()
  readonly title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly img_url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly content?: string;
}
