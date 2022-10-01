import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { makeLogin } from '@/main/factories/pages/login/login-factory'
import { makeSignUp } from '@/main/factories/pages/signup/signup-factory'
import { SurveyList } from '@/presentation/pages'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={makeLogin} />
        <Route path="/signup" component={makeSignUp} />
        <Route path="/" component={SurveyList} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router
