import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Bottleneck from 'bottleneck';

const limiter = new Bottleneck({
  minTime: 200,
  maxConcurrent: 5
});

export class HttpService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL?: string) {
    this.axiosInstance = axios.create({ baseURL });
  }

  async get<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse> {
    try {
      const response = await limiter.schedule(() =>
        this.axiosInstance.get<TResponse>(url, config)
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`GET request ${url} failed - code ${error.response?.status}`);
        throw new Error(error?.response?.data);
      }
      throw error;
    }
  }

  async post<TResponse, TRequest = unknown>(
    url: string,
    data: TRequest,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    try {
      const response = await limiter.schedule(() =>
        this.axiosInstance.post<TResponse>(url, data, config)
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`POST request ${url} failed - code ${error.response?.status}`);
      }
      throw error;
    }
  }
}
