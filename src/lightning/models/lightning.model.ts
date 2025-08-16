import { Field, Float, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class VolcanicLightningInfo {
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

@ObjectType()
export class VolcanicLightning {
  @Field(() => String, { nullable: true })
  region: string;

  @Field(() => [VolcanicLightningInfo], { nullable: true })
  info: VolcanicLightningInfo[];
}

@ObjectType()
export class VolcanicLightningDBItem {
  @Field(() => String)
  pk: string;

  @Field(() => String)
  sk: string;

  @Field(() => [VolcanicLightningInfo])
  strikeInfo: VolcanicLightningInfo[];

  @Field(() => Int)
  ttl: number;
}

