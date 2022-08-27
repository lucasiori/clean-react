export class EmailInUseError extends Error {
  constructor () {
    super('Esse email já esta em uso')
    this.name = 'EmailInUseError'
  }
}
