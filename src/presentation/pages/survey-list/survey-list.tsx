import React, { useEffect, useState } from 'react'
import { LoadSurveyList } from '@/domain/usecases'
import { useErrorHandler } from '@/presentation/hooks'
import { Error, Footer, Header } from '@/presentation/components'
import { SurveyContext, SurveyListItem } from '@/presentation/pages/survey-list/components'
import Styles from './survey-list-styles.scss'

type Props = {
  loadSurveyList: LoadSurveyList
}

const SurveyList: React.FC<Props> = ({ loadSurveyList }) => {
  const handleError = useErrorHandler((error: Error) => {
    setState(oldState => ({ ...oldState, error: error.message }))
  })

  const [state, setState] = useState({
    surveys: [] as LoadSurveyList.Model[],
    error: '',
    reload: false
  })

  const reload = (): void => {
    setState(oldState => ({ surveys: [], error: '', reload: oldState.reload }))
  }

  useEffect(() => {
    loadSurveyList.loadAll()
      .then((surveys) => setState(oldState => ({ ...oldState, surveys })))
      .catch(handleError)
  }, [state.reload])

  return (
    <div className={Styles.surveyListWrap}>
      <Header />

      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>

        <SurveyContext.Provider value={{ state, setState }}>
          {
            state.error
              ? <Error error={state.error} reload={reload} />
              : <SurveyListItem />
          }
        </SurveyContext.Provider>
      </div>

      <Footer />
    </div>
  )
}

export default SurveyList
