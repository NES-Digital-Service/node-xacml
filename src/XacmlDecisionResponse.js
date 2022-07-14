const XacmlDecision = require('./XacmlDecision')
const XacmlError = require('./XacmlError')
const transformer = require('xml-js')

function stripNamespace (name) {
  return name.replace(/.*:/, '')
}

/**
 * A XACML decision response.
 * @see [XACML 3.0, Response]{@link http://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html#_Toc325047152}
 */
class XacmlDecisionResponse {
  /**
   * Creates a new XACML decision response.
   * @param decisionXacml a decision response as XML.
   * @throws {XacmlError} if XML is invalid or does not contain a decision.
   */
  constructor (decisionXacml) {
    try {
      this._decision = transformer.xml2js(decisionXacml, {
        compact: true,
        elementNameFn: stripNamespace
      })
      this._validateDecision()
    } catch (error) {
      throw new XacmlError('Invalid XACML response. Cause: ' + error)
    }
  }

  /**
   * @returns {boolean} true if the result is {@linkcode XacmlDecision#PERMIT}, otherwise false.
   */
  isAuthorized () {
    return this._decision.Response.Result.Decision._text === XacmlDecision.PERMIT
  }

  /**
   * @returns {String} the status code text of the response.
   */
  getMessage () {
    return this._decision.Response.Result?.Status?.StatusCode?._attributes?.Value
  }

  _validateDecision () {
    const decisionValue = this?._decision?.Response?.Result?.Decision?._text
    if (!Object.values(XacmlDecision).includes(decisionValue)) {
      throw new Error(`Invalid decision: ${decisionValue}`)
    }
  }
}

module.exports = XacmlDecisionResponse
