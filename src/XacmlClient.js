const XacmlDecisionResponse = require('./XacmlDecisionResponse')
const XacmlError = require('./XacmlError')

class XacmlClient {
  constructor ({ pdpUrl, fetch = require('node-fetch') }) {
    this._pdpUrl = pdpUrl
    this._fetch = fetch
  }

  async getDecision (request) {
    const requestXacml = request.toXacml()
    const responseXacml = await this._getDecisionFromPdp(requestXacml)
    const decision = new XacmlDecisionResponse(responseXacml)
    return decision
  }

  async _getDecisionFromPdp (requestXacml) {
    let response
    try {
      response = await this._fetch(this._pdpUrl, {
        method: 'post',
        body: requestXacml,
        headers: {
          Accept: 'application/xml',
          'Content-Type': 'application/xml;charset=UTF-8'
        }
      })
    } catch (error) {
      throw new XacmlError(`Call to authorization service failed due to: ${error.message}`)
    }

    if (response.ok) {
      return response.text()
    } else {
      throw new XacmlError(`Error response from PDP: ${response.status} ${response.statusText}`)
    }
  }
}

module.exports = XacmlClient
