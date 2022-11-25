import React from 'react'
import Spinner from '@/presentation/components/spinner/spinner'
import Styles from './form-status.scss'

type Props = {
  state: any
}

const FormStatus: React.FC<Props> = ({ state }) => {
  const { isLoading, mainError } = state

  return (
    <div className={Styles.errorWrap} data-testid="error-wrap">
      {isLoading && <Spinner className={Styles.spinner} />}
      {!!mainError && (
        <span className={Styles.error} data-testid="main-error">
          {mainError}
        </span>
      )}
    </div>
  )
}

export default FormStatus
