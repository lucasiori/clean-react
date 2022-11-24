import React from 'react'
import { useHistory } from 'react-router-dom'
import { LoadSurveyResult } from '@/domain/usecases'
import { Calendar } from '@/presentation/components'
import Styles from './result-styles.scss'

type Props = {
  surveyResult: LoadSurveyResult.Model
}

const Result: React.FC<Props> = ({ surveyResult }) => {
  const { goBack } = useHistory()

  return (
    <>
      <hgroup>
        <Calendar date={surveyResult.date} className={Styles.calendarWrap} />
        <h2 data-testid="question">{surveyResult.question}</h2>
      </hgroup>

      <ul className={Styles.answersList} data-testid="answers">
        {surveyResult.answers.map((answer) => (
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

      <button
        type="button"
        className={Styles.button}
        data-testid="back-button"
        onClick={goBack}
      >
        Voltar
      </button>
    </>
  )
}

export default Result
