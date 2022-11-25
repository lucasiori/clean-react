import React, { useRef } from 'react'
import Styles from './input-styles.scss'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  state: any
  setState: any
}

const Input: React.FC<Props> = ({ state, setState, ...props }) => {
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
