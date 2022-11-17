import React from 'react'
import { render, screen } from '@testing-library/react'
import { mockAccountModel } from '@/domain/test'
import { SurveyResult } from '@/presentation/pages'
import { ApiContext } from '@/presentation/contexts'

describe('SurveyResult Component', () => {
  test('should present correct initial state', async () => {
    render(
      <ApiContext.Provider value={{
        setCurrentAccount: jest.fn(),
        getCurrentAccount: () => mockAccountModel()
      }}>
        <SurveyResult />
      </ApiContext.Provider>
    )

    const surveyResult = screen.getByTestId('survey-result')
    expect(surveyResult.childElementCount).toBe(0)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })
})
