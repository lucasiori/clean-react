import { Validation } from '@/presentation/protocols/validation'
import { FieldValidation } from '@/validation/protocols/field-validation'

export class ValidationComposite implements Validation {
  private constructor (private readonly validations: FieldValidation[]) {}

  static build (validations: FieldValidation[]): ValidationComposite {
    return new ValidationComposite(validations)
  }

  validate (fieldName: string, fieldValue: string): string {
    const validations = this.validations.filter((validator) => {
      return validator.field === fieldName
    })

    for (const validator of validations) {
      const error = validator.validate(fieldValue)
      if (error) return error.message
    }
  }
}
