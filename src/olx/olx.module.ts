import { Module } from '@nestjs/common';
import { OlxService } from './olx.service';
import { OlxController } from './olx.controller';
import { ListingsModule } from './listings/listings.module';

@Module({
  controllers: [OlxController],
  providers: [OlxService],
  imports: [ListingsModule],
})
export class OlxModule {}
