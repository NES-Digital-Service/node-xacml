/**
 * An <code>Error</code> representing a problem processing a XACML authorization decision.
 */
class XacmlError extends Error {
  /**
   * Creates a new XACML Error.
   *
   * @param message the description of the error.
   */
  constructor (message) {
    super(message)
    this.name = 'XacmlError'
  }
}

module.exports = XacmlError
