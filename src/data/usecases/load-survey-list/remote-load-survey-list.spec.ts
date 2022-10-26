import { faker } from '@faker-js/faker'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { HttpGetClientSpy, mockRemoteSurveyListModel } from '@/data/test'
import { HttpStatusCode } from '@/data/protocols/http'
import { RemoteLoadSurveyList } from './remote-load-survey-list'

type SutTypes = {
  sut: RemoteLoadSurveyList
  httpGetClientSpy: HttpGetClientSpy<RemoteLoadSurveyList.Model[]>
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpGetClientSpy = new HttpGetClientSpy<RemoteLoadSurveyList.Model[]>()
  const sut = new RemoteLoadSurveyList(url, httpGetClientSpy)

  return { sut, httpGetClientSpy }
}

describe('RemoteLoadSurveyList', () => {
  test('should call HttpGetClient with correct URL', async () => {
    const url = faker.internet.url()
    const { sut, httpGetClientSpy } = makeSut(url)

    await sut.loadAll()

    expect(httpGetClientSpy.url).toBe(url)
  })

  test('should throw AccessDeniedError if HttpGetClient returns 403', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }

    const promise = sut.loadAll()

    await expect(promise).rejects.toThrow(new AccessDeniedError())
  })

  test('should throw UnexpectedError if HttpGetClient returns 404', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }

    const promise = sut.loadAll()

    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should throw UnexpectedError if HttpGetClient returns 500', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }

    const promise = sut.loadAll()

    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should return a list of SurveyList.Model if HttpGetClient returns 200', async () => {
    const httpResult = mockRemoteSurveyListModel()
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }

    const surveyList = await sut.loadAll()

    expect(surveyList).toEqual([
      { ...httpResult[0], date: new Date(httpResult[0].date) },
      { ...httpResult[1], date: new Date(httpResult[1].date) },
      { ...httpResult[2], date: new Date(httpResult[2].date) }
    ])
  })

  test('should return an empty list if HttpGetClient returns 204', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    }

    const surveyList = await sut.loadAll()

    expect(surveyList).toEqual([])
  })
})
