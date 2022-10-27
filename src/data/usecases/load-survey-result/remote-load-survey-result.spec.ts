import { faker } from '@faker-js/faker'
import { HttpGetClientSpy } from '@/data/test'
import { RemoteLoadSurveyResult } from './remote-load-survey-result'

type SutType = {
  sut: RemoteLoadSurveyResult
  httpGetClientSpy: HttpGetClientSpy
}

const makeSut = (url = faker.internet.url()): SutType => {
  const httpGetClientSpy = new HttpGetClientSpy()
  const sut = new RemoteLoadSurveyResult(url, httpGetClientSpy)

  return { sut, httpGetClientSpy }
}

describe('RemoteLoadSurveyResult', () => {
  test('should call HttpGetClient with correct url', async () => {
    const url = faker.internet.url()
    const { sut, httpGetClientSpy } = makeSut(url)

    await sut.load()

    expect(httpGetClientSpy.url).toBe(url)
  })
})
