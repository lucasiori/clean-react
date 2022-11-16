import React from 'react'
import Styles from './spinner-styles.scss'

type Props = React.HTMLAttributes<HTMLElement> & {
  isNegative?: boolean
}

const Spinner: React.FC<Props> = ({ isNegative, ...props }) => {
  const negativeClass = isNegative ? Styles.negative : ''

  return (
    <div
      {...props}
      className={[Styles.spinner, negativeClass, props.className].join(' ')}
      data-testid="spinner"
    >
      <div />
      <div />
      <div />
      <div />
    </div>
  )
}

export default Spinner
