import React from 'react'
import { useRecoilState } from 'recoil'
import { InputBase } from '@/presentation/components'
import { signupState } from './atoms'

type Props = {
  type: string
  name: string
  placeholder: string
}

const Input: React.FC<Props> = ({
  type,
  name,
  placeholder
}) => {
  const [state, setState] = useRecoilState(signupState)

  return (
    <InputBase
      type={type}
      name={name}
      placeholder={placeholder}
      state={state}
      setState={setState}
    />
  )
}

export default Input
