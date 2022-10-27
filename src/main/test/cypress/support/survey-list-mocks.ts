import * as Http from './http-mocks'

export const mockUnexpectedError = (): void => {
  return Http.mockServerError('GET', /surveys/)
}
