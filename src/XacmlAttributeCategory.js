/**
 * Enumeration of recommended XACML attribute categories.
 * @see [XACML 3.0, Attribute Categories]{@link http://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html#_Toc325047260}
 * @namespace
 * @enum {String}
 */
const XacmlAttributeCategory = {
  /** attributes of the subject making the decision request. */
  SUBJECT: 'urn:oasis:names:tc:xacml:1.0:subject-category:access-subject',
  /** attributes of the action being requested. */
  ACTION: 'urn:oasis:names:tc:xacml:3.0:attribute-category:action',
  /** attributes of the target resource of the decision request */
  RESOURCE: 'urn:oasis:names:tc:xacml:3.0:attribute-category:resource',
  /** attributes of the environment within which the decision request is to be evaluated. */
  ENVIRONMENT: 'urn:oasis:names:tc:xacml:3.0:attribute-category:environment'
}

module.exports = {
  ...XacmlAttributeCategory
}
