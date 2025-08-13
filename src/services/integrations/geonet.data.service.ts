import dayjs, { Dayjs } from "dayjs";
import dayOfYear from 'dayjs/plugin/dayOfYear';
import { HttpService } from "../common/http.service";

dayjs.extend(dayOfYear);

export class GeonetDataService {
    private readonly geonetData: HttpService;
    constructor() {
        this.geonetData = new HttpService(process.env.GEONET_DATA_URL!);
    };

    async fetchVolcanoImage({ volcanoId, site, datetime }: { volcanoId: string, site: string, datetime: Dayjs }) {
        try {
            const image = await this.geonetData.get<ArrayBuffer>(`/camera/volcano/images/${datetime.year()}/${volcanoId}/${volcanoId}.${site}/${datetime.year()}.${String(datetime.dayOfYear()).padStart(3, '0')}/${datetime.year()}.${String(datetime.dayOfYear()).padStart(3, '0')}.${datetime.format("HH")}${datetime.format("mm")}.00.${volcanoId}.${site}.jpg`,
        { 
            responseType: "arraybuffer"
        });
        return Buffer.from(image);
        } catch (err) {
            console.warn(`Couldnt fetch image for ${volcanoId} ${site} ${datetime.toISOString()}`);
            return null;
        }
    };
};