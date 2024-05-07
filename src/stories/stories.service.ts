import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
@Injectable()
export class StoriesService {
    private axios : AxiosInstance;

    constructor(private httpService: HttpService){
        this.axios = httpService.axiosRef;
    };

    async fetchTopStories():Promise<any[]>{
        const { data: topStoryIds } = await this.axios.get("https://hacker-news.firebaseio.com/v0/topstories.json");
        return topStoryIds.slice(0,25);
    };

    extractWords(titles: string[]): Record<string, number>{
        const wordCount = {}
        titles.forEach(title => {
            const words = title.split(/\s+/);
            words.forEach(word => {
                if (word) wordCount[word] = (wordCount[word] || 0) + 1;
            });
        });
        return wordCount;
    };

    getTopWords(wordCount: Record<string, number>, limit: number = 10): string[] {
        return Object.entries(wordCount)
        .sort((a,b) => b[1] - a[1])
        .slice(0, limit)
        .map(entry => entry[0]);
    };

}
