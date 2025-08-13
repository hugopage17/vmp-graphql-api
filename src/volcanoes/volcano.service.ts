import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import dayOfYear from 'dayjs/plugin/dayOfYear';
import { ListObjectsCommandOutput } from "@aws-sdk/client-s3";
import { Volcano, VolcanoCameraSiteImage } from "./models/volcano.model";
import { volcanoes } from "../volcanoes";
import { GeonetApiService } from "../services/integrations/geonet.api.service";
import { S3Service } from "../services/aws/s3.service";
import { IGetSensorMetric, ISensorMetric, ITildeDataInput } from "src/types";

dayjs.extend(utc);
dayjs.extend(dayOfYear);

const cameraSites = volcanoes.map((vol) => vol.cameraSites).flat();

export class VolcanoService {
    private readonly geonetApi: GeonetApiService;
    private readonly s3Service: S3Service
    constructor() {
        this.geonetApi = new GeonetApiService();
        this.s3Service = new S3Service(process.env.CAMERA_IMAGE_BUCKET!); 
    }

    public async listVolcanoes(): Promise<Volcano[]> {
        const volcanoSummary = await this.geonetApi.fetchVolcanoesSummary();
        const { features } = volcanoSummary;
        return volcanoes.map((volcano) => {
            const { geometry, properties } = features.find((feat) => feat.properties.volcanoID === volcano.id)!;
            return {
                ...volcano,
                coordinates: geometry.coordinates,
                volcanicLevel: properties.level,
                volcanicActivity: properties.activity,
                hazards: properties.hazards
            }
        });
    }

    public async getVolcano(volcanoId: string): Promise<Volcano | null> {
        const volcanoDetails = await this.geonetApi.fetchVolcanoSummary(volcanoId);
        const volcano = volcanoes.find((vol) => vol.id === volcanoId);
        if (!volcanoDetails || !volcano) {
            return null;
        }
        const { geometry, properties } = volcanoDetails
        return {
            ...volcano,
            coordinates: geometry.coordinates,
            volcanicLevel: properties.level,
            volcanicActivity: properties.activity,
            hazards: properties.hazards
        };
    }

    public async listVolcanicEarthquakes(volcanoId: string) {
        try {
            const earthquakes = await this.geonetApi.fetchVolcanicEarthquakes(volcanoId);
            return earthquakes;
        } catch (error) {
            throw error;
        }
    }

    public async getTildeData(payload: ITildeDataInput): Promise<IGetSensorMetric> {
        try {
            const tildeData = await this.geonetApi.fetchTildeData(payload);
            return { measurements: tildeData?.[0]?.data ?? [], metric: payload.metric };
        } catch (error) {
            console.error("Failed to get tilde data", error);
            throw error;
        }
    }


    private async latestImages(param: { imageServerKey: string; siteId: string }, currentTime: dayjs.Dayjs, totalImages: number): Promise<string[]> {
        const images: string[] = [];
        let date = currentTime.clone();
        const oldestDate = currentTime.subtract(1, 'year');
  
        while (images.length < totalImages) {
            const objects = await this.listS3Images(param, date);
            const keys = this.extractKeysFromS3Objects(objects, totalImages - images.length);
            images.unshift(...keys);
            date = date.subtract(1, 'day');
        
            if (date.isBefore(oldestDate)) {
                console.warn(`Stopped search: hit 1-year limit at ${date.format('YYYY-MM-DD')}`);
                break;
            }
        }
        return images;
    };

    private async listS3Images(param: { imageServerKey: string; siteId: string }, date: dayjs.Dayjs) {
        const prefix = `${date.year()}/${param.imageServerKey}/${param.siteId}/${String(
          date.dayOfYear()
        ).padStart(3, '0')}`;
    
        return await this.s3Service.listFiles(prefix);
    };

    private extractKeysFromS3Objects(output: ListObjectsCommandOutput, count: number): string[] {
        const objects = output.Contents ?? [];
        return objects
          .sort((a, b) => (a.Key! < b.Key! ? 1 : -1))
          .slice(0, count)
          .map((obj) => obj.Key!)
          .reverse();
    };

    public async listVolcanoCameraSiteImages(): Promise<VolcanoCameraSiteImage[]> {
        const now = dayjs.utc();
        const totalImages = 12;
        const cameraSiteImages = await Promise.all(
            cameraSites.map(async (cameraSite) => {
            const latestImages = await this.latestImages(cameraSite, now, totalImages);
                return {
                    imageServerKey: cameraSite.imageServerKey,
                    siteId: cameraSite.siteId,
                    latestImages,
                };
            })
        );
        return cameraSiteImages;
    };
}

