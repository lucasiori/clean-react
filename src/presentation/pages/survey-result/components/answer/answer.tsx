import React, { useContext } from 'react'
import { SurveyResultAnswerModel } from '@/domain/models'
import { SurveyResultContext } from '@/presentation/pages/survey-result/components'
import Styles from './answer-styles.scss'

type Props = {
  answer: SurveyResultAnswerModel
}

const Answer: React.FC<Props> = ({ answer }) => {
  const { onAnswer } = useContext(SurveyResultContext)
  const activeClassName = answer.isCurrentAccountAnswer ? Styles.active : ''

  const answerClick = (event: React.MouseEvent): void => {
    if (event.currentTarget.classList.contains(Styles.active)) return

    onAnswer(answer.answer)
  }

  return (
    <li
      className={[Styles.answerWrap, activeClassName].join(' ')}
      data-testid="answer-wrap"
      onClick={answerClick}
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
  )
}

export default Answer
