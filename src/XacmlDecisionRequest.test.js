const XacmlDecisionRequest = require('./XacmlDecisionRequest')
const fs = require('fs')
const path = require('path')

describe('XacmlDecisionRequest', () => {
  it('should add subject attributes', () => {
    // When
    const testee = new XacmlDecisionRequest()
    testee.addAttribute('foo', { id: 'one', value: 1 })
    testee.addAttribute('foo', { id: 'two', value: 2 })
    testee.addAttribute('bar', { id: 'three', type: 'baz', value: 'bam', includeInResult: true })
    const requestXml = testee.toXacml()

    // Then
    const expectedXml = fs.readFileSync(path.join(__dirname, './__testfiles__/request.xml')).toString()
    expect(requestXml).toEqual(expectedXml)
  })

  it('should create from compact form', () => {
    // Given
    const compactForm = {
      foo: [
        { id: 'one', value: 1 },
        { id: 'two', value: 2 }
      ],
      bar: [
        { id: 'three', type: 'baz', value: 'bam', includeInResult: true }
      ]
    }

    // When
    const testee = XacmlDecisionRequest.fromCompactForm(compactForm)
    const requestXml = testee.toXacml()

    // Then
    const expectedXml = fs.readFileSync(path.join(__dirname, './__testfiles__/request.xml')).toString()
    expect(requestXml).toEqual(expectedXml)
  })
})
