import { faker } from '@faker-js/faker'
import { mockAuthentication, mockAuthenticationModel } from '@/domain/test'
import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors'
import { HttpStatusCode } from '@/data/protocols/http'
import { HttpClientSpy } from '@/data/test'
import { RemoteAuthentication } from './remote-authentication'

type SutTypes = {
  sut: RemoteAuthentication
  httpClientSpy: HttpClientSpy<RemoteAuthentication.Model>
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<RemoteAuthentication.Model>()
  const sut = new RemoteAuthentication(url, httpClientSpy)

  return {
    sut,
    httpClientSpy
  }
}

describe('RemoteAuthentication', () => {
  test('should call HttpClient with correct values', async () => {
    const url = faker.internet.url()
    const authenticationParams = mockAuthentication()
    const { sut, httpClientSpy } = makeSut(url)

    await sut.auth(authenticationParams)

    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('post')
    expect(httpClientSpy.body).toEqual(authenticationParams)
  })

  test('should throw UnexpectedError if HttpClient returns 400', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }

    const promise = sut.auth(mockAuthentication())

    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should throw InvalidCredentialsError if HttpClient returns 401', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    }

    const promise = sut.auth(mockAuthentication())

    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  test('should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }

    const promise = sut.auth(mockAuthentication())

    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }

    const promise = sut.auth(mockAuthentication())

    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should return an Authentication.Model if HttpClient returns 200', async () => {
    const httpResult = mockAuthenticationModel()
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }

    const account = await sut.auth(mockAuthentication())

    expect(account).toEqual(httpResult)
  })
})
