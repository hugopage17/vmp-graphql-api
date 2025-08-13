
export interface IBaseProps {
    stage: string;
    appName: string;
};


export interface IVolcanoFeature {
    type: 'Feature';
    geometry: {
      type: 'Point';
      coordinates: [number, number];
    };
    properties: {
      acc: string;
      activity: string;
      hazards: string;
      level: number;
      volcanoID: string;
      volcanoTitle: string;
    };
}

interface FeatureCollection<T> {
    type: "FeatureCollection",
    features: T[]
}
  
export interface IEarthquakeFeature {
    type: 'Feature';
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
    properties: {
        publicID: string;
        time: string;
        depth: number;
        magnitude: number;
        locality: string;
        intensity: string;
        regionIntensity: string;
        mmi: number;
        quality: string;
        status: string;
    };
};

export type VolcanoFeatureCollection = FeatureCollection<IVolcanoFeature>;
export type EarthquakeFeatureCollection = FeatureCollection<IEarthquakeFeature>;

export interface VolcanicLightningInfo {
    volcanoNumber: string;
    name: string;
    region: string;
    type: string;
    severity: string;
    latitude: number;
    longitude: number;
    strikes20Km: number;
    strikes100Km: number;
    googleEarthKML: string;
};
  
export interface  VolcanicLightningDBItem {
    pk: string;
    sk: string;
    strikeInfo: VolcanicLightningInfo[];
};

export interface  VolcanicLightningInput {
    strikeInfo: VolcanicLightningInfo[];
};

export interface StrikeInfo {
    region: string;
    info: VolcanicLightningInfo[]
}

export interface IUserDetails {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: Date;
    lastModified: Date;
    active: boolean;
    status: string;
};

export interface ICreateUserPayload {
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
}

export interface IUpdateUserPayload {
    email: string;
    firstName?: string;
    lastName?: string;
    isAdmin?: boolean;
    active?: boolean;
}

export interface ISensorMetric {
    val: number;
    err: number;
    qc: string;
    ts: string;
};

export interface IGetSensorMetric {
    measurements: ISensorMetric[];
    metric: string;
}

export interface ITildeDataInput {
    id: string;
    metric: string;
    sensorCode: string;
    aspect?: string;
    timeframe: string;
    aggregationPeriod: string;
}
  