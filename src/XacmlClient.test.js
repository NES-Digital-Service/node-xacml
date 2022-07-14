const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const XacmlClient = require('./XacmlClient')
const XacmlError = require('./XacmlError')

jest.mock('node-fetch')

describe('XacmlClient', () => {
  let testee
  const requestXacml = '<mockXACML/>'
  const mockRequest = {
    toXacml: function () { return requestXacml }
  }

  const decisionXml = fs.readFileSync(path.join(__dirname, './__testfiles__/decision-permit.xml'))

  beforeEach(() => {
    testee = new XacmlClient({ pdpUrl: 'http://www.example.com/pdp' })
  })

  it('should return decision when server returns valid response', async () => {
    // Given
    fetch.mockResolvedValue({
      status: 200,
      ok: true,
      text: () => decisionXml
    })

    // When
    const decision = await testee.getDecision(mockRequest)

    // Then
    expect(decision.isAuthorized()).toEqual(true)
    expect(fetch).toHaveBeenCalledWith(
      'http://www.example.com/pdp',
      { method: 'post', body: requestXacml, headers: { Accept: 'application/xml', 'Content-Type': 'application/xml;charset=UTF-8' } }
    )
  })

  it('should throw error when server returns error response', async () => {
    // Given
    fetch.mockResolvedValue({
      status: 404,
      ok: false,
      statusText: 'Not Found'
    })

    // Then
    await expect(testee.getDecision(mockRequest)).rejects
      .toThrow(new XacmlError('Error response from PDP: 404 Not Found'))
    expect(fetch).toHaveBeenCalledWith(
      'http://www.example.com/pdp',
      { method: 'post', body: requestXacml, headers: { Accept: 'application/xml', 'Content-Type': 'application/xml;charset=UTF-8' } }
    )
  })

  it('should throw error when fetch error', async () => {
    // Given
    fetch.mockRejectedValue(new Error('Fatal error'))

    // Then
    await expect(testee.getDecision(mockRequest)).rejects
      .toThrow(new XacmlError('Call to authorization service failed due to: Fatal error'))
    expect(fetch).toHaveBeenCalledWith(
      'http://www.example.com/pdp',
      { method: 'post', body: requestXacml, headers: { Accept: 'application/xml', 'Content-Type': 'application/xml;charset=UTF-8' } }
    )
  })
})
