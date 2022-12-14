import { createMemoryHistory, MemoryHistory } from 'history'
import { fireEvent, screen } from '@testing-library/react'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'
import { Header } from '@/presentation/components'
import { renderWithHistory } from '@/presentation/test'

type SutTypes = {
  history: MemoryHistory
  setCurrentAccountMock: (account: AccountModel) => void
}

const makeSut = (account = mockAccountModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })

  const { setCurrentAccountMock } = renderWithHistory({
    history,
    account,
    Page: Header
  })

  return { history, setCurrentAccountMock }
}

describe('Header Component', () => {
  test('should call setCurrentAccount with undefined', () => {
    const { history, setCurrentAccountMock } = makeSut()

    fireEvent.click(screen.getByTestId('logout'))

    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })

  test('should render username correctly', () => {
    const account = mockAccountModel()
    makeSut(account)

    expect(screen.getByTestId('username')).toHaveTextContent(account.name)
  })
})
