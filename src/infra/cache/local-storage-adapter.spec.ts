import 'jest-localstorage-mock'
import { faker } from '@faker-js/faker'
import { AccountModel } from '@/domain/models'
import { LocalStorageAdapter } from './local-storage-adapter'

const makeSut = (): LocalStorageAdapter => new LocalStorageAdapter()

describe('LocalStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('should call localStorage with correct values', () => {
    const sut = makeSut()
    const key = faker.database.column()
    const value: AccountModel = {
      accessToken: faker.datatype.uuid(),
      name: faker.name.fullName()
    }

    sut.set(key, value)

    expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value))
  })
})
