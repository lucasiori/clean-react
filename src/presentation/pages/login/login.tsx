import React, { useContext, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { Authentication } from '@/domain/usecases'
import { ApiContext } from '@/presentation/contexts'
import { Validation } from '@/presentation/protocols/validation'
import { Footer, LoginHeader } from '@/presentation/components'
import { FormStatus, Input, loginState, SubmitButton } from './components'
import Styles from './login-styles.scss'

type Props = {
  validation: Validation
  authentication: Authentication
}

const Login: React.FC<Props> = ({
  validation,
  authentication
}) => {
  const history = useHistory()
  const { setCurrentAccount } = useContext(ApiContext)
  const [state, setState] = useRecoilState(loginState)

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()

    try {
      if (state.isLoading || state.isFormInvalid) return

      setState(oldState => ({ ...oldState, isLoading: true }))
      const account = await authentication.auth({
        email: state.email,
        password: state.password
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
    const formData = { email: state.email, password: state.password }

    setState(oldState => ({
      ...oldState,
      [`${field}Error`]: validation.validate(field, formData)
    }))

    setState(oldState => ({
      ...oldState,
      isFormInvalid: !!oldState.emailError || !!oldState.passwordError
    }))
  }

  useEffect(() => {
    validate('email')
  }, [state.email])

  useEffect(() => {
    validate('password')
  }, [state.password])

  return (
    <div className={Styles.loginWrap}>
      <LoginHeader />

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

      <Footer />
    </div>
  )
}

export default Login
