import { Validation } from '@/presentation/protocols/validation'
import { FieldValidation } from '@/validation/protocols/field-validation'

export class ValidationComposite implements Validation {
  private constructor (private readonly validations: FieldValidation[]) {}

  static build (validations: FieldValidation[]): ValidationComposite {
    return new ValidationComposite(validations)
  }

  validate (fieldName: string, input: object): string {
    const validations = this.validations.filter((validator) => {
      return validator.field === fieldName
    })

    for (const validator of validations) {
      const error = validator.validate(input)
      if (error) return error.message
    }
  }
}
