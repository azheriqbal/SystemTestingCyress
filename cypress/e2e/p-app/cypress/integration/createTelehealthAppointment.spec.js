/// <reference types="cypress" />

import {
  addDays,
  format,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import {
  aliasMutation,
  aliasQuery,
  setupGQLIntercepts,
} from '../support/utils';

describe('Create Telehealth Appointment', () => {
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
        aliasQuery(req, 'CompanyBillingOverview');
        aliasQuery(req, 'PendingVideoAppointments');
        aliasQuery(req, 'PendingAppointments');
        aliasQuery(req, 'CompanyListItems');
        aliasQuery(req, 'FacilityEmployees');
        aliasQuery(req, 'PatientContactList');
        aliasQuery(req, 'EmployeeAppointmentTypes');
        aliasQuery(req, 'VideoAppointments');
        aliasMutation(req, 'CreateVideoAppointment');
        aliasQuery(req, 'TotalAppointments');
        aliasQuery(req, 'CompanyListOptions');
        aliasQuery(req, 'CompanyListItems');
      }
    );

    cy.interceptLaunchDarkly();
  });

  it('Will successfully create a video appointment', () => {
    setupGQLIntercepts([
      { name: 'Me', fixture: 'me.json', isQuery: true },
      { name: 'MeForProfile', fixture: 'meForProfile.json', isQuery: true },
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
        name: 'CompanyListItems',
        fixture: 'companyListItems.json',
      },
      {
        name: 'CompanyListOptions',
        fixture: 'facilityListOptions.json',
      },
      {
        name: 'FacilityEmployees',
        fixture: 'facilityEmployees.json',
      },
      {
        name: 'PatientContactList',
        fixture: 'patientContactList.json',
      },
      {
        name: 'EmployeeAppointmentTypes',
        fixture: 'employeeAppointmentTypes.json',
      },
      {
        name: 'CreateVideoAppointment',
        fixture: 'createVideoAppointment.json',
        isQuery: false,
      },
      {
        name: 'TotalAppointments',
        fixture: 'totalAppointments.json',
      },
      {
        name: 'VideoAppointments',
        fixture: 'videoAppointments.json',
      },
    ]);

    cy.loginByCognitoApi(Cypress.env('username'), Cypress.env('password'));
    cy.visit('/appointments/telehealth/new');

    cy.wait([
      '@loginUser',
      '@gqlMeQuery',
      '@gqlMeForProfileCheckQuery',
      '@gqlCompanyListOptionsQuery',
      '@gqlCompanyBillingOverviewQuery',
    ]);
    cy.contains('Create a Telehealth Appointment');
    cy.getBySel('create-appointment-datepicker')
      .find('input')
      .type(format(addDays(new Date(), 2), 'MM/dd/yyyy'));
    cy.getBySel('create-appointment-timepicker').find('input').type('12:00 PM');
    cy.getBySel('create-appointment-facilities').find('select').select('1');

    cy.wait(['@gqlFacilityEmployeesQuery']);
    cy.getBySel('create-appointment-employees')
      .find('input')
      .type('Example Provider');

    cy.contains(
      'Example Provider 1 (example+provider1@betterpt.com, 999-999-9999'
    ).click();

    cy.wait(['@gqlEmployeeAppointmentTypesQuery']);
    cy.getBySel('create-appointment-appointment-type')
      .find('input')
      .type('Telehealth Apt type');

    cy.contains('Telehealth Apt type').click();

    cy.getBySel('create-appointment-patients')
      .find('input')
      .type('Example Patient');

    cy.contains('PATIENT, EXAMPLE', { timeout: 2000 }).click();

    cy.getBySel('create-appointment-button').click();

    cy.wait(['@gqlCreateVideoAppointmentMutation']).then((req) => {
      const {
        clinicId,
        contactId,
        employeeId,
        startTime,
      } = req.request.body.variables.input;

      expect(clinicId).to.equal('1');
      expect(contactId).to.equal('1');
      expect(employeeId).to.equal('1');
      expect(startTime).to.equal(
        zonedTimeToUtc(
          setMilliseconds(
            setSeconds(setMinutes(setHours(addDays(new Date(), 2), 12), 0), 0),
            0
          ),
          'America/New_York'
        ).toISOString()
      );
    });

    cy.contains('Succesfully scheduled appointment!').click();
  });

  it('Will successfully create an recurring video appointment', () => {
    setupGQLIntercepts([
      { name: 'Me', fixture: 'me.json', isQuery: true },
      { name: 'MeForProfile', fixture: 'meForProfile.json', isQuery: true },
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
        name: 'CompanyListItems',
        fixture: 'companyListItems.json',
      },
      {
        name: 'CompanyListOptions',
        fixture: 'facilityListOptions.json',
      },
      {
        name: 'FacilityEmployees',
        fixture: 'facilityEmployees.json',
      },
      {
        name: 'PatientContactList',
        fixture: 'patientContactList.json',
      },
      {
        name: 'EmployeeAppointmentTypes',
        fixture: 'employeeAppointmentTypes.json',
      },
      {
        name: 'CreateVideoAppointment',
        fixture: 'createVideoAppointment.json',
        isQuery: false,
      },
      {
        name: 'TotalAppointments',
        fixture: 'totalAppointments.json',
      },
      {
        name: 'VideoAppointments',
        fixture: 'videoAppointments.json',
      },
    ]);

    cy.loginByCognitoApi(Cypress.env('username'), Cypress.env('password'));
    cy.visit('/appointments/telehealth/new');

    cy.wait([
      '@loginUser',
      '@gqlMeQuery',
      '@gqlMeForProfileCheckQuery',
      '@gqlCompanyListOptionsQuery',
      '@gqlCompanyBillingOverviewQuery',
    ]);
    cy.contains('Create a Telehealth Appointment');
    cy.getBySel('create-appointment-datepicker')
      .find('input')
      .type(format(addDays(new Date(), 2), 'MM/dd/yyyy'));
    cy.getBySel('create-appointment-timepicker').find('input').type('12:00 PM');

    // === Recurring Modal test logic =======
    cy.getBySel('recurring-appointment').click();

    cy.getBySel('recurring-number').find('select').select('1');
    cy.getBySel('recurring-days-weeks').find('select').select('day');

    const recurringUntilDate = format(addDays(new Date(), 20), 'MM/dd/yyyy');
    cy.getBySel('recurring-until').find('input').type(recurringUntilDate);

    cy.getBySel('recurring-exclude-weekends').find('[type="checkbox"]').check();

    cy.getBySel('recurring-continue-button').click();

    cy.contains('After each completed appointment', { timeout: 2000 });

    cy.getBySel('recurring-final-step').click();

    cy.contains(`RECURS THRU ${recurringUntilDate}`);

    // ============

    cy.getBySel('create-appointment-facilities').find('select').select('1');

    cy.wait(['@gqlFacilityEmployeesQuery']);
    cy.getBySel('create-appointment-employees')
      .find('input')
      .type('Example Provider');

    cy.contains(
      'Example Provider 1 (example+provider1@betterpt.com, 999-999-9999'
    ).click();

    cy.wait(['@gqlEmployeeAppointmentTypesQuery']);
    cy.getBySel('create-appointment-appointment-type')
      .find('input')
      .type('Telehealth Apt type');

    cy.contains('Telehealth Apt type').click();

    cy.getBySel('create-appointment-patients')
      .find('input')
      .type('Example Patient');

    cy.contains('PATIENT, EXAMPLE', { timeout: 2000 }).click();

    cy.getBySel('create-appointment-button').click();

    cy.wait(['@gqlCreateVideoAppointmentMutation']).then((req) => {
      console.log(req);
      const {
        clinicId,
        contactId,
        employeeId,
        startTime,
        recurringFrequency,
        recurringInterval,
        shouldSkipWeekends,
      } = req.request.body.variables.input;

      expect(clinicId).to.equal('1');
      expect(contactId).to.equal('1');
      expect(employeeId).to.equal('1');
      expect(startTime).to.equal(
        zonedTimeToUtc(
          setMilliseconds(
            setSeconds(setMinutes(setHours(addDays(new Date(), 2), 12), 0), 0),
            0
          ),
          'America/New_York'
        ).toISOString()
      );

      expect(recurringFrequency).to.equal('day');
      expect(recurringInterval).to.equal(1);
      expect(shouldSkipWeekends).to.equal(true);
    });

    cy.contains('Succesfully scheduled appointment!').click();
  });
});
