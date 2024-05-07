import { Controller, Get } from '@nestjs/common';
import { StoriesService } from './stories.service';

@Controller('stories')
export class StoriesController {
    constructor(private storiesService: StoriesService) { }
    @Get("top-words")
    async getTopWordsFromStories() {
        try {
            const storyIds = await this.storiesService
                .fetchTopStories();
            const titles = await this.storiesService.fetchTitlesFromStoryIds(storyIds);
            const wordCount = this.storiesService.extractWords(titles);
            const topStories = this.storiesService.getTopWords(wordCount)
            return { data: topStories };
        }
        catch (error){
            return {error: "Failed to load data"}
        }
    }
}
