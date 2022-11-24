import React, { useEffect, useState } from 'react'
import { LoadSurveyResult } from '@/domain/usecases'
import { useErrorHandler } from '@/presentation/hooks'
import {
  Error,
  Footer,
  Header,
  Loading
} from '@/presentation/components'
import { SurveyResultData } from './components'
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

      <div className={Styles.contentWrap} data-testid="survey-result">
        {state.surveyResult && (
          <SurveyResultData surveyResult={state.surveyResult} />
        )}
        {state.isLoading && <Loading />}
        {state.error && <Error error={state.error} reload={reload} />}
      </div>

      <Footer />
    </div>
  )
}

export default SurveyResult
