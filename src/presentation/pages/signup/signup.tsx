import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { AddAccount } from '@/domain/usecases'
import { currentAccountState, Footer, LoginHeader } from '@/presentation/components'
import { Validation } from '@/presentation/protocols/validation'
import { FormStatus, Input, signupState, SubmitButton } from './components'
import Styles from './signup-styles.scss'

type Props = {
  validation: Validation
  addAccount: AddAccount
}

const SignUp: React.FC<Props> = ({
  validation,
  addAccount
}) => {
  const history = useHistory()
  const resetSignupState = useResetRecoilState(signupState)
  const { setCurrentAccount } = useRecoilValue(currentAccountState)
  const [state, setState] = useRecoilState(signupState)

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()

    try {
      if (state.isLoading || state.isFormInvalid) return

      setState(oldState => ({ ...oldState, isLoading: true }))
      const account = await addAccount.add({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation
      })

      setCurrentAccount(account)
      history.replace('/')
    } catch (error) {
      setState(oldState => ({
        ...oldState,
        isLoading: false,
        mainError: error.message
      }))
    }
  }

  const validate = (field: string): void => {
    const formData = {
      name: state.name,
      email: state.email,
      password: state.password,
      passwordConfirmation: state.passwordConfirmation
    }

    setState(oldState => ({
      ...oldState,
      [`${field}Error`]: validation.validate(field, formData)
    }))

    setState(oldState => ({
      ...oldState,
      isFormInvalid: !!oldState.nameError ||
        !!oldState.emailError ||
        !!oldState.passwordError ||
        !!oldState.passwordConfirmationError
    }))
  }

  useEffect(() => validate('name'), [state.name])
  useEffect(() => validate('email'), [state.email])
  useEffect(() => validate('password'), [state.password])
  useEffect(() => validate('passwordConfirmation'), [state.passwordConfirmation])
  useEffect(resetSignupState, [])

  return (
    <div className={Styles.signupWrap}>
      <LoginHeader />

      <form className={Styles.form} onSubmit={handleSubmit} data-testid="form">
        <h2>Criar conta</h2>

        <Input type="text" name="name" placeholder="Digite seu nome" />
        <Input type="email" name="email" placeholder="Digite seu e-mail" />
        <Input type="password" name="password" placeholder="Digite sua senha" />
        <Input type="password" name="passwordConfirmation" placeholder="Repita sua senha" />

        <SubmitButton text="Cadastrar" />

        <Link replace to="/login" className={Styles.link} data-testid="login-link">
          Voltar para login
        </Link>

        <FormStatus />
      </form>

      <Footer />
    </div>
  )
}

export default SignUp
