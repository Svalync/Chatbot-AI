import axios, { AxiosInstance } from 'axios';

//File Imports
import env_values from '@/config';
import jsonUtilsImpl from '@/utils/jsonUtils';

export default class axiosInstance {
  private instance: AxiosInstance;
  private params: any = {};
  private headers: any = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  };
  private payload: any = {};
  private headerJson: any = {};

  public getInstance(): AxiosInstance {
    return this.instance;
  }

  public setInstance(instance: AxiosInstance): void {
    this.instance = instance;
  }

  public getParams(): any {
    return this.params;
  }

  public setParams(params: any): void {
    this.params = params;
  }

  public getHeaders(): any {
    return this.headers;
  }

  public setHeaders(headers: any): void {
    this.headers = headers;
  }

  public getPayload(): any {
    return this.payload;
  }

  public setPayload(payload: any): void {
    this.payload = payload;
  }

  public getHeaderJson(): any {
    return this.headerJson;
  }

  public setHeaderJson(headerJson: any): void {
    this.headerJson = headerJson;
  }

  public setInstanceByUrl(url: string) {
    this.instance = axios.create({
      baseURL: url,
    });
  }

  constructor() {
    this.instance = axios.create({
      baseURL: env_values.app.url,
    });
  }

  public async makeCall(URL: string, method: string) {
    let configJson: any = {
      headers: this.headers,
    };

    if (this.headerJson) {
      configJson['headers'] = this.headerJson;
    }

    if (!jsonUtilsImpl.isEmpty(this.params)) {
      configJson['params'] = this.params;
    }

    let response: any;
    try {
      if (method.toLowerCase() === 'get') {
        response = await this.instance.get(URL, configJson);
      }

      if (method.toLowerCase() === 'post') {
        response = await this.instance.post(URL, this.payload, configJson);
      }

      if (method.toLowerCase() === 'put') {
        response = await this.instance.put(URL, this.payload, configJson);
      }
    } catch (e: any) {
      let error = e.response.data;
      return error;
    }

    return response.data;
  }

  public async makeCallUsingAuth(URL: string, method: string, auth: any) {
    let configJson: any = {
      auth: auth,
      headers: this.headerJson,
    };

    if (!jsonUtilsImpl.isEmpty(this.params)) {
      configJson['params'] = this.params;
    }

    let response: any;
    try {
      if (method === 'GET') {
        response = await this.instance.get(URL, configJson);
      }

      if (method === 'POST') {
        response = await this.instance.post(URL, this.payload, configJson);
      }

      if (method === 'PUT') {
        response = await this.instance.put(URL, this.payload, configJson);
      }
    } catch (e: any) {
      let error = e.response.data;
      return error;
    }

    return response.data;
  }
}
