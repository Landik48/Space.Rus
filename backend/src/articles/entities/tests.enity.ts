import { ObjectType, Field, Int } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class Test {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field(() => GraphQLJSON)
  body!: any;
}