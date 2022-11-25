import React from 'react'

type Props = {
  text: string
  state: any
}

const SubmitButton: React.FC<Props> = ({ text, state }) => {
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
