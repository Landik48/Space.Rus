import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class SubmitTestInput {
  @Field(() => Int)
  test_id!: number;

  @Field(() => [AnswerInput])
  answers!: AnswerInput[];
}

@InputType()
export class AnswerInput {
  @Field(() => Int)
  questionId!: number;

  @Field(() => Int)
  variantId!: number;
}