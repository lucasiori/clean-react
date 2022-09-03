import { faker } from '@faker-js/faker'
import * as Helper from '../support/http-mocks'

export const mockEmailInUseError = (): void => {
  return Helper.mockEmailInUseError(/signup/)
}

export const mockUnexpectedError = (): void => {
  return Helper.mockUnexpectedError('POST', /signup/)
}

export const mockInvalidData = (): void => {
  return Helper.mockOk('POST', /signup/, { invalidProperty: faker.random.words() })
}

export const mockOk = (): void => {
  return Helper.mockOk('POST', /signup/, { accessToken: faker.datatype.uuid() })
}
