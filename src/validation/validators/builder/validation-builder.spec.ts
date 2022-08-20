import { faker } from '@faker-js/faker'
import {
  EmailValidation,
  MinLengthValidation,
  RequiredFieldValidation
} from '@/validation/validators'
import { ValidationBuilder as sut } from './validation-builder'

describe('ValidationBuilder', () => {
  test('should return RequiredFieldValidation', () => {
    const field = faker.database.column()
    const validations = sut.field(field).required().build()

    expect(validations).toEqual([new RequiredFieldValidation(field)])
  })

  test('should return EmailValidation', () => {
    const field = faker.database.column()
    const validations = sut.field(field).email().build()

    expect(validations).toEqual([new EmailValidation(field)])
  })

  test('should return MinLengthValidation', () => {
    const field = faker.database.column()
    const minLength = faker.datatype.number()
    const validations = sut.field(field).min(minLength).build()

    expect(validations).toEqual([new MinLengthValidation(field, minLength)])
  })

  test('should return a list of validations', () => {
    const field = faker.database.column()
    const minLength = faker.datatype.number()
    const validations = sut.field(field).required().email().min(minLength).build()

    expect(validations).toEqual([
      new RequiredFieldValidation(field),
      new EmailValidation(field),
      new MinLengthValidation(field, minLength)
    ])
  })
})
