import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { response } from 'express';

interface Post {
    id: number;
    title: string;
    time: number; // assuming this is the timestamp of the post
}
@Injectable()
export class StoriesService {
    private axios: AxiosInstance;

    constructor(private httpService: HttpService) {
        this.axios = httpService.axiosRef;
    };

    // Top 10 most occurring words in the titles of the last 25 stories ---start
    async fetchTopStories(): Promise<number[]> {
        const { data: topStoryIds } = await this.axios.get("https://hacker-news.firebaseio.com/v0/topstories.json");
        return topStoryIds.slice(0, 25);
    };

    // function of fetching titles from storyIds
    async fetchTitlesFromStoryIds(storyIds: any[]): Promise<string[]> {
        const stories = await Promise.all(
            storyIds.map(id => this.axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`))
        );
        return stories.map(story => story.data.title)
    }

    // Top 10 most occurring words in the titles of the post of exactly the last week 3 -----Start
    async fetchLastThreeWeekTitles(): Promise<any[]> {
        const storyIds = await this.fetchTopStories(); // reusing the fetchTopStories()
        return this.fetchTitlesFromStoryIdsWithinPeriod(storyIds, 3)
    }

    async fetchTitlesFromStoryIdsWithinPeriod(storyIds: number[], weeks: number): Promise<string[]> {
        const weeksAgoTimeStamp = (Date.now() / 1000) - (weeks * 7 * 24 * 60 * 60); // Convert current time to seconds and calculate weeks ago
        const responses = await Promise.all(
            storyIds.map(id => this.axios.get<Post>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`))
        );
        const relevantPosts = responses
            .map(response => response.data)
            .filter(post => post.time > weeksAgoTimeStamp); // Filter posts newer than three weeks ago
        return relevantPosts.map(post => post.title);
    }

    // extracting words from titles
    extractWords(titles: string[]): Record<string, number> {
        const wordCount = {}
        titles.forEach(title => {
            const words = title.split(/\s+/);
            words.forEach(word => {
                if (word) wordCount[word] = (wordCount[word] || 0) + 1;
            });
        });
        return wordCount;
    };

    // getting the top words
    getTopWords(wordCount: Record<string, number>, limit: number = 10): string[] {
        return Object.entries(wordCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(entry => entry[0]);
    };

}
