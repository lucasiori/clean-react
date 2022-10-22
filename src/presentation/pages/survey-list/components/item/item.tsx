import React from 'react'
import { LoadSurveyList } from '@/domain/usecases'
import { Icon, IconName } from '@/presentation/components'
import Styles from './item-styles.scss'

type Props = {
  survey: LoadSurveyList.Model
}

const SurveyItem: React.FC<Props> = ({ survey }) => {
  const iconName = survey.didAnswer ? IconName.thumbUp : IconName.thumbDown

  return (
    <li className={Styles.surveyItemWrap}>
      <div className={Styles.surveyContent}>
        <Icon iconName={iconName} className={Styles.iconWrap} />

        <time>
          <span className={Styles.day} data-testid="day">
            {survey.date.getDate().toString().padStart(2, '0')}
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
