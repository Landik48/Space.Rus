import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Achievement {
    @Field()
    id!: number

    @Field()
    title!: string

    @Field()
    description!: string

    @Field()
    image_link!: string

    @Field()
    date!: Date
}