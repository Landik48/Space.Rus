import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class GetArticlesInput {
  @Field(() => Int)
  skip!: number;

  @Field(() => Int)
  take!: number;
}