import React from 'react'
import Styles from './answer-styles.scss'

type Props = {
  answer: {
    image?: string
    answer: string
    count: number
    percent: number
    isCurrentAccountAnswer: boolean
  }
}

const Answer: React.FC<Props> = ({ answer }) => {
  const activeClassName = answer.isCurrentAccountAnswer ? Styles.active : ''

  return (
    <li
      className={[Styles.answerWrap, activeClassName].join(' ')}
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
  )
}

export default Answer
