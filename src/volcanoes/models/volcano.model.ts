import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

// --- Metric Model ---
@ObjectType()
export class VolcanoMetric {
  @Field(() => String)
  name: string;

  @Field(() => String)
  sensorCode: string;
}

// --- Tilde Information ---
@ObjectType()
export class VolcanoTildeInformation {
  @Field(() => String)
  id: string;

  @Field(() => [VolcanoMetric])
  metrics: VolcanoMetric[];
}

// --- Camera Site Model ---
@ObjectType()
export class VolcanoCameraSite {
  @Field(() => String)
  imageServerKey: string;

  @Field(() => String)
  siteId: string;

  @Field(() => String)
  label: string;
}

@ObjectType()
export class Volcano {
    @Field(() => String)
    title: string;

    @Field(() => ID)
    id: string;

    @Field(() => [VolcanoCameraSite])
    cameraSites: VolcanoCameraSite[];

    @Field(() => [String])
    graphImageIds: string[];

    @Field(() => VolcanoTildeInformation, { nullable: true })
    tildeInformation?: VolcanoTildeInformation;

    @Field(() => [Float])
    coordinates: [number, number]

    @Field(() => Int)
    volcanicLevel: number

    @Field(() => String)
    volcanicActivity: string

    @Field(() => String)
    hazards: string
}
// --- Geometry Model ---
@ObjectType()
export class EarthquakeGeometry {
  @Field(() => String)
  type: string; // 'Point'

  @Field(() => [Float])
  coordinates: number[]; // [longitude, latitude]
}

// --- Properties Model ---
@ObjectType()
export class EarthquakeProperties {
  @Field(() => String)
  publicID: string;

  @Field(() => String)
  time: string;

  @Field(() => Float)
  depth: number;

  @Field(() => Float)
  magnitude: number;

  @Field(() => String)
  locality: string;

  @Field(() => String)
  intensity: string;

  @Field(() => String)
  regionIntensity: string;

  @Field(() => Float)
  mmi: number;

  @Field(() => String)
  quality: string;

  @Field(() => String)
  status: string;
}

// --- Top-Level Earthquake Feature Model ---
@ObjectType()
export class EarthquakeFeature {
  @Field(() => String)
  type: string; // 'Feature'

  @Field(() => EarthquakeGeometry)
  geometry: EarthquakeGeometry;

  @Field(() => EarthquakeProperties)
  properties: EarthquakeProperties;
}

@ObjectType()
export class EarthquakeFeatureCollection {
  @Field(() => String)
  type: string; // always "FeatureCollection"

  @Field(() => [EarthquakeFeature])
  features: EarthquakeFeature[];
}

@ObjectType()
export class VolcanoCameraSiteImage {
  @Field(type => String)
  imageServerKey: string;

  @Field(type => String)
  siteId: string;

  @Field(type => [String])
  latestImages: string[];
}

@ObjectType()
export class SensorData {
  @Field(() => Float)
  val: number;

  @Field(() => Float)
  err: number;

  @Field()
  qc: string;

  @Field()
  ts: string;
}

@ObjectType()
export class SensorMetric {
  @Field(() => [SensorData])
  measurements: SensorData[];

  @Field()
  metric: string;
}