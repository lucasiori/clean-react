import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { currentAccountState, PrivateRoute } from '@/presentation/components'
import {
  makeLogin,
  makeSignUp,
  makeSurveyList,
  makeSurveyResult
} from '@/main/factories/pages'
import {
  getCurrentAccountAdapter,
  setCurrentAccountAdapter
} from '@/main/adapters/current-account-adapter'

const Router: React.FC = () => {
  const state = {
    setCurrentAccount: setCurrentAccountAdapter,
    getCurrentAccount: getCurrentAccountAdapter
  }

  return (
    <RecoilRoot
      initializeState={({ set }) => set(currentAccountState, state)}
    >
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={makeLogin} />
          <Route path="/signup" component={makeSignUp} />
          <Route path="/signup" component={makeSignUp} />
          <PrivateRoute path="/" exact component={makeSurveyList} />
          <PrivateRoute path="/surveys/:id" component={makeSurveyResult} />
        </Switch>
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default Router
