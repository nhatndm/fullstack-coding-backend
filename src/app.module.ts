import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';

// FIREBASE
import * as admin from 'firebase-admin';
import { FirebaseConfig } from './config/firebase';

// MODULE
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [SharedModule, BlogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit(): void {
    admin.initializeApp({
      credential: admin.credential.cert(FirebaseConfig),
    });
  }
}
