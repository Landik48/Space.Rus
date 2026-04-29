import { Resolver, Query, Mutation, Args, Context, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { AuthUserInput } from './dto/auth-user.input';
import { JwtAuthGuard } from '../guards/jwt_guard';
import { UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Score } from './entities/score.enity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
    @Context() ctx: { req: Request }
  ) {
    return await this.usersService.create(createUserInput, ctx);
  }

  @Mutation(() => User)
  async authUser(
    @Args('authUserInput') authUserInput: AuthUserInput,
    @Context() ctx: { res: Response }
  ) {
    return await this.usersService.entrance(authUserInput, ctx)
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Int)
  async scoreMe(@Context() ctx: { req: Request }) {
    const userId = (ctx.req as any).user?.userId;
    if (!userId) return 0;
    return await this.usersService.scoreMe(userId);
  }

  @Query(() => [Score])
  async scores() {
    return await this.usersService.scores();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  async findMe(@Context() ctx: { req: Request }) {
    const userId = (ctx.req as any).user?.userId;
    if (!userId) return null
    return await this.usersService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return await this.usersService.update(updateUserInput)
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  logout(@Context() ctx: { res: Response }) {
    ctx.res.clearCookie('access_token');
    return true;
  }
}