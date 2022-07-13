const SUBJECT = 'urn:oasis:names:tc:xacml:1.0:subject-category:access-subject'
const ACTION = 'urn:oasis:names:tc:xacml:3.0:attribute-category:action'
const RESOURCE = 'urn:oasis:names:tc:xacml:3.0:attribute-category:resource'
const ENVIRONMENT = 'urn:oasis:names:tc:xacml:3.0:attribute-category:environment'

module.exports = {
  SUBJECT,
  ACTION,
  RESOURCE,
  ENVIRONMENT,
  values: [SUBJECT, ACTION, RESOURCE, ENVIRONMENT]
}
