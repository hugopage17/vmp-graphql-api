import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TildeDataInput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  metric: string;

  @Field(() => String)
  sensorCode: string;

  @Field(() => String, { nullable: true })
  aspect?: string;

  @Field(() => String)
  timeframe: string;

  @Field(() => String)
  aggregationPeriod: string;
}

