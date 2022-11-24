import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import {
  LoadSurveyResultSpy,
  mockAccountModel,
  mockSurveyResultModel
} from '@/domain/test'
import { SurveyResult } from '@/presentation/pages'
import { ApiContext } from '@/presentation/contexts'

type SutTypes = {
  loadSurveyResultSpy: LoadSurveyResultSpy
}

const makeSut = (surveyResult = mockSurveyResultModel()): SutTypes => {
  const loadSurveyResultSpy = new LoadSurveyResultSpy()
  loadSurveyResultSpy.surveyResult = surveyResult

  render(
    <ApiContext.Provider value={{
      setCurrentAccount: jest.fn(),
      getCurrentAccount: () => mockAccountModel()
    }}>
      <SurveyResult loadSurveyResult={loadSurveyResultSpy} />
    </ApiContext.Provider>
  )

  return { loadSurveyResultSpy }
}

describe('SurveyResult Component', () => {
  test('should present correct initial state', async () => {
    makeSut()

    const surveyResult = screen.getByTestId('survey-result')
    expect(surveyResult.childElementCount).toBe(0)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    await waitFor(() => surveyResult)
  })

  test('should call LoadSurveyResult', async () => {
    const { loadSurveyResultSpy } = makeSut()

    await waitFor(() => screen.getByTestId('survey-result'))
    expect(loadSurveyResultSpy.callsCount).toBe(1)
  })

  test('should present SurveyResult data on success', async () => {
    const surveyResult = Object.assign(mockSurveyResultModel(), {
      date: new Date('2020-01-10T00:00:00')
    })
    makeSut(surveyResult)

    await waitFor(() => {
      const answersWrap = screen.queryAllByTestId('answer-wrap')
      const images = screen.queryAllByTestId('image')
      const answers = screen.queryAllByTestId('answer')
      const percents = screen.queryAllByTestId('percent')
      expect(answersWrap[0]).toHaveClass('active')
      expect(answersWrap[1]).not.toHaveClass('active')
      expect(screen.getByTestId('day')).toHaveTextContent('10')
      expect(screen.getByTestId('month')).toHaveTextContent('jan')
      expect(screen.getByTestId('year')).toHaveTextContent('2020')
      expect(screen.getByTestId('question')).toHaveTextContent(
        surveyResult.question
      )
      expect(screen.getByTestId('answers').childElementCount).toBe(2)
      expect(images[0]).toHaveAttribute('src', surveyResult.answers[0].image)
      expect(images[0]).toHaveAttribute('alt', surveyResult.answers[0].answer)
      expect(images[1]).toBeFalsy()
      expect(answers[0]).toHaveTextContent(surveyResult.answers[0].answer)
      expect(answers[1]).toHaveTextContent(surveyResult.answers[1].answer)
      expect(percents[0]).toHaveTextContent(
        `${surveyResult.answers[0].percent}%`
      )
      expect(percents[1]).toHaveTextContent(
        `${surveyResult.answers[1].percent}%`
      )
    })
  })
})
