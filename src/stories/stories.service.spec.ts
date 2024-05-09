import { Test, TestingModule } from '@nestjs/testing';
import { StoriesService } from './stories.service';
import { HttpService } from '@nestjs/axios';
import { Axios, AxiosResponse } from 'axios';
import { response } from 'express';

describe('StoriesService', () => {
  let service: StoriesService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoriesService, {
        provide: HttpService,
        useValue: {
          axiosRef: {
            get: jest.fn(),
          }
        }
      }]
    }).compile();

    service = module.get<StoriesService>(StoriesService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(httpService).toBeDefined();
  });

  describe('fetchTopStories', () => {
    it("should return an array of story IDs", async () => {
      const results: AxiosResponse = {
        data: [111, 222, 333, 444, 555],
        status: 200,
        statusText: "Ok",
        headers: {},
        config: {
          headers: undefined
        },
      };
      jest.spyOn(httpService.axiosRef, "get").mockResolvedValue(results);

      expect(await service.fetchTopStories()).toEqual(results.data.slice(0, 25));
      expect(httpService.axiosRef.get).toHaveBeenCalledWith("https://hacker-news.firebaseio.com/v0/topstories.json")
    });
  });

  describe("fetchTitlesFromStoryIds", () => {
    it("should return an array of titles from story Ids", async () => {
      const storyIds = [111, 222, 333, 444, 555]
      const result = storyIds.map(id => (
        {
          data: { id, title: `Title for story id ${id}` },
          status: 200,
          statusText: "OK",
          headers: {},
          config: {
            headers: undefined
          },
        }
      ))
      jest.spyOn(httpService.axiosRef, "get").mockImplementation(
        url => Promise.resolve(result.find(response => url.includes(response.data.id.toString())))
      )

      const titles = await service.fetchTitlesFromStoryIds(storyIds)
      expect(titles).toEqual(result.map(response => response.data.title))
      storyIds.map(id => {
        expect(httpService.axiosRef.get).toHaveBeenCalledWith(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      })
    });
  });
});
