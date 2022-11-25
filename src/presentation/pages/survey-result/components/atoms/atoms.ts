import { atom } from 'recoil'
import { LoadSurveyResult } from '@/domain/usecases'

export const surveyResultState = atom({
  key: 'surveyResultState',
  default: {
    surveyResult: null as LoadSurveyResult.Model,
    isLoading: false,
    reload: false,
    error: ''
  }
})

export const onSurveyAnswerState = atom({
  key: 'onSurveyAnswerState',
  default: {
    onAnswer: null as (answer: string) => void
  }
})
