import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ 
      defaultStrategy: 'jwt',
      session: false 
    }),
    JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '7d' }
      }),
  ],
  providers: [UsersResolver, UsersService, PrismaService],
})
export class UsersModule {}
