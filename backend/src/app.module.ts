import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './guards/jwt_auth.strategy';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PassportModule } from '@nestjs/passport';
import { SeedService } from './app.service';
import { ArticlesModule } from './articles/evaluation.module';

@Module({
  imports: [
    PassportModule.register({ 
      defaultStrategy: 'jwt',
      session: false 
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' }
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, res }: {req: any, res: any}) => ({ req, res })
    }),
    ArticlesModule
  ],
  controllers: [AppController],
  providers: [PrismaService, JwtStrategy, SeedService],
})
export class AppModule {}