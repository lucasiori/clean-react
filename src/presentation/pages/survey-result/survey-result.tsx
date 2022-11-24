import React, { useEffect, useState } from 'react'
import { LoadSurveyResult, SaveSurveyResult } from '@/domain/usecases'
import { useErrorHandler } from '@/presentation/hooks'
import {
  Error,
  Footer,
  Header,
  Loading
} from '@/presentation/components'
import { SurveyResultContext, SurveyResultData } from './components'
import Styles from './survey-result-styles.scss'

type Props = {
  loadSurveyResult: LoadSurveyResult
  saveSurveyResult: SaveSurveyResult
}

const SurveyResult: React.FC<Props> = ({
  loadSurveyResult,
  saveSurveyResult
}) => {
  const handleError = useErrorHandler((error: Error) => {
    setState(oldState => ({
      ...oldState,
      surveyResult: null,
      isLoading: false,
      error: error.message
    }))
  })

  const [state, setState] = useState({
    surveyResult: null as LoadSurveyResult.Model,
    isLoading: false,
    reload: false,
    error: ''
  })

  const reload = (): void => {
    setState(oldState => ({
      surveyResult: null,
      error: '',
      isLoading: false,
      reload: !oldState.reload
    }))
  }

  const onAnswer = (answer: string): void => {
    if (state.isLoading) return

    setState(oldState => ({ ...oldState, isLoading: true }))
    saveSurveyResult.save({ answer })
      .then((surveyResult) => {
        setState((oldState) => ({ ...oldState, isLoading: false, surveyResult }))
      })
      .catch(handleError)
  }

  useEffect(() => {
    loadSurveyResult.load()
      .then((surveyResult) => {
        setState((oldState) => ({ ...oldState, surveyResult }))
      })
      .catch(handleError)
  }, [state.reload])

  return (
    <div className={Styles.surveyResultWrap}>
      <Header />

      <SurveyResultContext.Provider value={{ onAnswer }}>
        <div className={Styles.contentWrap} data-testid="survey-result">
          {state.surveyResult && (
            <SurveyResultData surveyResult={state.surveyResult} />
          )}
          {state.isLoading && <Loading />}
          {state.error && <Error error={state.error} reload={reload} />}
        </div>
      </SurveyResultContext.Provider>

      <Footer />
    </div>
  )
}

export default SurveyResult
