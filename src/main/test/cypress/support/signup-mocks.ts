import * as Helper from '../support/http-mocks'

export const mockEmailInUseError = (): void => {
  return Helper.mockEmailInUseError(/signup/)
}
