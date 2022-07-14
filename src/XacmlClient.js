const XacmlDecisionResponse = require('./XacmlDecisionResponse')
const XacmlError = require('./XacmlError')

/**
 * A client for retrieving an authorization decision from as XACML Policy Decision Point (PDP).
 */
class XacmlClient {
  /**
   * Creates a new client.
   *
   * @param {Object} config
   * @param {String} config.pdpUrl the URL of the XACML PDP.
   * @param {Function} [config.fetch]  the implementation of the [Fetch API]{@link https://developer.mozilla.org/en-US/docs/Web/API/fetch} to use.
   * By default [node-fetch]{@link https://www.npmjs.com/package/node-fetch} is used.
   */
  constructor ({ pdpUrl, fetch = require('node-fetch') }) {
    this._pdpUrl = pdpUrl
    this._fetch = fetch
  }

  /**
   * Makes a decision request to the PDP and returns the response.
   *
   * @param {XacmlDecisionRequest} request the decision request.
   * @returns {Promise<XacmlDecisionResponse>} the PDP response.
   */
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
