import { Module } from '@nestjs/common';
import { VolcanoResolver } from './volcano.resolver';

@Module({
  providers: [VolcanoResolver],
})
export class VolcanoModule {}
