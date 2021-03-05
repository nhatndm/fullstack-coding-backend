import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

// CONSTANT
import { ERROR_MESSAGE_CODE } from '@/constant';

// FIREBASE
import * as admin from 'firebase-admin';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { headers } = request;
    const bearToken = headers['authorization'];

    const token = bearToken.split(' ')[1];

    try {
      await admin.auth().verifyIdToken(token);
      return true;
    } catch (error) {
      throw new HttpException(
        {
          code: HttpStatus.UNAUTHORIZED,
          message: ERROR_MESSAGE_CODE.error_002,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
