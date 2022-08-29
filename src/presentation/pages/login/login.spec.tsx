import React from 'react'
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  waitFor
} from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { faker } from '@faker-js/faker'
import { InvalidCredentialsError } from '@/domain/errors'
import { AuthenticationSpy, Helper, SaveAccessTokenMock, ValidationStub } from '@/presentation/test'
import { Login } from '@/presentation/pages'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
  saveAccessTokenMock: SaveAccessTokenMock
}

type SutParams = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/login'] })

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError
  const saveAccessTokenMock = new SaveAccessTokenMock()
  const authenticationSpy = new AuthenticationSpy()

  const sut = render(
    <Router history={history}>
      <Login
        validation={validationStub}
        authentication={authenticationSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>
  )

  return { sut, authenticationSpy, saveAccessTokenMock }
}

const simulateValidSubmit = (
  sut: RenderResult,
  email = faker.internet.email(),
  password = faker.internet.password()
): void => {
  Helper.populateField(sut, 'email', email)
  Helper.populateField(sut, 'password', password)

  const submitButton = sut.getByTestId('submit')
  fireEvent.click(submitButton)
}

describe('Login Component', () => {
  afterEach(() => {
    cleanup()
  })

  test('should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })

    Helper.testStatusForField(sut, 'email', validationError)
    Helper.testStatusForField(sut, 'password', validationError)
    Helper.testChildCount(sut, 'error-wrap', 0)
    Helper.testButtonIsDisabled(sut, 'submit', true)
  })

  test('should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })

    Helper.populateField(sut, 'email')

    Helper.testStatusForField(sut, 'email', validationError)
  })

  test('should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })

    Helper.populateField(sut, 'password')

    Helper.testStatusForField(sut, 'password', validationError)
  })

  test('should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut()

    Helper.populateField(sut, 'email')

    Helper.testStatusForField(sut, 'email')
  })

  test('should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut()

    Helper.populateField(sut, 'password')

    Helper.testStatusForField(sut, 'password')
  })

  test('should enable submit button if form is valid', () => {
    const { sut } = makeSut()

    Helper.populateField(sut, 'email')
    Helper.populateField(sut, 'password')

    Helper.testButtonIsDisabled(sut, 'submit', false)
  })

  test('should show spinner on submit', () => {
    const { sut } = makeSut()

    simulateValidSubmit(sut)

    Helper.testElementExists(sut, 'spinner')
  })

  test('should call Authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()

    simulateValidSubmit(sut, email, password)

    expect(authenticationSpy.params).toEqual({ email, password })
  })

  test('should call Authentication only once', () => {
    const { sut, authenticationSpy } = makeSut()

    simulateValidSubmit(sut)
    simulateValidSubmit(sut)

    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('should not call Authentication if form is invalid', () => {
    const validationError = faker.random.words()
    const { sut, authenticationSpy } = makeSut({ validationError })

    Helper.populateField(sut, 'email')
    fireEvent.submit(sut.getByTestId('form'))

    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error)

    simulateValidSubmit(sut)
    await waitFor(() => sut.getByTestId('main-error'))

    Helper.testElementText(sut, 'main-error', error.message)
    Helper.testChildCount(sut, 'error-wrap', 1)
  })

  test('should call SaveAccessToken on success', async () => {
    const { sut, authenticationSpy, saveAccessTokenMock } = makeSut()

    simulateValidSubmit(sut)

    await waitFor(() => {
      expect(saveAccessTokenMock.accessToken).toBe(
        authenticationSpy.account.accessToken
      )
      expect(history.length).toBe(1)
      expect(history.location.pathname).toBe('/')
    })
  })

  test('should present error if SaveAccessToken fails', async () => {
    const { sut, saveAccessTokenMock } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(saveAccessTokenMock, 'save').mockRejectedValueOnce(error)

    simulateValidSubmit(sut)
    await waitFor(() => sut.getByTestId('main-error'))

    Helper.testElementText(sut, 'main-error', error.message)
    Helper.testChildCount(sut, 'error-wrap', 1)
  })

  test('should go to signup page', () => {
    const { sut } = makeSut()
    const signup = sut.getByTestId('signup')

    fireEvent.click(signup)

    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
