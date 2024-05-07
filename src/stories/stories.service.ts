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

  

}
