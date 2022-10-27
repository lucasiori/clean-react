import { faker } from '@faker-js/faker'
import * as Helper from '../support/helpers'
import * as Http from '../support/survey-list-mocks'

describe('SurveyList', () => {
  beforeEach(() => {
    Helper.setLocalStorageItem('account', {
      accessToken: faker.datatype.uuid(),
      name: faker.name.fullName()
    })
  })

  it('should present error on UnexpectedError', () => {
    Http.mockUnexpectedError()
    cy.visit('')

    cy.getByTestId('error').should('contain.text', 'Algo de errado aconteceu. Tente novamente em breve.')
  })
})
