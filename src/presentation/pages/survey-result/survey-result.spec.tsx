import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory, MemoryHistory } from 'history'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AccountModel } from '@/domain/models'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import {
  LoadSurveyResultSpy,
  mockAccountModel,
  mockSurveyResultModel,
  SaveSurveyResultSpy
} from '@/domain/test'
import { SurveyResult } from '@/presentation/pages'
import { ApiContext } from '@/presentation/contexts'

type SutTypes = {
  loadSurveyResultSpy: LoadSurveyResultSpy
  saveSurveyResultSpy: SaveSurveyResultSpy
  history: MemoryHistory
  setCurrentAccountMock: (account: AccountModel) => void
}

type SutParams = {
  loadSurveyResultSpy?: LoadSurveyResultSpy
  saveSurveyResultSpy?: SaveSurveyResultSpy
}

const makeSut = ({
  loadSurveyResultSpy = new LoadSurveyResultSpy(),
  saveSurveyResultSpy = new SaveSurveyResultSpy()
}: SutParams = {}): SutTypes => {
  const history = createMemoryHistory({
    initialEntries: ['/', '/surveys/any_id'],
    initialIndex: 1
  })
  const setCurrentAccountMock = jest.fn()

  render(
    <ApiContext.Provider value={{
      setCurrentAccount: setCurrentAccountMock,
      getCurrentAccount: () => mockAccountModel()
    }}>
      <Router history={history}>
        <SurveyResult
          loadSurveyResult={loadSurveyResultSpy}
          saveSurveyResult={saveSurveyResultSpy}
        />
      </Router>
    </ApiContext.Provider>
  )

  return {
    loadSurveyResultSpy,
    saveSurveyResultSpy,
    history,
    setCurrentAccountMock
  }
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
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    const surveyResult = Object.assign(mockSurveyResultModel(), {
      date: new Date('2020-01-10T00:00:00')
    })
    loadSurveyResultSpy.surveyResult = surveyResult
    makeSut({ loadSurveyResultSpy })

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

  test('should render error on UnexpectedError', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(error)
    makeSut({ loadSurveyResultSpy })

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      expect(screen.queryByTestId('question')).not.toBeInTheDocument()
      expect(screen.getByTestId('error')).toHaveTextContent(error.message)
    })
  })

  test('should logout on AccessDeniedError', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(
      new AccessDeniedError()
    )
    const { history, setCurrentAccountMock } = makeSut({ loadSurveyResultSpy })

    await waitFor(() => {
      expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
      expect(history.location.pathname).toBe('/login')
    })
  })

  test('should call LoadSurveyResult on reload', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(error)
    makeSut({ loadSurveyResultSpy })

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('reload'))
    })

    await waitFor(() => {
      expect(loadSurveyResultSpy.callsCount).toBe(1)
      screen.getByRole('heading')
    })
  })

  test('should go to SurveyList on back button click', async () => {
    const { history } = makeSut()

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('back-button'))
    })

    expect(history.location.pathname).toBe('/')
  })

  test('should not present Loading on active answer click', async () => {
    makeSut()

    await waitFor(() => {
      const answersWrap = screen.queryAllByTestId('answer-wrap')
      fireEvent.click(answersWrap[0])
    })

    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  test('should call SaveSurveyResult on non active answer click', async () => {
    const { loadSurveyResultSpy, saveSurveyResultSpy } = makeSut()

    await waitFor(() => {
      const answersWrap = screen.queryAllByTestId('answer-wrap')
      fireEvent.click(answersWrap[1])
    })

    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(saveSurveyResultSpy.params).toEqual({
      answer: loadSurveyResultSpy.surveyResult.answers[1].answer
    })
  })

  test('should render error on UnexpectedError', async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy()
    const error = new UnexpectedError()
    jest.spyOn(saveSurveyResultSpy, 'save').mockRejectedValueOnce(error)
    makeSut({ saveSurveyResultSpy })

    await waitFor(() => {
      const answersWrap = screen.queryAllByTestId('answer-wrap')
      fireEvent.click(answersWrap[1])
    })

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      expect(screen.queryByTestId('question')).not.toBeInTheDocument()
      expect(screen.getByTestId('error')).toHaveTextContent(error.message)
    })
  })

  test('should logout on AccessDeniedError', async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy()
    jest.spyOn(saveSurveyResultSpy, 'save').mockRejectedValueOnce(
      new AccessDeniedError()
    )
    const { history, setCurrentAccountMock } = makeSut({ saveSurveyResultSpy })

    await waitFor(() => {
      const answersWrap = screen.queryAllByTestId('answer-wrap')
      fireEvent.click(answersWrap[1])
    })

    await waitFor(() => {
      expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
      expect(history.location.pathname).toBe('/login')
    })
  })

  test('should present SurveyResult data on SaveSurveyResult success', async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy()
    const surveyResult = Object.assign(mockSurveyResultModel(), {
      date: new Date('2018-02-20T00:00:00')
    })
    saveSurveyResultSpy.surveyResult = surveyResult
    makeSut({ saveSurveyResultSpy })

    await waitFor(() => {
      const answersWrap = screen.queryAllByTestId('answer-wrap')
      fireEvent.click(answersWrap[1])
    })

    await waitFor(() => {
      const answersWrap = screen.queryAllByTestId('answer-wrap')
      const images = screen.queryAllByTestId('image')
      const answers = screen.queryAllByTestId('answer')
      const percents = screen.queryAllByTestId('percent')
      expect(answersWrap[0]).toHaveClass('active')
      expect(answersWrap[1]).not.toHaveClass('active')
      expect(screen.getByTestId('day')).toHaveTextContent('20')
      expect(screen.getByTestId('month')).toHaveTextContent('fev')
      expect(screen.getByTestId('year')).toHaveTextContent('2018')
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
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })
  })
})
