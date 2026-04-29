import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Score {
  @Field()
  firstname!: string;

  @Field()
  lastname!: string;

  @Field()
  profile_picture!: string;

  @Field()
  xp!: number;
}