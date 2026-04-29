import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id!: number

  @Field()
  email!: string

  @Field()
  firstname!: string

  @Field()
  lastname!: string

  @Field()
  profile_picture!: string
}
