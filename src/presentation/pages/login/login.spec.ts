import { fireEvent, screen, waitFor } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { faker } from '@faker-js/faker'
import { Authentication } from '@/domain/usecases'
import { InvalidCredentialsError } from '@/domain/errors'
import { AuthenticationSpy } from '@/domain/test'
import { Helper, renderWithHistory, ValidationStub } from '@/presentation/test'
import { Login } from '@/presentation/pages'

type SutTypes = {
  authenticationSpy: AuthenticationSpy
  setCurrentAccountMock: (account: Authentication.Model) => void
}

type SutParams = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/login'] })

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError
  const authenticationSpy = new AuthenticationSpy()

  const { setCurrentAccountMock } = renderWithHistory({
    history,
    Page: () => {
      return Login({
        validation: validationStub,
        authentication: authenticationSpy
      })
    }
  })

  return { authenticationSpy, setCurrentAccountMock }
}

const simulateValidSubmit = async (
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  Helper.populateField('email', email)
  Helper.populateField('password', password)

  const form = screen.getByTestId('form')
  fireEvent.submit(form)

  await waitFor(() => form)
}

describe('Login Component', () => {
  test('should start with initial state', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })

    Helper.testStatusForField('email', validationError)
    Helper.testStatusForField('password', validationError)
    expect(screen.getByTestId('error-wrap').children).toHaveLength(0)
    expect(screen.getByTestId('submit')).toBeDisabled()
  })

  test('should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })

    Helper.populateField('email')

    Helper.testStatusForField('email', validationError)
  })

  test('should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })

    Helper.populateField('password')

    Helper.testStatusForField('password', validationError)
  })

  test('should show valid email state if Validation succeeds', () => {
    makeSut()

    Helper.populateField('email')

    Helper.testStatusForField('email')
  })

  test('should show valid password state if Validation succeeds', () => {
    makeSut()

    Helper.populateField('password')

    Helper.testStatusForField('password')
  })

  test('should enable submit button if form is valid', () => {
    makeSut()

    Helper.populateField('email')
    Helper.populateField('password')

    expect(screen.getByTestId('submit')).toBeEnabled()
  })

  test('should show spinner on submit', async () => {
    makeSut()

    await simulateValidSubmit()

    expect(screen.queryByTestId('spinner')).toBeInTheDocument()
  })

  test('should call Authentication with correct values', async () => {
    const { authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()

    await simulateValidSubmit(email, password)

    expect(authenticationSpy.params).toEqual({ email, password })
  })

  test('should call Authentication only once', async () => {
    const { authenticationSpy } = makeSut()

    await simulateValidSubmit()
    await simulateValidSubmit()

    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('should not call Authentication if form is invalid', () => {
    const validationError = faker.random.words()
    const { authenticationSpy } = makeSut({ validationError })

    Helper.populateField('email')
    fireEvent.submit(screen.getByTestId('form'))

    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('should present error if Authentication fails', async () => {
    const { authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error)

    await simulateValidSubmit()
    await waitFor(() => screen.getByTestId('main-error'))

    expect(screen.getByTestId('main-error')).toHaveTextContent(error.message)
    expect(screen.getByTestId('error-wrap').children).toHaveLength(1)
  })

  test('should call UpdateCurrentAccount on success', async () => {
    const { authenticationSpy, setCurrentAccountMock } = makeSut()

    await simulateValidSubmit()

    expect(setCurrentAccountMock).toHaveBeenCalledWith(
      authenticationSpy.account
    )
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('should go to signup page', () => {
    makeSut()
    const signupLink = screen.getByTestId('signup-link')

    fireEvent.click(signupLink)

    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
