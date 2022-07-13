class XacmlError extends Error {
  constructor (message) {
    super(message)
    this.name = 'XacmlError'
  }
}

module.exports = XacmlError
