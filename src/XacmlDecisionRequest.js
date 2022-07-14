const transformer = require('xml-js')

const XACML_NAMESPACE = 'urn:oasis:names:tc:xacml:3.0:core:schema:wd-17'

/**
 * A XACML decision request.
 * @see [XACML 3.0, Request]{@link http://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html#_Toc325047147}
 */
class XacmlDecisionRequest {
  /**
   * Creates a new XACML decision request
   */
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

  /**
   * Adds the given attribute to this decision request.
   * @see [XACML 3.0, Attributes]{@link http://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html#_Toc325047149}
   *
   * @param {String} categoryId the attribute category this attribute should be added to.
   * To ensure compatability with PDP it is recommended to only use standard XACML categories defined in {@linkcode XacmlAttributeCategory}.
   * @param {Object} attribute
   * @param {String} attribute.id the id of attribute. Standard XACML attribute ids are defined in {@linkcode XacmlAttributeId}.
   * @param {String} [attribute.type] the type of the attribute. The default is `http://www.w3.org/2001/XMLSchema#string`.
   * @param {String} attribute.value the value of the attribute.
   * @param {Boolean} [includeInResult] should this attribute be returned in the result. The default is `false`.
   */
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

  /**
   * Returns a new XACML request from a "compact form" JSON object.
   *
   * @param {Object} compactFormRequest The compact form is a JSON object where each object key is an XACML attribute category.
   * Each object value is an Array, the elements of which are attributes in same the form as {@linkcode #addAttribute}.
   *
   * @example
   * let compactRequest = {
   *   category1: [ { id: 'attribute1-id', value: 'attribute1-value' } ],
   *   category2: [ { id: 'attribute2-id', value: 'attribute2-value' } ]
   * }
   * let request = XcamlDecisionRequest.fromCompactForm( compactRequest )
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

  /**
   * Returns the XML form of this request.
   * @returns {string} the decision request as XML
   */
  toXacml () {
    const options = { compact: false, spaces: 2 }
    return transformer.js2xml(this._request, options)
  }
}

module.exports = XacmlDecisionRequest
