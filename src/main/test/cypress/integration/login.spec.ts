import { faker } from '@faker-js/faker'
import * as FormHelper from '../support/form-helper'
import * as Http from '../support/login-mocks'

const simulateValidSubmit = (): void => {
  cy.getByTestId('email').focus().type(faker.internet.email())
  cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
  cy.getByTestId('submit').click()
}

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should load with correct initial state', () => {
    cy.getByTestId('email').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('email', 'Campo obrigatório')
    cy.getByTestId('password').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('password', 'Campo obrigatório')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('should present error state if form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.word())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))

    cy.getByTestId('email').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('email', 'Valor inválido')
    cy.getByTestId('password').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('password', 'Valor inválido')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('should present valid state if form is valid', () => {
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))

    FormHelper.testInputStatus('email')
    FormHelper.testInputStatus('password')
    cy.getByTestId('submit').should('not.have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('should present InvalidCredentialsError on 401', () => {
    Http.mockInvalidCredentialsError()

    simulateValidSubmit()

    FormHelper.testMainError('Credenciais inválidas')
    FormHelper.testUrl('/login')
  })

  it('should present UnexpectedError on default error cases', () => {
    Http.mockUnexpectedError()

    simulateValidSubmit()

    FormHelper.testMainError('Algo de errado aconteceu. Tente novamente em breve.')
    FormHelper.testUrl('/login')
  })

  it('should present UnexpectedError if invalid data is returned', () => {
    Http.mockInvalidData()

    simulateValidSubmit()

    FormHelper.testMainError('Algo de errado aconteceu. Tente novamente em breve.')
    FormHelper.testUrl('/login')
  })

  it('should save accessToken if valid credentials are provided', () => {
    Http.mockOk()

    simulateValidSubmit()

    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should('not.exist')
    FormHelper.testUrl('/')
    FormHelper.testLocalStorageItem('accessToken')
  })

  it('should prevent multiple submits', () => {
    Http.mockOk()

    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))

    cy.getByTestId('submit').dblclick()

    FormHelper.testHttpCallsCount(1)
  })

  it('should not call submit if form is invalid', () => {
    cy.intercept({ method: 'POST', url: /login/ }, (req) => {
      req.continue(res => {
        res.statusCode = 200
        res.body.accessToken = faker.datatype.uuid()
      })
    }).as('request')

    cy.getByTestId('email').focus().type(faker.internet.email())

    cy.getByTestId('email').focus().type('{enter}')

    FormHelper.testHttpCallsCount(0)
  })
})