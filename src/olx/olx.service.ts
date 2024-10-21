import { ConsoleLogger, Injectable, Logger } from '@nestjs/common';
import { PuppeteerService } from '../puppeteer/puppeteer.service';
import { ListingsService } from './listings/listings.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Listing } from './listings/entities/listing.entity';
import { Neighbourhood } from './enum/neighbourhood.enum';
import { LocationsService } from './locations/locations.service';

@Injectable()
export class OlxService {
  private readonly entryPoint =
    'https://www.olx.com.br/imoveis/venda/casas/estado-rn/rio-grande-do-norte/natal';
  private readonly logger = new Logger(OlxService.name);

  constructor(
    private readonly puppeteerService: PuppeteerService,
    private readonly listingsService: ListingsService,
    @InjectModel('Listing') private readonly listingModel: Model<Listing>,
    private readonly locationService: LocationsService,
  ) {}
  async showListings(param: string) {
    const url = `${this.entryPoint}/${param}`;
    const browser = await this.puppeteerService.launchBrowser();
    const page = await browser.newPage();

    // Definir um User-Agent realista para evitar blocks
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
    );

    try {
      await page.goto(url);

      // Captura de tela para verificar o estado da página
      // await page.screenshot({ path: 'screenshot.png', fullPage: true });

      await page.waitForSelector('script[id="__NEXT_DATA__"]', {
        timeout: 30 * 1000,
      }); // Aguarda o script __NEXT_DATA__

      const props = await page.evaluate(() => {
        return (window as any).__NEXT_DATA__.props.pageProps;
      });

      const totalOfAds = props.totalOfAds;

      const numberOfPages = Math.ceil(totalOfAds / 50);

      const ads = props.ads.filter((ad: any) => ad.subject);

      // Get all pages
      for (let i = 2; i <= numberOfPages; i++) {
        await page.goto(`${url}?o=${i}`);
        await page.waitForSelector('script[id="__NEXT_DATA__"]', {
          timeout: 10 * 1000,
        }); // Aguarda o script __NEXT_DATA__
        const props = await page.evaluate(() => {
          return (window as any).__NEXT_DATA__.props.pageProps;
        });
        ads.push(...props.ads.filter((ad: any) => ad.subject));
      }

      this.logger.log(
        `totalOfAds ${totalOfAds}`,
        `numberOfPages ${numberOfPages}`,
        `adsLength ${ads.length}`,
      );

      const location = await this.locationService.findOneByNeighborhood(param);

      return { totalOfAds, numberOfPages, ads, location };
    } catch (error) {
      console.error('Error while scraping job listings:', error);
    } finally {
      await browser.close();
    }
  }

  async getListings(param: string) {
    const listings = await this.showListings(param);
    const locationId = new Types.ObjectId(listings.location._id);

    if (!listings) {
      return;
    }

    const { ads } = listings;

    // Busca os registros da localização
    const dbAds = await this.listingModel
      .find()
      .where('locationId')
      .in([locationId])
      .where('deletedAt')
      .equals(null);

    this.logger.log(`dbAds length: ${dbAds.length}`);

    //verifica se ads estão no banco
    const newAds: Listing[] = ads.filter(
      (ad: any) =>
        !dbAds.find(
          (dbAd: Listing) => dbAd.listId.toString() === ad.listId.toString(),
        ),
    );

    //verifica se está no banco e não está mais anunciada
    const deleteAds: Listing[] = dbAds.filter(
      (dbAd) =>
        !ads.find(
          (ad: Listing) => dbAd.listId.toString() === ad.listId.toString(),
        ),
    );

    this.logger.log(`newAds Length: ${newAds.length}`);

    //soft delete para os que não estão mais anunciados
    if (deleteAds.length > 0) {
      for (const deletAd of deleteAds) {
        await this.listingsService.update(deletAd._id, {
          deletedAt: new Date(),
        });
      }
    }

    this.logger.log(`deleteAds Length: ${deleteAds.length}`);

    //add new ads
    if (newAds.length > 0) {
      //transform date
      newAds.forEach((ad: any) => {
        ad.date = new Date(ad.date * 1000);
        ad.locationId = locationId;
      });
    }

    return await this.listingsService.createMany(newAds);
  }

  async getListingsAll() {
    this.logger.log(`Getting all listings...`);
    const neighbourhoods = Object.values(Neighbourhood);

    for (const neighbourhood of neighbourhoods) {
      this.logger.log(`Getting listings from: ${neighbourhood}`);
      await this.getListings(neighbourhood);

      await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
    }

    return 'All listings done';
  }

  async showProperties(url: string) {
    const browser = await this.puppeteerService.launchBrowser();
    const page = await browser.newPage();

    // Definir um User-Agent realista para evitar blocks
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
    );

    try {
      await page.goto(url);

      this.logger.log('Page title:', await page.title());

      // Captura de tela para verificar o estado da página
      // await page.screenshot({ path: 'screenshot.png', fullPage: true });

      // Localiza o elemento pelo ID e aguarda está disponível
      await page.locator('#initial-data').wait();

      const dataElement = await page.$('#initial-data');

      const data = await page.evaluate(
        (element) => element.getAttribute('data-json'),
        dataElement,
      ); // Obtenha o atributo desejado

      // Transformar o JSON em um objeto JavaScript e retornar apenas a chave ad
      const ad = JSON.parse(data).ad;

      return ad;
    } catch (error) {
      console.error('Error while scraping job listings:', error);
    } finally {
      await browser.close();
    }
  }
}
