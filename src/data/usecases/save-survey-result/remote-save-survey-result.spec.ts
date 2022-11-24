import { faker } from '@faker-js/faker'
import { mockSaveSurveyResultParams } from '@/domain/test'
import { HttpStatusCode } from '@/data/protocols/http'
import { HttpClientSpy, mockRemoteSurveyResultModel } from '@/data/test'
import { RemoteSaveSurveyResult } from './remote-save-survey-result'

type SutType = {
  sut: RemoteSaveSurveyResult
  httpClientSpy: HttpClientSpy
}

const makeSut = (url = faker.internet.url()): SutType => {
  const httpClientSpy = new HttpClientSpy()
  const sut = new RemoteSaveSurveyResult(url, httpClientSpy)

  return { sut, httpClientSpy }
}

describe('RemoteSaveSurveyResult', () => {
  test('should call HttpClient with correct values', async () => {
    const url = faker.internet.url()
    const saveSurveyResultParams = mockSaveSurveyResultParams()
    const { sut, httpClientSpy } = makeSut(url)
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: mockRemoteSurveyResultModel()
    }

    await sut.save(saveSurveyResultParams)

    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('put')
    expect(httpClientSpy.body).toBe(saveSurveyResultParams)
  })
})
