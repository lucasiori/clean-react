import 'jest-localstorage-mock'
import { faker } from '@faker-js/faker'
import { LocalStorageAdapter } from './local-storage-adapter'

const makeSut = (): LocalStorageAdapter => new LocalStorageAdapter()

describe('LocalStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('should call localStorage.setItem with correct values', () => {
    const sut = makeSut()
    const key = faker.database.column()
    const value = {
      accessToken: faker.datatype.uuid(),
      name: faker.name.fullName()
    }

    sut.set(key, value)

    expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value))
  })

  test('should call localStorage.getItem with correct value', () => {
    const sut = makeSut()
    const key = faker.database.column()
    const value = {
      accessToken: faker.datatype.uuid(),
      name: faker.name.fullName()
    }
    const getItemSpy = jest.spyOn(localStorage, 'getItem')
      .mockReturnValueOnce(JSON.stringify(value))

    const obj = sut.get(key)

    expect(getItemSpy).toHaveBeenCalledWith(key)
    expect(obj).toEqual(value)
  })
})
