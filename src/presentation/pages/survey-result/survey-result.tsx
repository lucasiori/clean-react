import React, { useState } from 'react'
import { LoadSurveyResult } from '@/domain/usecases'
import {
  Calendar,
  Error,
  Footer,
  Header,
  Loading
} from '@/presentation/components'
import Styles from './survey-result-styles.scss'

const SurveyResult: React.FC = () => {
  const [state] = useState({
    surveyResult: null as LoadSurveyResult.Model,
    isLoading: false,
    error: ''
  })

  return (
    <div className={Styles.surveyResultWrap}>
      <Header />

      <div className={Styles.contentWrap} data-testid="survey-result">
        {state.surveyResult && (
          <>
            <hgroup>
              <Calendar date={new Date()} className={Styles.calendarWrap} />
              <h2>Qual é seu framework web favorito?</h2>
            </hgroup>

            <ul className={Styles.answersList}>
              <li>
                <img src="http://fordevs.herokuapp.com/static/img/logo-react.png" />
                <span className={Styles.answer}>ReactJS</span>
                <span className={Styles.percent}>50%</span>
              </li>

              <li className={Styles.active}>
                <img src="http://fordevs.herokuapp.com/static/img/logo-react.png" />
                <span className={Styles.answer}>ReactJS</span>
                <span className={Styles.percent}>50%</span>
              </li>

              <li>
                <img src="http://fordevs.herokuapp.com/static/img/logo-react.png" />
                <span className={Styles.answer}>ReactJS</span>
                <span className={Styles.percent}>50%</span>
              </li>
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
