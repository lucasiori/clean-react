import * as Helper from '../utils/helpers'
import * as Http from '../utils/http-mocks'

const path = /surveys/
const mockLoadSuccess = (): void => Http.mockOk('GET', path, 'fx:load-survey-result')

describe('SurveyResult', () => {
  describe('load', () => {
    const mockUnexpectedError = (): void => Http.mockServerError('GET', path)
    const mockAccessDeniedError = (): void => Http.mockForbiddenError('GET', path)

    beforeEach(() => {
      cy.fixture('account').then(account => {
        Helper.setLocalStorageItem('account', account)
      })
    })

    it('should present error on UnexpectedError', () => {
      mockUnexpectedError()
      cy.visit('/surveys/any_id')

      cy.getByTestId('error').should('contain.text', 'Algo de errado aconteceu. Tente novamente em breve.')
    })

    it('should reload on button click', () => {
      mockUnexpectedError()
      cy.visit('/surveys/any_id')

      mockLoadSuccess()
      cy.getByTestId('reload').click()

      cy.getByTestId('question').should('exist')
    })

    it('should logout on AccessDeniedError', () => {
      mockAccessDeniedError()
      cy.visit('/surveys/any_id')

      Helper.testUrl('/login')
    })

    it('should present survey items', () => {
      mockLoadSuccess()
      cy.visit('/surveys/any_id')

      cy.getByTestId('question').should('have.text', 'Question')
      cy.getByTestId('day').should('have.text', '03')
      cy.getByTestId('month').should('have.text', 'fev')
      cy.getByTestId('year').should('have.text', '2018')
      cy.get('li:nth-child(1)').then(element => {
        assert.equal(element.find('[data-testid="answer"]').text(), 'any_answer')
        assert.equal(element.find('[data-testid="image"]').attr('src'), 'any_image')
        assert.equal(element.find('[data-testid="percent"]').text(), '70%')
      })
      cy.get('li:nth-child(2)').then(element => {
        assert.equal(element.find('[data-testid="answer"]').text(), 'any_answer_2')
        assert.notExists(element.find('[data-testid="image"]'))
        assert.equal(element.find('[data-testid="percent"]').text(), '30%')
      })
    })

    it('should go to SurveyList on back button click', () => {
      mockLoadSuccess()
      cy.visit('/')
      cy.visit('/surveys/any_id')

      cy.getByTestId('back-button').click()

      Helper.testUrl('/')
    })
  })

  describe('save', () => {
    const mockUnexpectedError = (): void => Http.mockServerError('PUT', path)
    const mockAccessDeniedError = (): void => Http.mockForbiddenError('PUT', path)
    const mockSaveSuccess = (): void => Http.mockOk('PUT', path, 'fx:save-survey-result')

    beforeEach(() => {
      cy.fixture('account').then(account => {
        Helper.setLocalStorageItem('account', account)
      })
      mockLoadSuccess()
      cy.visit('/surveys/any_id')
    })

    it('should present error on UnexpectedError', () => {
      mockUnexpectedError()

      cy.get('li:nth-child(2)').click()

      cy.getByTestId('error').should('contain.text', 'Algo de errado aconteceu. Tente novamente em breve.')
    })

    it('should logout on AccessDeniedError', () => {
      mockAccessDeniedError()

      cy.get('li:nth-child(2)').click()

      Helper.testUrl('/login')
    })

    it('should present survey items', () => {
      mockSaveSuccess()

      cy.get('li:nth-child(2)').click()

      cy.getByTestId('question').should('have.text', 'Other Question')
      cy.getByTestId('day').should('have.text', '23')
      cy.getByTestId('month').should('have.text', 'mar')
      cy.getByTestId('year').should('have.text', '2020')
      cy.get('li:nth-child(1)').then(element => {
        assert.equal(element.find('[data-testid="answer"]').text(), 'other_answer')
        assert.equal(element.find('[data-testid="image"]').attr('src'), 'other_image')
        assert.equal(element.find('[data-testid="percent"]').text(), '50%')
      })
      cy.get('li:nth-child(2)').then(element => {
        assert.equal(element.find('[data-testid="answer"]').text(), 'other_answer_2')
        assert.notExists(element.find('[data-testid="image"]'))
        assert.equal(element.find('[data-testid="percent"]').text(), '50%')
      })
    })
  })
})
