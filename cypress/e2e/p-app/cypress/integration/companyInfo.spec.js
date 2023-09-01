/// <reference types="cypress" />

import { aliasQuery, setupGQLIntercepts } from '../support/utils';

describe('Company Info', () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://cognito-idp.us-east-1.amazonaws.com/').as(
      'loginUser'
    ); // this aliases the request so we can wait for it later in the test

    cy.intercept(
      'POST',
      'https://api.development.betterpt.com/v0/graphql',
      (req) => {
        aliasQuery(req, 'Me');
        aliasQuery(req, 'MeForProfileCheck');
        aliasQuery(req, 'PendingAppointments');
        aliasQuery(req, 'PendingVideoAppointments');
        aliasQuery(req, 'CompanyBillingOverview');
        aliasQuery(req, 'CompanyListOptions');
        aliasQuery(req, 'CompanyBookingFlow');
        aliasQuery(req, 'CompanyAppointmentTypes');
      }
    );

    cy.interceptLaunchDarkly();

    cy.loginByCognitoApi(Cypress.env('username'), Cypress.env('password'));
  });

  it('renders the page', () => {
    setupGQLIntercepts([
      { name: 'Me', fixture: 'me.json' },
      { name: 'MeForProfileCheck', fixture: 'meForProfileCheck.json' },
      {
        name: 'CompanyBillingOverview',
        fixture: 'companyBillingOverview.json',
      },
      {
        name: 'PendingVideoAppointments',
        fixture: 'pendingVideoAppointments.json',
      },
      {
        name: 'PendingAppointments',
        fixture: 'pendingAppointments.json',
      },
      {
        name: 'CompanyListOptions',
        fixture: 'companyListOptions.json',
      },
      {
        name: 'CompanyBookingFlow',
        fixture: 'companyBookingFlow.json',
      },
      {
        name: 'CompanyAppointmentTypes',
        fixture: 'companyAppointmentTypes.json',
      },
    ]);

    cy.visit('/');
    cy.contains('Company Info');
  });

  it('has the correct data on the page', () => {
    setupGQLIntercepts([
      { name: 'Me', fixture: 'me.json' },
      { name: 'MeForProfileCheck', fixture: 'meForProfileCheck.json' },
      {
        name: 'CompanyBillingOverview',
        fixture: 'companyBillingOverview.json',
      },
      {
        name: 'PendingVideoAppointments',
        fixture: 'pendingVideoAppointments.json',
      },
      {
        name: 'PendingAppointments',
        fixture: 'pendingAppointments.json',
      },
      {
        name: 'CompanyListOptions',
        fixture: 'companyListOptions.json',
      },
      {
        name: 'CompanyBookingFlow',
        fixture: 'companyBookingFlow.json',
      },
      {
        name: 'CompanyAppointmentTypes',
        fixture: 'companyAppointmentTypes.json',
      },
    ]);

    cy.visit('/');
    cy.wait(['@loginUser', '@gqlMeQuery']);
    cy.contains('Company Info');
  });
});
