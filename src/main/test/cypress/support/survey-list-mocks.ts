import * as Http from './http-mocks'

export const mockUnexpectedError = (): void => {
  return Http.mockServerError('GET', /surveys/)
}

export const mockAccessDeniedError = (): void => {
  return Http.mockForbiddenError('GET', /surveys/)
}
