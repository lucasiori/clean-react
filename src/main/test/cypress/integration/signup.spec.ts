import { faker } from '@faker-js/faker'
import * as Helper from '../utils/helpers'
import * as FormHelper from '../utils/form-helpers'
import * as Http from '../utils/http-mocks'

const path = /signup/
export const mockEmailInUseError = (): void => Http.mockForbiddenError('POST', path)
export const mockUnexpectedError = (): void => Http.mockServerError('POST', path)
export const mockSuccess = (): void => Http.mockOk('POST', path, 'fx:account')

const populateFields = (): void => {
  const password = faker.random.alphaNumeric(7)
  cy.getByTestId('name').focus().type(faker.name.fullName())
  cy.getByTestId('email').focus().type(faker.internet.email())
  cy.getByTestId('password').focus().type(password)
  cy.getByTestId('passwordConfirmation').focus().type(password)
}

const simulateValidSubmit = (): void => {
  populateFields()
  cy.getByTestId('submit').click()
}

describe('SignUp', () => {
  beforeEach(() => {
    cy.visit('/signup')
  })

  it('should load with correct initial state', () => {
    cy.getByTestId('name').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('name', 'Campo obrigatório')
    cy.getByTestId('email').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('email', 'Campo obrigatório')
    cy.getByTestId('password').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('password', 'Campo obrigatório')
    cy.getByTestId('passwordConfirmation').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('passwordConfirmation', 'Campo obrigatório')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('should present error state if form is invalid', () => {
    cy.getByTestId('name').focus().type(faker.random.alphaNumeric(3))
    cy.getByTestId('email').focus().type(faker.random.word())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    cy.getByTestId('passwordConfirmation')
      .focus()
      .type(faker.random.alphaNumeric(4))

    cy.getByTestId('name').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('name', 'Valor inválido')
    cy.getByTestId('email').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('email', 'Valor inválido')
    cy.getByTestId('password').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('password', 'Valor inválido')
    cy.getByTestId('passwordConfirmation').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('passwordConfirmation', 'Valor inválido')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('should present valid state if form is valid', () => {
    populateFields()

    FormHelper.testInputStatus('name')
    FormHelper.testInputStatus('email')
    FormHelper.testInputStatus('password')
    FormHelper.testInputStatus('passwordConfirmation')
    cy.getByTestId('submit').should('not.have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('should present EmailInUseError on 403', () => {
    mockEmailInUseError()

    simulateValidSubmit()

    FormHelper.testMainError('Esse e-mail já está em uso')
    Helper.testUrl('/signup')
  })

  it('should present UnexpectedError on default error cases', () => {
    mockUnexpectedError()

    simulateValidSubmit()

    FormHelper.testMainError('Algo de errado aconteceu. Tente novamente em breve.')
    Helper.testUrl('/signup')
  })

  it('should save account if valid credentials are provided', () => {
    mockSuccess()

    simulateValidSubmit()

    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should('not.exist')
    Helper.testUrl('/')
    Helper.testLocalStorageItem('account')
  })

  it('should prevent multiple submits', () => {
    mockSuccess()

    populateFields()

    cy.getByTestId('submit').dblclick()
    cy.wait('@request')

    Helper.testHttpCallsCount(1)
  })

  it('should not call submit if form is invalid', () => {
    mockSuccess()

    cy.getByTestId('email').focus().type(faker.internet.email())

    cy.getByTestId('email').focus().type('{enter}')

    Helper.testHttpCallsCount(0)
  })
})
