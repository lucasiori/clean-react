import React, { useContext } from 'react'
import Context from '@/presentation/contexts/form/form-context'
import Spinner from '@/presentation/components/spinner/spinner'
import Styles from './form-status.scss'

const FormStatus: React.FC = () => {
  const { state } = useContext(Context)
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
