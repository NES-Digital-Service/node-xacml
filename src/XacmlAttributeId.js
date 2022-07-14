/**
 * Enumeration of standard XACML attribute ids.
 * @see [XACML 3.0, Identifiers]{@link http://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html#_Toc325047232}
 * @namespace
 * @enum {String}
 */
const XacmlAttributeId = {
  /** identifier for attribute holding unique id of the subject making decision request. */
  SUBJECT_ID: 'urn:oasis:names:tc:xacml:1.0:subject:subject-id',
  /** identifier for attribute holding action being requested */
  ACTION_ID: 'urn:oasis:names:tc:xacml:1.0:action:action-id',
  /** identifier for attribute holding target resource of the decision request */
  RESOURCE_ID: 'urn:oasis:names:tc:xacml:1.0:resource:resource-id'
}

module.exports = {
  ...XacmlAttributeId
}
