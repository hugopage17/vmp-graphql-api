import { Resolver, Query, Args } from "@nestjs/graphql";
import { NotFoundException, UseGuards } from "@nestjs/common";
import { CognitoAuthGuard } from "src/auth/cognito.guard";
import { Volcano, EarthquakeFeatureCollection, VolcanoCameraSiteImage, SensorMetric } from "./models/volcano.model";
import { TildeDataInput } from "./dto/volcano.input";
import { VolcanoService } from "./volcano.service";
import { LogRequest } from "../common/logger.service";

@Resolver(() => Volcano)
export class VolcanoResolver {
    private volcanoService: VolcanoService;
    constructor() {
        this.volcanoService = new VolcanoService();
    }

    @Query(() => [Volcano])
    @UseGuards(CognitoAuthGuard)
    @LogRequest()
    async listVolcanoes(): Promise<Volcano[]> {
        return await this.volcanoService.listVolcanoes();
    }

    @Query(() => Volcano)
    @UseGuards(CognitoAuthGuard)
    @LogRequest()
    async getVolcano(@Args('volcanoId', { type: () => String }) volcanoId: string): Promise<Volcano> {
        const volcano = await this.volcanoService.getVolcano(volcanoId);
        if (!volcano) {
            throw new NotFoundException();
        }
        return volcano;
    }

    @Query(() => EarthquakeFeatureCollection)
    @UseGuards(CognitoAuthGuard)
    @LogRequest()
    async listVolcanicEarthquakes(@Args('volcanoId', { type: () => String }) volcanoId: string): Promise<EarthquakeFeatureCollection> {
        const earthquakes = await this.volcanoService.listVolcanicEarthquakes(volcanoId);
        return earthquakes;
    }

    @Query(() => [VolcanoCameraSiteImage])
    @UseGuards(CognitoAuthGuard)
    @LogRequest()
    async listVolcanoCameraSiteImages(): Promise<VolcanoCameraSiteImage[]> {
        const cameraSiteImages = await this.volcanoService.listVolcanoCameraSiteImages();
        return cameraSiteImages;
    }

    @Query(() => SensorMetric)
    @UseGuards(CognitoAuthGuard)
    @LogRequest()
    async getTildeData(@Args('tildeInput') tildeInput: TildeDataInput): Promise<SensorMetric> {
        return await this.volcanoService.getTildeData(tildeInput);
    }
}
