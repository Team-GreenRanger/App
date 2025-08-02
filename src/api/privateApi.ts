import axios, { AxiosInstance, AxiosResponse } from 'axios';

class PrivateApiService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }

  public async get<T>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  public async post<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  public async put<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  public async delete<T>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }

  public async patch<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }
}

export const privateApi = new PrivateApiService();
export default privateApi;