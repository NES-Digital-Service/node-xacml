/**
 * Enumeration of possible authorization decisions.
 * @see [XACML 3.0, Decision]{@link http://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html#_Toc325047158}
 * @namespace
 * @enum {String}
 */
const XacmlDecision = {
  /** the requested access is permitted. */
  PERMIT: 'Permit',
  /** the requested access is denied. */
  DENY: 'Deny',
  /** the PDP is unable to evaluate the requested access. */
  NOT_APPLICABLE: 'NotApplicable',
  /** the PDP does not have any policy that applies to this decision request. */
  INDETERMINATE: 'Indeterminate'
}

module.exports = {
  ...XacmlDecision
}
