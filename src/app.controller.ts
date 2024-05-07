import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { StoriesService } from './stories/stories.service';

@Controller()
export class AppController {
  constructor(private storiesService: StoriesService) {}

  @Get()
  getHello(): string {
    return "Welcome to Hacker News";
  }
}
