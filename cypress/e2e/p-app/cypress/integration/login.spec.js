/// <reference types="cypress" />

import { aliasQuery, hasOperationName } from '../support/utils';

describe('Login', () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://cognito-idp.us-east-1.amazonaws.com/').as(
      'loginUser'
    ); // this aliases the request so we can wait for it later in the test

    cy.intercept(
      'POST',
      'https://api.development.betterpt.com/v0/graphql',
      (req) => {
        aliasQuery(req, 'Me');
      }
    );

    cy.interceptLaunchDarkly();

    cy.visit('/login');
  });

  it('renders the page', () => {
    cy.contains('Log In');
  });

  it('logs in the user successfully', () => {
    cy.intercept(
      'POST',
      'https://api.development.betterpt.com/v0/graphql',
      (req) => {
        if (hasOperationName(req, 'Me')) {
          req.alias = 'gqlMeQuery';
          req.reply({
            fixture: 'me.json',
          });
        }
      }
    );

    cy.getBySel('login-email').type('shane+sms@betterpt.com');
    cy.getBySel('login-password').type('Better123!');
    cy.getBySel('login-button').click();
    cy.wait(['@loginUser', '@gqlMeQuery']);
    cy.contains('Company Info');
  });

  it('errors if login is incorrect', () => {
    cy.getBySel('login-email').type('shane+sms@betterpt.com');
    cy.getBySel('login-password').type('wrong password');
    cy.getBySel('login-button').click();
    cy.contains('This email/password combination is invalid.');
  });
});
