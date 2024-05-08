import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { response } from 'express';

interface Story {
    id: number;
    title: string;
    time: number;
    by: string;
}

interface Users {
    id: string;
    karma: number;
    created: string;
}
@Injectable()
export class StoriesService {
    private axios: AxiosInstance;

    constructor(private httpService: HttpService) {
        this.axios = httpService.axiosRef;
    };

    // Top 10 most occurring words in the titles of the last 25 stories
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

    // Top 10 most occurring words in the titles of the post of exactly the last week 3 
    async fetchLastThreeWeekTitles(): Promise<any[]> {
        const storyIds = await this.fetchTopStories(); // reusing the fetchTopStories()
        return this.fetchTitlesFromStoryIdsWithinPeriod(storyIds, 3)
    }

    async fetchTitlesFromStoryIdsWithinPeriod(storyIds: number[], weeks: number): Promise<string[]> {
        const weeksAgoTimeStamp = (Date.now() / 1000) - (weeks * 7 * 24 * 60 * 60);
        const responses = await Promise.all(
            storyIds.map(id => this.axios.get<Story>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`))
        );
        const relevantPosts = responses
            .map(response => response.data)
            .filter(post => post.time > weeksAgoTimeStamp);
        return relevantPosts.map(post => post.title);
    }

    // top 10 most occurring words in titles of the last 600 stories of users with at least 10.000 karma
    async fetchKarmaTopStories(): Promise<any[]> {
        const storyId = await this.fetchTopStories()
        return this.fetchTitlesFromUsersWithKarma(storyId, 10000, 600)
    }
    async fetchTitlesFromUsersWithKarma(storyId: number[], minKarma: number, numStories: number): Promise<any[]> {
        const stories = await Promise.all(
            storyId.map(id => this.axios.get<Story>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`))
        );

        const userIds = stories.map(story => story.data.by);
        const users = await Promise.all(
            userIds.map(userId => this.axios.get<Users>(`https://hacker-news.firebaseio.com/v0/user/${userId}.json`))
        );
        const highKarmaUsers = users.map(response => response.data)
            .filter(user => user.karma >= minKarma).slice(0, numStories);
        return highKarmaUsers.map(karmaStory => karmaStory.karma);
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
