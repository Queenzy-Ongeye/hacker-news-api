import { Test, TestingModule } from '@nestjs/testing';
import { StoriesService } from './stories.service';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

describe('StoriesService', () => {
  let service: StoriesService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoriesService, {
        provide: HttpService,
        useValue:{
          axiosRef:{
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

  describe('fetchTopStories', () =>{
    it("should return an array of story IDs", async() =>{
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

    })
  })
});
