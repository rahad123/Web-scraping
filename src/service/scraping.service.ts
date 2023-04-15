import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
// import * as axios from ('axios').default;
import { default as axios } from 'axios';

export class ScraperService {
  private currentPageUrl: string;
  private $: cheerio.Root;

  constructor() {
    this.currentPageUrl = 'https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz'; // replace with your initial page URL
  }

  async getNextPageUrl(): Promise<string> {
    if (!this.$) {
      // if Cheerio hasn't been initialized yet, fetch the initial page
      const response = await fetch(this.currentPageUrl);
      const html = await response.text();
      this.$ = cheerio.load(html);
    }

    // find the "next page" link using a CSS selector
    const nextPageLink = this.$('a.next').attr('href');
    console.log('nextPageLink', nextPageLink);
    if (!nextPageLink) {
      // if there is no "next page" link, return null to signal that there are no more pages
      return null;
    }

    // construct the URL of the next page and update the internal state of the scraper
    const nextPageUrl = new URL(nextPageLink, this.currentPageUrl).href;
    this.currentPageUrl = nextPageUrl;
    this.$ = null; // clear Cheerio's internal state so that it can be re-initialized on the next page
    return nextPageUrl;
  }

  async fetchItems(): Promise<{ url: string; id: string }[]> {
    const url = 'https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz';
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    // Extract item URLs and IDs from the list page
    const itemLinks = $('ul.items-list a.item-link');
    const items: { url: string; id: string }[] = [];

    itemLinks.each((index, element) => {
      const url = $(element).attr('href');
      const id = $(element).data('item-id');
      if (url && id) {
        items.push({ url, id });
      }
    });
    console.log(items);
    return items;
  }

  async getTotalAddsCount(): Promise<any> {
    const url = 'https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz'; // replace with your initial URL

    axios.get(url).then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const adElements = $('div.ad'); // replace 'div.ad' with the selector for your ad elements
      const numAds = adElements.length;
      console.log(`Total number of ads: ${numAds}`);
      return numAds;
    });
  }

  async getAllAds(): Promise<any> {
    const baseUrl = 'https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz';
    const ads = [];

    let currentPage = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const url = `${baseUrl}?page=${currentPage}`;
      const response = await axios.get(url);
      const html = response.data;

      const $ = cheerio.load(html);
      const adLinks = $('a.ad-link');

      if (adLinks.length > 0) {
        adLinks.each(async (index, element) => {
          const adUrl = $(element).attr('href');
          const adId = adUrl.substring(adUrl.lastIndexOf('/') + 1);
          const adResponse = await axios.get(adUrl);
          const adHtml = adResponse.data;

          const $ad = cheerio.load(adHtml);
          const title = $ad('.title').text();
          const price = $ad('.price').text();
          const registrationDate = $ad('.reg-date').text();
          const productionDate = $ad('.prod-date').text();
          const mileage = $ad('.mileage').text();
          const power = $ad('.power').text();

          const ad = {
            id: adId,
            title,
            price,
            registrationDate,
            productionDate,
            mileage,
            power,
          };
          ads.push(ad);
        });
        currentPage++;
      } else {
        hasNextPage = false;
      }
    }

    return ads;
  }
}
