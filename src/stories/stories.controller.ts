import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
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
            return { topStories: topStories };
        }
        catch (error) {
            return { error: "Failed to load data" }
        }
    }
    @Get("top-last-posts")
    async getTopThreeWeekPosts() {
        try {
            const postTitles = await this.storiesService.fetchLastThreeWeekTitles();
            if (!postTitles.length) {
                throw new HttpException("No posts found from the last three weeks", HttpStatus.NOT_FOUND);
            }
            const wordCount = await this.storiesService.extractWords(postTitles);
            const topPosts = await this.storiesService.getTopWords(wordCount)
            return { lastThreeWeeksPosts: topPosts };

        } catch (error) {
            throw new HttpException("Failed to fetch posts", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
