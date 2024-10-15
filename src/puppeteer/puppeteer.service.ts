import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class PuppeteerService {
  async launchBrowser() {
    return await puppeteer.launch({
      headless: true,
      timeout: 20 * 1000,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
}
