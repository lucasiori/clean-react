import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Authentication, SaveAccessToken } from '@/domain/usecases'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'
import {
  Footer,
  FormStatus,
  Input,
  LoginHeader,
  SubmitButton
} from '@/presentation/components'
import Styles from './login-styles.scss'

type Props = {
  validation: Validation
  authentication: Authentication
  saveAccessToken: SaveAccessToken
}

const Login: React.FC<Props> = ({
  validation,
  authentication,
  saveAccessToken
}) => {
  const history = useHistory()

  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    email: '',
    password: '',
    mainError: '',
    emailError: '',
    passwordError: ''
  })

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()

    try {
      if (state.isLoading || state.isFormInvalid) return

      setState({ ...state, isLoading: true })
      const account = await authentication.auth({
        email: state.email,
        password: state.password
      })

      await saveAccessToken.save(account.accessToken)
      history.replace('/')
    } catch (error) {
      setState({ ...state, isLoading: false, mainError: error.message })
    }
  }

  useEffect(() => {
    const formData = {
      email: state.email,
      password: state.password
    }

    const emailError = validation.validate('email', formData)
    const passwordError = validation.validate('password', formData)

    setState({
      ...state,
      isFormInvalid: !!emailError || !!passwordError,
      emailError,
      passwordError
    })
  }, [state.email, state.password])

  return (
    <div className={Styles.loginWrap}>
      <LoginHeader />

      <Context.Provider value={{ state, setState }}>
        <form className={Styles.form} onSubmit={handleSubmit} data-testid="form">
          <h2>Login</h2>

          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input type="password" name="password" placeholder="Digite sua senha" />

          <SubmitButton text="Entrar" />

          <Link to="/signup" className={Styles.link} data-testid="signup-link">
            Criar conta
          </Link>

          <FormStatus />
        </form>
      </Context.Provider>

      <Footer />
    </div>
  )
}

export default Login
