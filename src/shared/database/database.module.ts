import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const synchronize = process.env.DB_SYNCHRONIZE === 'true';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize,
      logging: true,
      logger: 'advanced-console',
    }),
  ],
})
export class DatabaseModule {}
