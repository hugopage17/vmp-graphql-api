import { Resolver, Query, Mutation, Subscription, Args } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { UseGuards } from "@nestjs/common";
import { CognitoAuthGuard } from "src/auth/cognito.guard";
import { VolcanicLightning, VolcanicLightningDBItem } from "./models/lightning.model";
import { VolcanicLightningInput } from "./dto/lightning.input";
import { LightningDataService } from "./lightning.service";
import { LogRequest } from "../common/logger.service";

const pubSub = new PubSub();

@Resolver(() => VolcanicLightning)
export class LightningResolver {
    private lightningService: LightningDataService;
    constructor() {
        this.lightningService = new LightningDataService();
    }

    @Query(() => [VolcanicLightning])
    @UseGuards(CognitoAuthGuard)
    @LogRequest()
    async getLightningStrikes(): Promise<VolcanicLightning[]> {
        return await this.lightningService.listLightningStrikes();
    }

    @Mutation(() => VolcanicLightningDBItem)
    @LogRequest()
    async newLightningStrikes(
        @Args('volcanicLightningInput') volcanicLightningInput: VolcanicLightningInput,
    ): Promise<VolcanicLightningDBItem> {
        const lightningStikeInfo = await this.lightningService.addLightningStrikes(volcanicLightningInput);
        const formattedStrikes = await this.lightningService.listLightningStrikes(lightningStikeInfo.sk);
        pubSub.publish('onNewLightningStrikes', { onNewLightningStrikes: formattedStrikes });
        return lightningStikeInfo;
    }

    @Subscription(() => [VolcanicLightning])
    @LogRequest()
    onNewLightningStrikes() {
        return pubSub.asyncIterableIterator('onNewLightningStrikes');
    }
}
