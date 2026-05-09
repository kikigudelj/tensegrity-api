import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { ExerciseModule } from './exercise/exercise.module';
import { PrismaModule } from '../prisma/prisma.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    AuthModule,
    AdminModule,
    UserModule,
    ExerciseModule,
    PrismaModule,
  ],
})
export class AppModule {}
