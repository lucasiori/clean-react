import React, { useContext, useRef } from 'react'
import Context from '@/presentation/contexts/form/form-context'
import Styles from './input-styles.scss'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props) => {
  const { state, setState } = useContext(Context)
  const inputRef = useRef<HTMLInputElement>(null)

  const error = state[`${props.name}Error`]

  return (
    <div className={Styles.inputWrap}>
      <input
        {...props}
        ref={inputRef}
        placeholder=" "
        readOnly
        onFocus={(e) => { e.target.readOnly = false }}
        onChange={(e) => {
          setState({ ...state, [e.target.name]: e.target.value })
        }}
        data-testid={props.name}
      />

      <label onClick={() => { inputRef.current.focus() }}>
        {props.placeholder}
      </label>

      <span
        title={error || 'Tudo certo'}
        className={Styles.status}
        data-testid={`${props.name}-status`}
      >
        {error ? '🔴' : '🟢'}
      </span>
    </div>
  )
}

export default Input
