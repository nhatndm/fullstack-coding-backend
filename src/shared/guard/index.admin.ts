import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

// CONSTANT
import { ERROR_MESSAGE_CODE } from '../../constant';

// FIREBASE
import * as admin from 'firebase-admin';

@Injectable()
export class AuthAdminTokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { headers } = request;
    const bearToken = headers['authorization'];
    let token = '';

    if (bearToken) {
      token = bearToken.split(' ')[1];
    }

    if (!token) {
      throw new HttpException(
        {
          code: HttpStatus.UNAUTHORIZED,
          message: ERROR_MESSAGE_CODE.error_002,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const decode = await admin.auth().verifyIdToken(token);
      const uid = decode.uid;

      const checkAdmin = await (
        await admin
          .firestore()
          .collection('admin')
          .where('uid', '==', uid)
          .get()
      ).docs[0].data();

      if (!checkAdmin) {
        throw new Error();
      }

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
