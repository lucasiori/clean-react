import { faker } from '@faker-js/faker'

export const mockInvalidCredentialsError = (url: RegExp): void => {
  cy.intercept({ method: 'POST', url }, (req) => {
    req.continue(res => {
      res.statusCode = 401
      res.body.error = faker.random.words()
    })
  }).as('request')
}

export const mockUnexpectedError = (method: string, url: RegExp): void => {
  cy.intercept({ method, url }, (req) => {
    req.continue(res => {
      res.statusCode = faker.helpers.arrayElement([400, 404, 500])
      res.body.error = faker.random.words()
    })
  }).as('request')
}

export const mockOk = (method: string, url: RegExp, response: any): void => {
  cy.intercept({ method, url }, (req) => {
    req.continue(res => {
      res.statusCode = 200
      res.body = response
    })
  }).as('request')
}
