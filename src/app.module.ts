import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoriesModule } from './stories/stories.module';

@Module({
  imports: [StoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
