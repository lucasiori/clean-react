import React from 'react'
import { fireEvent, render, RenderResult } from '@testing-library/react'
import { faker } from '@faker-js/faker'
import InputBase from './input'

const makeSut = (fieldName: string): RenderResult => {
  return render(
    <InputBase name={fieldName} state={{}} setState={jest.fn()} />
  )
}

describe('Input Component', () => {
  test('should begin with readOnly', () => {
    const fieldName = faker.database.column()
    const sut = makeSut(fieldName)
    const input = sut.getByTestId(fieldName) as HTMLInputElement

    expect(input.readOnly).toBe(true)
  })

  test('should remove readOnly on focus', () => {
    const fieldName = faker.database.column()
    const sut = makeSut(fieldName)
    const input = sut.getByTestId(fieldName) as HTMLInputElement

    fireEvent.focus(input)

    expect(input.readOnly).toBe(false)
  })

  test('should focus input on label click', () => {
    const fieldName = faker.database.column()
    const sut = makeSut(fieldName)
    const input = sut.getByTestId(fieldName)
    const label = sut.getByTestId(`${fieldName}-label`)

    fireEvent.click(label)

    expect(document.activeElement).toBe(input)
  })
})
