import { faker } from '@faker-js/faker'
import * as Http from './http-mocks'

export const mockEmailInUseError = (): void => {
  return Http.mockForbiddenError('POST', /signup/)
}

export const mockUnexpectedError = (): void => {
  return Http.mockServerError('POST', /signup/)
}

export const mockOk = (): void => {
  return Http.mockOk('POST', /login/, {
    accessToken: faker.datatype.uuid(),
    name: faker.name.fullName()
  })
}
