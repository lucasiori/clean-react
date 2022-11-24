import { SaveSurveyResult } from '@/domain/usecases'
import { HttpClient } from '@/data/protocols/http'
import { RemoteSurveyResultModel } from '@/data/models'

export class RemoteSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly url: string,
    private readonly httpClientSpy: HttpClient<RemoteSaveSurveyResult.Model>
  ) {}

  async save (params: SaveSurveyResult.Params): Promise<SaveSurveyResult.Model> {
    await this.httpClientSpy.request({
      url: this.url,
      method: 'put',
      body: params
    })

    return null
  }
}

export namespace RemoteSaveSurveyResult {
  export type Model = RemoteSurveyResultModel
}
