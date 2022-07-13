const XacmlDecision = require('./XacmlDecision')
const XacmlError = require('./XacmlError')
const transformer = require('xml-js')

function stripNamespace (name) {
  return name.replace(/.*:/, '')
}

class XacmlDecisionResponse {
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

  isAuthorized () {
    return this._decision.Response.Result.Decision._text === XacmlDecision.PERMIT
  }

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
