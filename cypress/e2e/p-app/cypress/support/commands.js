// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import Auth from '@aws-amplify/auth';

Cypress.Commands.add('loginByCognitoApi', (username, password) => {
  const log = Cypress.log({
    displayName: 'COGNITO LOGIN',
    message: [`Authenticating | ${username}`],
    autoEnd: false,
  });
  log.snapshot('before');

  const userPoolId = Cypress.env('userPoolId');
  const clientId = Cypress.env('clientId');
  const awsconfig = {
    aws_user_pools_id: userPoolId,
    aws_user_pools_web_client_id: clientId,
  };

  Auth.configure(awsconfig);

  const signIn = Auth.signIn({ username, password });
  cy.wrap(signIn, { log: false, timeout: 10000 }).then((cognitoResponse) => {
    const keyPrefixWithUsername = `${cognitoResponse.keyPrefix}.${cognitoResponse.username}`;

    window.localStorage.setItem(
      `${keyPrefixWithUsername}.idToken`,
      cognitoResponse.signInUserSession.idToken.jwtToken
    );

    window.localStorage.setItem(
      `${keyPrefixWithUsername}.accessToken`,
      cognitoResponse.signInUserSession.accessToken.jwtToken
    );

    window.localStorage.setItem(
      `${keyPrefixWithUsername}.refreshToken`,
      cognitoResponse.signInUserSession.refreshToken.token
    );

    window.localStorage.setItem(
      `${keyPrefixWithUsername}.clockDrift`,
      cognitoResponse.signInUserSession.clockDrift
    );

    window.localStorage.setItem(
      `${cognitoResponse.keyPrefix}.LastAuthUser`,
      cognitoResponse.username
    );

    window.localStorage.setItem('amplify-authenticator-authState', 'signedIn');
    log.snapshot('after');
    log.end();
  });
});

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args);
});

Cypress.Commands.add('interceptLaunchDarkly', () => {
  // set up this intercept to reply with our own flags in the test
  cy.intercept('https://app.launchdarkly.com/**', (req) => {
    req.reply({
      fixture: 'launchDarkly.json',
    });
  });

  // set up this intercept to catch any other launchdarkly requests that run
  cy.intercept('https://*.launchdarkly.com/**');
});
