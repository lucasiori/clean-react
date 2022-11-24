import axios, { AxiosResponse } from 'axios'
import {
  HttpClient,
  HttpRequest,
  HttpResponse
} from '@/data/protocols/http'

export class AxiosHttpClient implements HttpClient {
  async request (data: HttpRequest): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse<any>

    try {
      axiosResponse = await axios.request({
        url: data.url,
        method: data.method,
        headers: data.headers,
        data: data.body
      })
    } catch (err) {
      axiosResponse = err.response
    }

    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data
    }
  }
}
