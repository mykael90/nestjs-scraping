import { Global, Module } from '@nestjs/common';
import { PuppeteerService } from './puppeteer.service';

@Global()
@Module({
  providers: [PuppeteerService],
  exports: [PuppeteerService], // Exportamos o serviço para poder usá-lo em outros módulos
})
export class PuppeteerModule {}
