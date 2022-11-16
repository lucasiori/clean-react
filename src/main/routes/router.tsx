import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ApiContext } from '@/presentation/contexts'
import { PrivateRoute } from '@/presentation/components'
import { SurveyResult } from '@/presentation/pages'
import { makeLogin, makeSignUp, makeSurveyList } from '@/main/factories/pages'
import {
  getCurrentAccountAdapter,
  setCurrentAccountAdapter
} from '@/main/adapters/current-account-adapter'

const Router: React.FC = () => {
  return (
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountAdapter,
        getCurrentAccount: getCurrentAccountAdapter
      }}
    >
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={makeLogin} />
          <Route path="/signup" component={makeSignUp} />
          <Route path="/signup" component={makeSignUp} />
          <PrivateRoute path="/surveys" component={SurveyResult} />
          <PrivateRoute path="/" component={makeSurveyList} />
        </Switch>
      </BrowserRouter>
    </ApiContext.Provider>
  )
}

export default Router
