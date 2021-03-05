/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ERROR_MESSAGE_CODE } from '@/constant/';

@Injectable()
export class SchemaValidationPipes implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new HttpException(
        {
          code: HttpStatus.BAD_REQUEST,
          message: ERROR_MESSAGE_CODE.error_003,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const { metatype } = metadata;

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new HttpException(
        {
          code: HttpStatus.BAD_REQUEST,
          message: this.buildError(errors),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return value;
  }

  private buildError(errors) {
    const result = {};
    errors.forEach(el => {
      const prop = el.property;
      Object.entries(el.constraints).forEach(constraint => {
        result[prop + constraint[0]] = `${constraint[1]}`;
      });
    });
    return result;
  }
}
