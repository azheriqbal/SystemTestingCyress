/// <reference types="cypress" />

import {
  aliasMutation,
  aliasQuery,
  setupGQLIntercepts,
} from '../support/utils';

describe('Appointment Type Details', () => {
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
        aliasMutation(req, 'UpdateAppointmentType');
      }
    );

    cy.interceptLaunchDarkly();

    cy.loginByCognitoApi(Cypress.env('username'), Cypress.env('password'));
  });

  it('loads the correct appointment type', () => {
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
        name: 'AppointmentType',
        fixture: 'appointmentType.json',
      },
    ]);

    cy.visit('/company/appointment-type/1');

    cy.wait([
      '@loginUser',
      '@gqlMeQuery',
      '@gqlMeForProfileCheckQuery',
      '@gqlPendingAppointmentsQuery',
      '@gqlPendingVideoAppointmentsQuery',
      '@gqlCompanyBillingOverviewQuery',
      '@gqlAppointmentTypeQuery',
    ]);

    cy.contains('In-Person Initial Evaluation');

    cy.getBySel('appointment-type-name')
      .find('input')
      .should('have.value', 'In-Person Initial Evaluation');
    cy.getBySel('appointment-type-medium')
      .find('input')
      .should('have.value', 'In-Person');
    cy.getBySel('appointment-type-duration')
      .find('input')
      .should('have.value', '60 minutes');
    cy.getBySel('appointment-type-interval')
      .find('input')
      .should('have.value', '15 minutes');
    cy.getBySel('appointment-type-legacyIsInitialEval')
      .find('input')
      .should('have.value', 'Initial Evaluation');
    cy.getBySel('require-insurance-switch')
      .find('input')
      .should('have.value', 'true');
    cy.getBySel('patient-acknowledgment-toggle')
      .find('input')
      .should('have.value', 'false');
  });

  it('successfully edits the appointment type', () => {
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
        name: 'AppointmentType',
        fixture: 'appointmentType.json',
      },
      {
        name: 'UpdateAppointmentType',
        fixture: 'updateAppointmentType.json',
        isQuery: false,
      },
    ]);

    cy.visit('/company/appointment-type/1');

    cy.wait([
      '@loginUser',
      '@gqlMeQuery',
      '@gqlMeForProfileCheckQuery',
      '@gqlPendingAppointmentsQuery',
      '@gqlPendingVideoAppointmentsQuery',
      '@gqlCompanyBillingOverviewQuery',
      '@gqlAppointmentTypeQuery',
    ]);

    cy.getBySel('edit-appointment-type-button').click();

    cy.contains('Edit Appointment Type');
    cy.getBySel('edit-appointment-type-name')
      .find('input')
      .should('have.value', 'In-Person Initial Evaluation')
      .clear()
      .type('In-Person Follow Up');

    cy.getBySel('edit-appointment-type-medium')
      .find('input')
      .should('have.value', 'In-Person');

    cy.getBySel('appointment-type-is-initial-eval-textfield')
      .find('input')
      .should('have.value', 'Initial Evaluation')
      .click({ force: true });

    cy.getBySel('appointment-type-is-initial-eval-false').click({
      force: true,
    });

    cy.getBySel('edit-appointment-type-duration')
      .find('input')
      .should('have.value', '60')
      .clear({ force: true })
      .type('30');

    cy.getBySel('edit-appointment-type-interval')
      .find('input')
      .should('have.value', '15')
      .clear()
      .type('10');

    cy.getBySel('edit-appointment-type-choose-provider-switch')
      .find('input')
      .should('have.value', 'true') //field is true because it's "ability to choose" in the UI
      .click({ force: false });

    cy.getBySel('edit-appointment-type-require-insurance-switch')
      .find('input')
      .should('have.value', 'true')
      .click({ force: false });

    cy.getBySel('edit-appointment-type-dialog-button').click();

    cy.contains('Are you sure you want to continue?');
    cy.getBySel('edit-appointment-type-confirm-button').click();

    cy.wait('@gqlUpdateAppointmentTypeMutation').then(
      (updateAppointmentType) => {
        expect(
          updateAppointmentType.request.body.variables.input.appointmentTypeId
        ).to.equal('1');
        expect(
          updateAppointmentType.request.body.variables.input.displayName
        ).to.equal('In-Person Follow Up');
        expect(
          updateAppointmentType.request.body.variables.input.duration
        ).to.equal(30);
        expect(
          updateAppointmentType.request.body.variables.input.interval
        ).to.equal(10);
        expect(
          updateAppointmentType.request.body.variables.input
            .shouldHideProviderOption
        ).to.equal(true); //true here because that's what backend will have if UI says "OFF"
        expect(
          updateAppointmentType.request.body.variables.input.legacyIsInitialEval
        ).to.equal(false);
        expect(
          updateAppointmentType.request.body.variables.input
            .shouldRequireManualInsurance
        ).to.equal(false);
        expect(
          updateAppointmentType.request.body.variables.input
            .shouldHideFinalCheckbox
        ).to.equal(true);
      }
    );

    cy.contains('Appointment type details saved');
  });
});
