import { Injectable, Logger } from '@nestjs/common';
import { PuppeteerService } from '../puppeteer/puppeteer.service';
import { ListingsService } from './listings/listings.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Listing } from './listings/entities/listing.interface';
import { Neighbourhood } from './enum/neighbourhood.enum';

@Injectable()
export class OlxService {
  private readonly entryPoint =
    'https://www.olx.com.br/imoveis/venda/casas/estado-rn/rio-grande-do-norte/natal';
  private readonly logger = new Logger(OlxService.name);

  constructor(
    private readonly puppeteerService: PuppeteerService,
    private readonly listingsService: ListingsService,
    @InjectModel('Listing') private readonly listingModel: Model<Listing>,
  ) {}
  async showListings(url: string) {
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

      this.logger.log(totalOfAds, numberOfPages, ads.length);

      return { totalOfAds, numberOfPages, ads };
    } catch (error) {
      console.error('Error while scraping job listings:', error);
    } finally {
      await browser.close();
    }
  }

  async getListings(url: string) {
    const listings = await this.showListings(url);

    if (!listings) {
      return;
    }

    const { ads } = listings;

    // Busca o último registro para cada localização
    const lastListing = await this.listingModel
      .findOne({
        location: ads[0].location,
      })
      .sort({ date: -1 });

    if (!lastListing) {
      //transform date
      ads.forEach((ad: any) => {
        ad.date = new Date(ad.date * 1000);
      });
      return await this.listingsService.createMany(ads);
    }

    const lastDate = new Date(lastListing.date).getTime();

    this.logger.log(`lastDate`, lastDate, Number(ads[0].date));

    //compare lastDate with date of ads
    const newAds = ads.filter((ad: any) => Number(ad.date) > lastDate);

    //transform date
    newAds.forEach((ad: any) => {
      ad.date = new Date(ad.date * 1000);
    });

    this.logger.log(`newAds`, newAds.length);

    return await this.listingsService.createMany(newAds);
  }

  async getListingsSlow(url: string) {
    const listings = await this.showListings(url);

    if (!listings) {
      return;
    }

    const { ads } = listings;

    // Busca os registros da localização
    const dbAds = await this.listingModel
      .find
      //   {
      //   location: ads[0].location,
      // }
      ();

    this.logger.log(`dbAds`, dbAds.length);

    //verifica se ads estão no banco
    const newAds = ads.filter(
      (ad: any) =>
        !dbAds.find((dbAd) => Number(dbAd.listId) === Number(ad.listId)),
    );

    this.logger.log(
      `ads`,
      ads.map((ad) => ad.listId),
    );
    this.logger.log(
      `dbAds`,
      dbAds.map((dbAd) => dbAd.listId),
    );
    this.logger.log(
      `newAds`,
      newAds.map((ad) => ad.listId),
    );

    this.logger.log(`newAds`, newAds.length);

    //transform date
    newAds.forEach((ad: any) => {
      ad.date = new Date(ad.date * 1000);
    });

    this.logger.log(`newAds`, newAds.length);

    return await this.listingsService.createMany(newAds);
  }

  async getListingsAllSlow() {
    this.logger.log(`Getting all listings...`);
    const neighbourhoods = Object.values(Neighbourhood);

    for (const neighbourhood of neighbourhoods) {
      this.logger.log(`Getting listings from: ${neighbourhood}`);
      await this.getListingsSlow(`${this.entryPoint}/${neighbourhood}`);

      await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
    }
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
