import React from 'react'
import { SurveyModel } from '@/domain/models'
import { Icon, IconName } from '@/presentation/components'
import Styles from './survey-item-styles.scss'

type Props = {
  survey: SurveyModel
}

const SurveyItem: React.FC<Props> = ({ survey }) => {
  return (
    <li className={Styles.surveyItemWrap}>
      <div className={Styles.surveyContent}>
        <Icon iconName={IconName.thumbUp} className={Styles.iconWrap} />

        <time>
          <span className={Styles.day} data-testid="day">
            {survey.date.getDate()}
          </span>

          <span className={Styles.month} data-testid="month">
            {
              survey.date.toLocaleString('pt-BR', { month: 'short' })
                .replace('.', '')
            }
          </span>

          <span className={Styles.year} data-testid="year">
            {survey.date.getFullYear()}
          </span>
        </time>

        <p data-testid="question">{survey.question}</p>
      </div>

      <footer>Ver Resultado</footer>
    </li>
  )
}

export default SurveyItem
