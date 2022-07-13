const transformer = require('xml-js')

const XACML_NAMESPACE = 'urn:oasis:names:tc:xacml:3.0:core:schema:wd-17'

class XacmlDecisionRequest {
  constructor () {
    this._request = {
      declaration: { attributes: { version: '1.0', encoding: 'UTF-8' } },
      elements: [
        {
          type: 'element',
          name: 'Request',
          attributes: {
            xmlns: XACML_NAMESPACE,
            CombinedDecision: false,
            ReturnPolicyIdList: false
          },
          elements: []
        }
      ]
    }
  }

  addAttribute (categoryId, { id, type = 'http://www.w3.org/2001/XMLSchema#string', value, includeInResult = false }) {
    const category = this._getCategory(categoryId)
    category.elements.push({
      type: 'element',
      name: 'Attribute',
      attributes: { AttributeId: id, IncludeInResult: includeInResult },
      elements: [{
        type: 'element',
        name: 'AttributeValue',
        attributes: { DataType: type },
        elements: [{
          type: 'text',
          text: value
        }]
      }]
    })
  }

  /*
    Compact form is an object where each key is an XACML attribute category.  That attribute category is an Array of attributes in same form as
    `addAttribute()`.
    Example:
    {
      category1: [ { id: 'attribute1-id', value: 'attribute1-value' } ],
      category2: [ { id: 'attribute2-id', value: 'attribute2-value' } ]
    }
  */
  static fromCompactForm (compactDecisionRequest) {
    const request = new XacmlDecisionRequest()

    Object.keys(compactDecisionRequest).forEach(category => {
      const attributes = compactDecisionRequest[category]
      attributes.forEach(attribute => {
        request.addAttribute(category, attribute)
      })
    })

    return request
  }

  _getCategory (categoryId) {
    let category = this._request.elements[0].elements.find((c) =>
      c.attributes.Category === categoryId)

    if (!category) {
      category = this._createCategory(categoryId)
      this._request.elements[0].elements.push(category)
    }

    return category
  }

  _createCategory (categoryId) {
    return {
      type: 'element',
      name: 'Attributes',
      attributes: { Category: categoryId },
      elements: []
    }
  }

  toXacml () {
    const options = { compact: false, spaces: 2 }
    return transformer.js2xml(this._request, options)
  }
}

module.exports = XacmlDecisionRequest
