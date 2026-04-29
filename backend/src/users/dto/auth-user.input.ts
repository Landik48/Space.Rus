import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class AuthUserInput {
  @Field()
  email!: string

  @Field()
  password!: string
}
