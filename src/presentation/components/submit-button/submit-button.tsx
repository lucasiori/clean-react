import React, { useContext } from 'react'
import Context from '@/presentation/contexts/form/form-context'

type Props = {
  text: string
}

const SubmitButton: React.FC<Props> = ({ text }) => {
  const { state } = useContext(Context)

  return (
    <button
      type="submit"
      disabled={state.isFormInvalid}
      data-testid="submit"
    >
      {text}
    </button>
  )
}

export default SubmitButton
