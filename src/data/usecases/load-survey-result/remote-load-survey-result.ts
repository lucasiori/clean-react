import { HttpGetClient } from '@/data/protocols/http'

export class RemoteLoadSurveyResult {
  constructor (
    private readonly url: string,
    private readonly httpGetClientSpy: HttpGetClient
  ) {}

  async load (): Promise<void> {
    await this.httpGetClientSpy.get({ url: this.url })
  }
}
