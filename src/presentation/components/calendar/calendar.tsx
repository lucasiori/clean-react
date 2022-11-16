import React from 'react'
import Styles from './calendar-styles.scss'

type Props = {
  date: Date
  className?: string
}

const Calendar: React.FC<Props> = ({ date, className }) => {
  return (
    <time className={[Styles.calendarWrap, className].join(' ')}>
      <span className={Styles.day} data-testid="day">
        {date.getDate().toString().padStart(2, '0')}
      </span>

      <span className={Styles.month} data-testid="month">
        {date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}
      </span>

      <span className={Styles.year} data-testid="year">
        {date.getFullYear()}
      </span>
    </time>
  )
}

export default Calendar
