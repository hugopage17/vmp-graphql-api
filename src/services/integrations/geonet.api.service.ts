import { HttpService } from "../common/http.service";
import { VolcanoFeatureCollection, EarthquakeFeatureCollection, ITildeDataInput, ISensorMetric } from "../../types";

export class GeonetApiService {
    private readonly geonetApi: HttpService;
    private readonly tildeApi: HttpService;

    constructor() {
        this.geonetApi = new HttpService(process.env.GEONET_API_URL!);
        this.tildeApi = new HttpService(process.env.GEONET_TILDE_URL!)
    };

    async fetchVolcanoesSummary() {
        const summary = await this.geonetApi.get<VolcanoFeatureCollection>("/volcano/val");
        return summary;
    }

    async fetchVolcanoSummary(volcanoId: string) {
        const volcanoSummary = await this.fetchVolcanoesSummary();
        return volcanoSummary?.features?.find((volcano) => volcano?.properties?.volcanoID === volcanoId) ?? undefined;
    }

    async fetchVolcanicEarthquakes(volcanoId: string) {
        return await this.geonetApi.get<EarthquakeFeatureCollection>(`/volcano/quake/${volcanoId}`);
    }

    async fetchTildeData(payload: ITildeDataInput) {
        return await this.tildeApi.get<{ data: ISensorMetric[] }[]>(`/${payload.id}/${payload.metric}/${payload.sensorCode}/max/${payload?.aspect ?? "nil"}/latest/${payload.timeframe}?aggregationPeriod=${payload.aggregationPeriod}&aggregationFunction=sum`)
    }
};