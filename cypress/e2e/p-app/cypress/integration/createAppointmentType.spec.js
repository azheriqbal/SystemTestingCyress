/// <reference types="cypress" />

import { aliasQuery, setupGQLIntercepts } from '../support/utils';

describe('Create Appointment Type', () => {
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

  it('lists the correct appointment types', () => {
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

    cy.visit('/company/info');

    cy.wait([
      '@loginUser',
      '@gqlMeQuery',
      '@gqlMeForProfileCheckQuery',
      '@gqlPendingAppointmentsQuery',
      '@gqlPendingVideoAppointmentsQuery',
      '@gqlCompanyBillingOverviewQuery',
      '@gqlCompanyAppointmentTypesQuery',
    ]);

    cy.getBySel('better-access-booking-experience-card').contains(
      'BetterAccess Booking Experience'
    );

    cy.getBySel('better-access-booking-experience-card')
      .find('input')
      .eq(0)
      .should('have.value', 'In-Person Initial Evaluation (in-person)');

    cy.getBySel('better-access-booking-experience-card')
      .find('input')
      .eq(1)
      .should('have.value', 'Telehealth Apt type (telehealth)');
  });

  it('creates an appointment type', () => {
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

    cy.visit('/company/info');

    cy.wait([
      '@loginUser',
      '@gqlMeQuery',
      '@gqlMeForProfileCheckQuery',
      '@gqlPendingAppointmentsQuery',
      '@gqlPendingVideoAppointmentsQuery',
      '@gqlCompanyBillingOverviewQuery',
      '@gqlCompanyAppointmentTypesQuery',
    ]);

    cy.getBySel('add-appointment-types-button').click();

    cy.contains('Create a New Appointment Type');

    cy.getBySel('create-appointment-type-name').type(
      'Example Appointment Type'
    );
    cy.getBySel('create-appointment-type-medium-textfield').click();
    cy.getBySel('create-appointment-type-medium-in-person').click();

    cy.getBySel('appointment-type-is-initial-eval-textfield').click({
      force: true,
    });
    cy.getBySel('appointment-type-is-initial-eval-true').click();

    cy.getBySel('create-appointment-type-duration')
      .find('input')
      .type('60', { force: true });

    cy.getBySel('create-appointment-type-interval').find('input').type('60');
    cy.getBySel('require-insurance-toggle').find('input').check();
    cy.getBySel('patient-acknowledgment-toggle').find('input').uncheck();

    setupGQLIntercepts([
      {
        name: 'CreateAppointmentType',
        fixture: 'createAppointmentType.json',
        isQuery: false,
      },
    ]);

    cy.getBySel('create-appointment-type-button').click();

    cy.wait([
      '@gqlCreateAppointmentTypeMutation',
      '@gqlCompanyAppointmentTypesQuery',
    ]).then(([createAppointmentType]) => {
      expect(
        createAppointmentType.request.body.variables.input.companyId
      ).to.equal('1');
      expect(
        createAppointmentType.request.body.variables.input.displayName
      ).to.equal('Example Appointment Type');
      expect(
        createAppointmentType.request.body.variables.input.duration
      ).to.equal(60);
      expect(
        createAppointmentType.request.body.variables.input.interval
      ).to.equal(60);
      expect(
        createAppointmentType.request.body.variables.input
          .shouldHideProviderOption
      ).to.not.equal(true);
      expect(
        createAppointmentType.request.body.variables.input.legacyIsInitialEval
      ).to.equal(true);
      expect(
        createAppointmentType.request.body.variables.input.medium
      ).to.equal('inClinic');
      expect(
        createAppointmentType.request.body.variables.input
          .shouldRequireManualInsurance
      ).to.equal(true);
      expect(
        createAppointmentType.request.body.variables.input
          .shouldHideFinalCheckbox
      ).to.equal(true);
    });
  });
});
