# node-xacml

Provides support for authorization decisions from a XACML Policy Decision Point (PDP) in Node.js apps.

## Install

Configure npm with the NES Digital Service GitHub packages repository:

```shell
echo "@nes-digital-service:registry=https://npm.pkg.github.com" > .npmrc
echo "//npm.pkg.github.com/:_authToken=<PERSONAL ACCESS TOKEN>" >> .npmrc
```

If you do not have a GitHub personal access token then generate one from your [GitHub Developer Settings](https://github.com/settings/tokens).
To install this package the personal access token must have the `read:packages` scope.

Install the module with npm:

```shell
npm install --save @nes-digital-service/node-xacml
```

## Usage

```js
const {
  XacmlClient,
  XacmlDecisionRequest,
  XacmlAttributeCategory,
  XacmlAttributeId
} = require('@nes-digital-service/node-xacml')

// Create a client to connect to the PDP endpoint
const client = new XacmlClient({
  pdpUrl: 'http://ptsv2.com/t/z82nj-1657815595/post'
})

// Create an authz request to verify the 'test' action is allowed.
const request = XacmlDecisionRequest.fromCompactForm({
  [XacmlAttributeCategory.ACTION]: [{ id: XacmlAttributeId.ACTION_ID, value: 'test' }]
})

// Send the decision request and get the reponse
client.getDecision(request)
  .then(response => console.log(response.isAuthorized()))
  .catch(reason => console.log(reason))
```

### API Documentation

API documentation for this library can be found [at our GitHub Pages site](https://nes-digital-service.github.io/node-xacml).

## For Maintainers

### Testing

This library comes with a suite of unit tests. To execute the unit tests:

```shell
npm test
```

This will also show the unit test coverage report.

### Publishing

This package will be published to GitHub Packages when a release is performed.
The package version number will be the same as the release tag.

Note: The workflows depend on our GitHub PACKAGES_TOKEN, which expires every 90 days, if it does create a Personal Access Token with the
`read:packages` scope and update the secret.