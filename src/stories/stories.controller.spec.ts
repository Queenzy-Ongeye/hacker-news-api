import { Test, TestingModule } from '@nestjs/testing';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { HttpModule } from '@nestjs/axios';

describe('StoriesController', () => {
  let controller: StoriesController;
  let storyService: StoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoriesController],
      providers: [StoriesService],
      imports: [HttpModule]
    }).compile();

    controller = module.get<StoriesController>(StoriesController);
    storyService = module.get<StoriesService>(StoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
