import { Module } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { EvaluationResolver } from './evaluation.resolver';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [EvaluationResolver, EvaluationService, PrismaService],
})
export class ArticlesModule {}
