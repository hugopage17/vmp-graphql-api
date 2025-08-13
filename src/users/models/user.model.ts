import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserDetails {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  role: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  lastModified: Date;

  @Field()
  active: boolean;

  @Field()
  status: string;
}

@ObjectType()
export class UpdateUserResponse {
    @Field()
    success: boolean;
}
  