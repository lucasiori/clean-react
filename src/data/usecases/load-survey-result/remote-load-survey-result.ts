import { AccessDeniedError } from '@/domain/errors'
import { HttpGetClient, HttpStatusCode } from '@/data/protocols/http'

export class RemoteLoadSurveyResult {
  constructor (
    private readonly url: string,
    private readonly httpGetClientSpy: HttpGetClient
  ) {}

  async load (): Promise<void> {
    const httpResponse = await this.httpGetClientSpy.get({ url: this.url })

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: break
      default: throw new AccessDeniedError()
    }
  }
}
