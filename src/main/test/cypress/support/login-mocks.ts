import { faker } from '@faker-js/faker'
import * as Http from './http-mocks'

export const mockInvalidCredentialsError = (): void => {
  return Http.mockUnauthorizedError(/login/)
}

export const mockUnexpectedError = (): void => {
  return Http.mockServerError('POST', /login/)
}

export const mockOk = (): void => {
  return Http.mockOk('POST', /login/, {
    accessToken: faker.datatype.uuid(),
    name: faker.name.fullName()
  })
}
