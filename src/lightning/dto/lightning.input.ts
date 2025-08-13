import { Field, Float, Int, InputType } from '@nestjs/graphql';

@InputType()
export class VolcanicStrikesInput {
  @Field(() => String)
  volcanoNumber: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  region: string;

  @Field(() => String)
  type: string;

  @Field(() => String)
  severity: string;

  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @Field(() => Int)
  strikes20Km: number;

  @Field(() => Int)
  strikes100Km: number;

  @Field(() => String)
  googleEarthKML: string;
}


@InputType()
export class VolcanicLightningInput {
  @Field(() => [VolcanicStrikesInput])
  strikeInfo: VolcanicStrikesInput[];
}

