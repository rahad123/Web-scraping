import { Module } from '@nestjs/common';
import { ScrapingController } from './scraping/scraping.controller';
import { ScraperService } from './service/scraping.service';

@Module({
  imports: [],
  controllers: [ScrapingController],
  providers: [ScraperService],
})
export class AppModule {}
