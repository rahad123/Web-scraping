import { Controller, Get } from '@nestjs/common';
import { ScraperService } from 'src/service/scraping.service';

@Controller()
export class ScrapingController {
  constructor(private readonly appService: ScraperService) {}
  @Get('/addItems')
  async getNextPageUrl() {
    return this.appService.getNextPageUrl();
  }

  @Get('/fetchItems')
  async fetchItems() {
    return this.appService.fetchItems();
  }

  @Get('/getTotalAddsCount')
  async getTotalAddsCount(): Promise<void> {
    const totalAdds = this.appService.getTotalAddsCount();
    return totalAdds;
  }

//   @Get('/scrapeAllPagesAndAdds')
//   async scrapeAllPagesAndAdds(): Promise<string> {
//     return this.appService.updateUser();
//   }

  @Get('/getAllAds')
  async findAll(): Promise<any> {
    const ads = await this.appService.getAllAds();
    return ads;
  }
}
