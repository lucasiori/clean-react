import { faker } from '@faker-js/faker'
import {
  HttpClient,
  HttpRequest,
  HttpResponse,
  HttpStatusCode
} from '@/data/protocols/http'

export const mockHttpRequest = (): HttpRequest => ({
  url: faker.internet.url(),
  method: faker.helpers.arrayElement(['get', 'post', 'put', 'delete']),
  headers: faker.datatype.uuid(),
  body: faker.datatype.uuid()
})

export class HttpClientSpy<R = any> implements HttpClient<R> {
  url?: string
  method?: string
  headers?: any
  body?: any
  response: HttpResponse<R> = {
    statusCode: HttpStatusCode.ok
  }

  async request (data: HttpRequest): Promise<HttpResponse<R>> {
    this.url = data.url
    this.method = data.method
    this.headers = data.headers
    this.body = data.body

    return this.response
  }
}
