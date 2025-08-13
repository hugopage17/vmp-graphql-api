import { Module } from '@nestjs/common';
import { LightningResolver } from './lightning.resolver';

@Module({
  providers: [LightningResolver],
})
export class LightningModule {}
