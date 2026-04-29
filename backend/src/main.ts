import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { JwtAuthGuard } from './guards/jwt_guard';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { adminerAuthMiddleware } from './Middlewares/AdminerMiddleware';

const graphqlUploadExpress = require('graphql-upload').graphqlUploadExpress;
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.use(
    '/adminer',
    adminerAuthMiddleware,
    createProxyMiddleware({
      target: 'http://adminer:8080',
      changeOrigin: true,
      pathRewrite: {
        '^/adminer': '/',
      },
    }),
  );

  app.use(
    graphqlUploadExpress({
      maxFileSize: 10_000_000,
      maxFiles: 1,
    }),
  );

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}

bootstrap();