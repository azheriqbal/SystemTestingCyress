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

describe('Create In-Person Appointment', () => {
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
        aliasQuery(req, 'CompanyListOptions');
        aliasQuery(req, 'FacilityEmployees');
        aliasQuery(req, 'PatientContactList');
        aliasQuery(req, 'EmployeeAppointmentTypes');
        aliasMutation(req, 'CreateInPersonAppointment');
        aliasQuery(req, 'TotalInPersonAppointments');
        aliasQuery(req, 'InPersonAppointments');
      }
    );

    cy.interceptLaunchDarkly();
  });

  it('Will successfully create an in person appointment', () => {
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
        name: 'CreateInPersonAppointment',
        fixture: 'createInPersonAppointment.json',
        isQuery: false,
      },
      {
        name: 'TotalInPersonAppointments',
        fixture: 'totalInPersonAppointments.json',
      },
      {
        name: 'InPersonAppointments',
        fixture: 'inPersonAppointments.json',
      },
    ]);

    cy.loginByCognitoApi(Cypress.env('username'), Cypress.env('password'));
    cy.visit('/appointments/in-person/new');

    cy.wait([
      '@loginUser',
      '@gqlMeQuery',
      '@gqlMeForProfileCheckQuery',
      '@gqlCompanyListOptionsQuery',
      '@gqlCompanyBillingOverviewQuery',
    ]);
    cy.contains('Create an In-Person Appointment');
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
      .type('In-Person Initial Evaluation');

    cy.contains('In-Person Initial Evaluation').click();

    cy.getBySel('create-appointment-patients')
      .find('input')
      .type('Example Patient');

    cy.contains('PATIENT, EXAMPLE', { timeout: 2000 }).click();

    cy.getBySel('create-appointment-button').click();

    cy.wait(['@gqlCreateInPersonAppointmentMutation']).then((req) => {
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
});
