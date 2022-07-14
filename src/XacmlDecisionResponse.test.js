const XacmlDecisionResponse = require('./XacmlDecisionResponse')
const fs = require('fs')
const path = require('path')

describe('XacmlDecisionResponse', () => {
  it('should allow when decision is Permit', () => {
    // Given
    const decisionXml = fs.readFileSync(path.join(__dirname, './__testfiles__/decision-permit.xml'))

    // When
    const decision = new XacmlDecisionResponse(decisionXml)

    // Then
    expect(decision.isAuthorized()).toEqual(true)
    expect(decision.getMessage()).toEqual('urn:oasis:names:tc:xacml:1.0:status:ok')
  })

  it('should not allow when decision is Deny', () => {
    // Given
    const decisionXml = fs.readFileSync(path.join(__dirname, './__testfiles__/decision-deny.xml'))

    // When
    const decision = new XacmlDecisionResponse(decisionXml)

    // Then
    expect(decision.isAuthorized()).toEqual(false)
    expect(decision.getMessage()).toEqual('urn:oasis:names:tc:xacml:1.0:status:ok')
  })

  it('should not allow when decision is Indeterminate', () => {
    // Given
    const decisionXml = fs.readFileSync(path.join(__dirname, './__testfiles__/decision-indeterminate.xml'))

    // When
    const decision = new XacmlDecisionResponse(decisionXml)

    // Then
    expect(decision.isAuthorized()).toEqual(false)
    expect(decision.getMessage()).toEqual('urn:oasis:names:tc:xacml:1.0:status:syntax-error')
  })

  it('should not allow when decision is NotApplicable', () => {
    // Given
    const decisionXml = fs.readFileSync(path.join(__dirname, './__testfiles__/decision-notapplicable.xml'))

    // When
    const decision = new XacmlDecisionResponse(decisionXml)

    // Then
    expect(decision.isAuthorized()).toEqual(false)
    expect(decision.getMessage()).toEqual('urn:oasis:names:tc:xacml:1.0:status:ok')
  })

  it('should throw an XacmlError when response not valid XML', () => {
    // Given
    const decisionXml = 'foo'
    let thrown

    // When
    try {
      /* eslint-disable no-new */
      new XacmlDecisionResponse(decisionXml)
    } catch (error) {
      thrown = error
    }

    // Then
    expect(thrown.name).toEqual('XacmlError')
    expect(thrown.message).toMatch(/Invalid XACML response. Cause: Error: Text data outside of root node.*/)
  })

  it('should throw an XacmlError when response not valid decision', () => {
    // Given
    const decisionXml = '<foo></foo>'
    let thrown

    // When
    try {
      /* eslint-disable no-new */
      new XacmlDecisionResponse(decisionXml)
    } catch (error) {
      thrown = error
    }

    // Then
    expect(thrown.name).toEqual('XacmlError')
    expect(thrown.message).toEqual('Invalid XACML response. Cause: Error: Invalid decision: undefined')
  })
})
