import { Controller, Get, Logger, Param, ParseEnumPipe } from '@nestjs/common';
import { OlxService } from './olx.service';
import { Neighbourhood } from './enum/neighbourhood.enum';

@Controller('olx')
export class OlxController {
  private readonly logger = new Logger(OlxController.name);
  private readonly entryPoint =
    'https://www.olx.com.br/imoveis/venda/casas/estado-rn/rio-grande-do-norte/natal';

  private readonly propertyEntryPoint =
    'https://rn.olx.com.br/rio-grande-do-norte/imoveis';

  constructor(private readonly olxService: OlxService) {}

  @Get(':param')
  showListings(@Param('param', new ParseEnumPipe(Neighbourhood)) param: any) {
    this.logger.log(`param: ${param}`);

    return this.olxService.showListings(`${this.entryPoint}/${param}`);
  }

  @Get('scraping/:param')
  getListings(@Param('param', new ParseEnumPipe(Neighbourhood)) param: any) {
    this.logger.log(`param: ${param}`);

    return this.olxService.getListings(`${this.entryPoint}/${param}`);
  }

  @Get('scrapingslow/:param')
  getListingsSlow(
    @Param('param', new ParseEnumPipe(Neighbourhood)) param: any,
  ) {
    this.logger.log(`param: ${param}`);

    return this.olxService.getListingsSlow(`${this.entryPoint}/${param}`);
  }

  @Get('properties/:param')
  showProperties(@Param('param') param: any) {
    this.logger.log(`param: ${param}`);

    return this.olxService.showProperties(
      `${this.propertyEntryPoint}/${param}`,
    );
  }
}
