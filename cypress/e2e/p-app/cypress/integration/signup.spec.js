/// <reference types="cypress" />

import { aliasQuery } from '../support/utils';

describe('Signup', () => {
  beforeEach(() => {
    cy.intercept(
      'POST',
      'https://api.development.betterpt.com/v0/graphql',
      (req) => {
        aliasQuery(req, 'Me');
      }
    );

    cy.interceptLaunchDarkly();

    cy.visit('/signup');
  });

  it('renders the page', () => {
    cy.contains('Sign up');
  });

  it('signs up the user successfully', () => {
    cy.intercept(
      {
        method: 'POST',
        url: 'https://cognito-idp.us-east-1.amazonaws.com/',
      },
      {}
    );

    cy.getBySel('signup-email-input').type('andrew+newpatient@betterpt.com');
    cy.getBySel('signup-password-input').type('Better1234!');
    cy.getBySel('signup-confirm-input').type('Better1234!');
    cy.getBySel('signup-button').click();
    cy.contains('Confirm your email');
  });

  it('disables button if no email or password are entered', () => {
    cy.getBySel('signup-button').should('be.disabled');
  });

  it('disables button if password is blank', () => {
    cy.getBySel('signup-email-input').type('andrew+newpatient@betterpt.com');
    cy.getBySel('signup-button').should('be.disabled');
  });

  it('disables button button and displays error message if passwords do not match', () => {
    cy.getBySel('signup-email-input').type('andrew+newpatient@betterpt.com');
    cy.getBySel('signup-password-input').type('Better1234!');
    cy.getBySel('signup-confirm-input').type('NotTheSame');
    cy.contains('Passwords must match');
    cy.getBySel('signup-button').should('be.disabled');
  });
});
