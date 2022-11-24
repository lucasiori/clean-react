import React, { useEffect, useState } from 'react'
import { LoadSurveyResult } from '@/domain/usecases'
import { useErrorHandler } from '@/presentation/hooks'
import {
  Calendar,
  Error,
  Footer,
  Header,
  Loading
} from '@/presentation/components'
import Styles from './survey-result-styles.scss'

type Props = {
  loadSurveyResult: LoadSurveyResult
}

const SurveyResult: React.FC<Props> = ({ loadSurveyResult }) => {
  const handleError = useErrorHandler((error: Error) => {
    setState(oldState => ({
      ...oldState,
      surveyResult: null,
      error: error.message
    }))
  })

  const [state, setState] = useState({
    surveyResult: null as LoadSurveyResult.Model,
    isLoading: false,
    error: ''
  })

  useEffect(() => {
    loadSurveyResult.load()
      .then((surveyResult) => {
        setState((oldState) => ({ ...oldState, surveyResult }))
      })
      .catch(handleError)
  }, [])

  return (
    <div className={Styles.surveyResultWrap}>
      <Header />

      <div className={Styles.contentWrap} data-testid="survey-result">
        {state.surveyResult && (
          <>
            <hgroup>
              <Calendar date={state.surveyResult.date} className={Styles.calendarWrap} />
              <h2 data-testid="question">{state.surveyResult.question}</h2>
            </hgroup>

            <ul className={Styles.answersList} data-testid="answers">
              {state.surveyResult.answers.map((answer) => (
                <li
                  key={answer.answer}
                  className={answer.isCurrentAccountAnswer ? Styles.active : ''}
                  data-testid="answer-wrap"
                >
                  {!!answer.image && (
                    <img
                      src={answer.image}
                      alt={answer.answer}
                      data-testid="image"
                    />
                  )}
                  <span className={Styles.answer} data-testid="answer">
                    {answer.answer}
                  </span>
                  <span className={Styles.percent} data-testid="percent">
                    {answer.percent}%
                  </span>
                </li>
              ))}
            </ul>

            <button type="button">Voltar</button>
          </>
        )}

        {state.isLoading && <Loading />}
        {state.error && <Error error={state.error} reload={() => {}} />}
      </div>

      <Footer />
    </div>
  )
}

export default SurveyResult
