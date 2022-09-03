import React, { useContext, useRef } from 'react'
import Context from '@/presentation/contexts/form/form-context'
import Styles from './input-styles.scss'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props) => {
  const { state, setState } = useContext(Context)
  const inputRef = useRef<HTMLInputElement>(null)

  const error = state[`${props.name}Error`]

  return (
    <div
      className={Styles.inputWrap}
      data-status={error ? 'invalid' : 'valid'}
      data-testid={`${props.name}-wrap`}
    >
      <input
        {...props}
        ref={inputRef}
        title={error}
        placeholder=" "
        readOnly
        onFocus={(e) => { e.target.readOnly = false }}
        onChange={(e) => {
          setState({ ...state, [e.target.name]: e.target.value })
        }}
        data-testid={props.name}
      />

      <label
        title={error}
        onClick={() => { inputRef.current.focus() }}
        data-testid={`${props.name}-label`}
      >
        {props.placeholder}
      </label>
    </div>
  )
}

export default Input
