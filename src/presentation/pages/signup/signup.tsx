import React, { useState } from 'react'
import Context from '@/presentation/contexts/form/form-context'
import { Footer, FormStatus, Input, LoginHeader } from '@/presentation/components'
import Styles from './signup-styles.scss'

const SignUp: React.FC = () => {
  const [state, setState] = useState({
    isLoading: false,
    mainError: '',
    nameError: 'Campo obrigatório',
    emailError: 'Campo obrigatório',
    passwordError: 'Campo obrigatório',
    passwordConfirmationError: 'Campo obrigatório'
  })

  return (
    <div className={Styles.signup}>
      <LoginHeader />

      <Context.Provider value={{ state }}>
        <form className={Styles.form}>
          <h2>Criar conta</h2>

          <Input type="text" name="name" placeholder="Digite seu nome" />
          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input type="password" name="password" placeholder="Digite sua senha" />
          <Input type="password" name="passwordConfirmation" placeholder="Repita sua senha" />

          <button type="submit" className={Styles.submit} disabled data-testid="submit">
            Entrar
          </button>

          <span className={Styles.link}>
            Voltar para login
          </span>

          <FormStatus />
        </form>
      </Context.Provider>

      <Footer />
    </div>
  )
}

export default SignUp
