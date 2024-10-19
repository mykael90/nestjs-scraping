import { Module } from '@nestjs/common';
import { OlxService } from './olx.service';
import { OlxController } from './olx.controller';
import { ListingsModule } from './listings/listings.module';
import { LocationsModule } from './locations/locations.module';

@Module({
  controllers: [OlxController],
  providers: [OlxService],
  imports: [ListingsModule, LocationsModule],
})
export class OlxModule {}
