/* eslint-disable no-console */
const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// Create a new Express app
const app = express();

// Set up Auth0 configuration. These values should be
// the domain and audience for the API that you want to call.
const authConfig = {
  domain: 'shills.us.auth0.com',
  audience: 'https://shills.homestuck.net',
};

// Define middleware that validates incoming bearer tokens
// using JWKS from YOUR_DOMAIN
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ['RS256'],
});

// Define an endpoint that must be called with an access token
app.get('/api/external', checkJwt, (req, res) => {
  res.send({
    msg: 'Your Access Token was successfully validated!',
  });
});

// Start the app
app.listen(3001, () => console.log('API listening on 3001'));
