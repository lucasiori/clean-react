import * as Helper from '../support/http-mocks'

export const mockEmailInUseError = (): void => {
  return Helper.mockEmailInUseError(/signup/)
}

export const mockUnexpectedError = (): void => {
  return Helper.mockUnexpectedError('POST', /signup/)
}
