import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { faker } from '@faker-js/faker'
import Context from '@/presentation/contexts/form/form-context'
import Input from './input'

const makeSut = (): HTMLInputElement => {
  const fieldName = faker.database.column()

  const { getByTestId } = render(
    <Context.Provider value={{ state: {} }}>
      <Input name={fieldName} />
    </Context.Provider>
  )

  return getByTestId(fieldName) as HTMLInputElement
}

describe('Input Component', () => {
  test('should begin with readOnly', () => {
    const sut = makeSut()

    expect(sut.readOnly).toBe(true)
  })

  test('should begin remove readOnly on focus', () => {
    const sut = makeSut()

    fireEvent.focus(sut)

    expect(sut.readOnly).toBe(false)
  })
})
