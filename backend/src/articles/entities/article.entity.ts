import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Articles {
  @Field(() => Int)
  id!: number;

  @Field()
  img_link!: string;

  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field()
  article_link!: string;

  @Field()
  test_id!: number;
}