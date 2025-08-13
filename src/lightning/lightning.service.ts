import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { DynamoDBService } from "../services/aws/dynamo.service"
import { VolcanicLightningDBItem, StrikeInfo, VolcanicLightningInput } from "../types";

dayjs.extend(utc);

export class LightningDataService {
    private readonly dbService: DynamoDBService;

    constructor() {
        this.dbService = new DynamoDBService(process.env.DATA_CACHE_TABLE!); 
    }

    public async listLightningStrikes(sortKey?: string) {
        const lightningStrikes = await this.dbService.query<VolcanicLightningDBItem>("VOLCANIC_LIGHTNING", sortKey ?? dayjs().utc().format("YYYYMMDD"));
        const strikeInfo = lightningStrikes?.[0]?.strikeInfo?.reduce((prev, curr) => {
            if (prev.find((p) => p.region === curr.region)) {
                prev.find((p) => p.region === curr.region)?.info.push(curr)           
            } else {
                prev.push({
                    region: curr.region,
                    info: [curr]
                })
            }
            return prev;
        }, [] as StrikeInfo[]) ?? [];
        return strikeInfo;
    };

    public async addLightningStrikes(item: VolcanicLightningInput) {
        try {
            const dbItem = {
                pk: 'VOLCANIC_LIGHTNING',
                sk: `${dayjs().utc().format("YYYYMMDDTHHmmss")}#${crypto.randomUUID()}`,
                ...item
            }
            await this.dbService.putItem(dbItem);
            console.info(`Saved ${item.strikeInfo.length} strikes to ${process.env.DATA_CACHE_TABLE!}.`);
            return dbItem;
        } catch (err) {
            console.error(`Error: ${err}`);
            throw err;
        }
    }
};

