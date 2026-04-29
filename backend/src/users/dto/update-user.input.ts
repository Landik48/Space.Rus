import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, Int } from '@nestjs/graphql';
const { GraphQLUpload } = require('graphql-upload');

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int)
  id!: number  

  @Field(() => GraphQLUpload, { nullable: true })
  file?: any;
}