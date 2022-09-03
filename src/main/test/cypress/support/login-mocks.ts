import { faker } from '@faker-js/faker'
import * as Helper from '../support/http-mocks'

export const mockInvalidCredentialsError = (): void => {
  return Helper.mockInvalidCredentialsError(/login/)
}

export const mockUnexpectedError = (): void => {
  return Helper.mockUnexpectedError('POST', /login/)
}

export const mockOk = (): void => {
  return Helper.mockOk('POST', /login/, { accessToken: faker.datatype.uuid() })
}

export const mockInvalidData = (): void => {
  return Helper.mockOk('POST', /login/, { invalidProperty: faker.random.words() })
}
