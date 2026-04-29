import { Resolver, Query, Args, Context, Mutation, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt_guard';
import { EvaluationService } from './evaluation.service';
import { GetArticlesInput } from './dto/article.input';
import { Articles } from './entities/article.entity';
import { SubmitTestInput } from './dto/tests.input';
import { Test } from './entities/tests.enity';
import { Achievement } from './entities/achievements.enity';

@Resolver(() => Articles)
export class EvaluationResolver {
  constructor(private readonly evaluationService: EvaluationService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Articles])
  async findArticles(
    @Args('getArticlesInput') input: GetArticlesInput,
    @Context() ctx: { req: Request },
  ) {
    const userId = (ctx.req as any).user?.userId;

    return this.evaluationService.findAvailableArticles(
      userId,
      input.skip,
      input.take,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Test)
  async getTest(
    @Args('testId', { type: () => Int }) testId: number,
    @Context() ctx: any,
  ) {
    const userId = ctx.req.user.userId;
    return this.evaluationService.getTest(userId, testId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async submitTest(
    @Args('input') input: SubmitTestInput,
    @Context() ctx: any,
  ) {
    const userId = ctx.req.user.userId;
    return this.evaluationService.submitTest(userId, input);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Achievement])
  async getAchievements(@Context() ctx: any) {
    return this.evaluationService.getAchievements(ctx)
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async updateTime(
    @Args('time', { type: () => Int }) time: number,
    @Context() ctx: any,
  ) {
    return this.evaluationService.updateTime(time, ctx);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Int)
  async getTime(@Context() ctx: any) {
    return this.evaluationService.getTime(ctx);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Articles])
  async findCompletedArticles(
    @Args('getArticlesInput') input: GetArticlesInput,
    @Context() ctx: { req: Request },
  ) {
    const userId = (ctx.req as any).user?.userId;

    return this.evaluationService.findCompletedArticles(
      userId,
      input.skip,
      input.take,
    );
  }
}