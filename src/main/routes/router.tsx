import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ApiContext } from '@/presentation/contexts'
import { SurveyList } from '@/presentation/pages'
import { makeLogin } from '@/main/factories/pages/login/login-factory'
import { makeSignUp } from '@/main/factories/pages/signup/signup-factory'
import { setCurrentAccountAdapter } from '@/main/adapters/current-account-adapter'

const Router: React.FC = () => {
  return (
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountAdapter
      }}
    >
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={makeLogin} />
          <Route path="/signup" component={makeSignUp} />
          <Route path="/" component={SurveyList} />
        </Switch>
      </BrowserRouter>
    </ApiContext.Provider>
  )
}

export default Router
