/// <reference types="cypress" />

import {
  aliasMutation,
  aliasQuery,
  setupGQLIntercepts,
} from '../support/utils';

describe('In Person Appointment Details', () => {
  beforeEach(() => {
    cy.viewport('macbook-13');
    cy.intercept('POST', 'https://cognito-idp.us-east-1.amazonaws.com/').as(
      'loginUser'
    ); // this aliases the request so we can wait for it later in the test

    // Alias all potential queries and mutations we might get
    cy.intercept(
      'POST',
      'https://api.development.betterpt.com/v0/graphql',
      (req) => {
        aliasQuery(req, 'Me');
        aliasQuery(req, 'MeForProfileCheck');
        aliasQuery(req, 'CompanyBillingOverview');
        aliasQuery(req, 'PendingVideoAppointments');
        aliasQuery(req, 'PendingAppointments');
        aliasQuery(req, 'InPersonAppointmentDetails');
        aliasQuery(req, 'PatientDetails');
        aliasQuery(req, 'CompanyBookingFlow');
        aliasQuery(req, 'FacilityBookingFlow');
        aliasMutation(req, 'CreatePatientContact');
        aliasMutation(req, 'LinkContactToPatient');
        aliasQuery(req, 'FacilityEmployees');
        aliasQuery(req, 'Employee');
        aliasMutation(req, 'UpdateInPersonAppointmentConfirmationStatus');
      }
    );

    cy.interceptLaunchDarkly();

    // before every test, log in
    cy.loginByCognitoApi(Cypress.env('username'), Cypress.env('password'));
  });

  it('Confirms an appointment with a new patient', () => {
    // set up the intercepts that we will need for the initial load of the page.
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
        name: 'InPersonAppointmentDetails',
        fixture: 'inPersonAppointmentDetailsRequest.json',
      },
      {
        name: 'PatientContactList',
        fixture: 'blankPatientContactList.json',
      },
      {
        name: 'PatientDetails',
        fixture: 'unmatchedPatientDetails.json',
      },
      {
        name: 'CompanyBookingFlow',
        fixture: 'companyBookingFlow.json',
      },
      {
        name: 'FacilityBookingFlow',
        fixture: 'facilityBookingFlow.json',
      },
    ]);

    // we have to set up the interceptions before we visit the page
    cy.visit('/appointments/in-person/details/1');

    // wait for all of the queries to be called before we continue
    cy.wait([
      '@loginUser',
      '@gqlMeQuery',
      '@gqlMeForProfileCheckQuery',
      '@gqlPendingAppointmentsQuery',
      '@gqlPendingVideoAppointmentsQuery',
      '@gqlCompanyBillingOverviewQuery',
      '@gqlInPersonAppointmentDetailsQuery',
      '@gqlPatientDetailsQuery',
      '@gqlCompanyBookingFlowQuery',
      '@gqlPatientContactListQuery',
    ]);

    // check that the new patient form is on the screen with the correct data
    cy.contains('In-Person Appointments Overview');
    cy.contains('Appointment Request');

    cy.contains('New Patient!');

    cy.getBySel('new-contact-link-firstName')
      .find('input')
      .should('have.value', 'Example');

    cy.getBySel('new-contact-link-lastName')
      .find('input')
      .should('have.value', 'Patient');

    cy.getBySel('new-contact-link-email')
      .find('input')
      .should('have.value', 'example+patient@betterpt.com');

    cy.getBySel('new-contact-link-phone')
      .find('input')
      .should('have.value', '888-888-8888');

    cy.getBySel('new-contact-link-dob')
      .find('input')
      .should('have.value', 'April 26th, 1989');

    // set up intercepts for the mutation we are going to call BEFORE we click the button to create and link a contact so there is no race condition.
    setupGQLIntercepts([
      {
        name: 'CreatePatientContact',
        fixture: 'createContact.json',
        isQuery: false,
      },
      {
        name: 'LinkContactToPatient',
        fixture: 'linkContactToPatient.json',
        isQuery: false,
      },
      {
        name: 'InPersonAppointmentDetails',
        fixture: 'inPersonAppointmentDetailsRequestWithContact.json',
      },
      {
        name: 'PatientDetails',
        fixture: 'matchedPatientDetails.json',
      },
    ]);

    cy.getBySel('new-contact-link-button').click();

    cy.wait([
      '@gqlCreatePatientContactMutation',
      '@gqlLinkContactToPatientMutation',
      '@gqlInPersonAppointmentDetailsQuery',
      '@gqlPatientDetailsQuery',
    ]).then(([createContact, linkContact]) => {
      // check that the correct data is being sent for the mutation input
      expect(createContact.request.body.variables.input.clinicId).to.equal('1');
      expect(createContact.request.body.variables.input.dateOfBirth).to.equal(
        '1989-04-26'
      );
      expect(createContact.request.body.variables.input.email).to.equal(
        'example+patient@betterpt.com'
      );
      expect(createContact.request.body.variables.input.firstName).to.equal(
        'Example'
      );
      expect(createContact.request.body.variables.input.lastName).to.equal(
        'Patient'
      );
      expect(createContact.request.body.variables.input.phone).to.equal(
        '8888888888'
      );
      expect(linkContact.request.body.variables.input.contactId).to.equal('1');
      expect(linkContact.request.body.variables.input.patientId).to.equal('1');
    });

    cy.contains(
      'New patient profile successfully created and linked to this info!'
    );

    // dismiss the snackbar
    cy.getBySel('in-person-appt-patient-name').click();

    // check that all of the accurate information is on the page
    cy.getBySel('in-person-appt-patient-name')
      .find('input')
      .should('have.value', 'Example Patient');

    cy.getBySel('in-person-appt-patient-phone')
      .find('input')
      .should('have.value', '888-888-8888');

    cy.getBySel('in-person-appt-patient-email')
      .find('input')
      .should('have.value', 'example+patient@betterpt.com');

    cy.getBySel('in-person-appt-employee-name')
      .find('input')
      .should('have.value', 'Pending Appt. Confirmation');

    cy.getBySel('in-person-appt-employee-phone')
      .find('input')
      .should('have.value', 'Pending Appt. Confirmation');

    cy.getBySel('in-person-appt-employee-email')
      .find('input')
      .should('have.value', 'Pending Appt. Confirmation');

    cy.getBySel('in-person-appt-type')
      .find('input')
      .should('have.value', 'Initial Evaluation');

    cy.getBySel('in-person-appt-details')
      .find('input')
      .should('have.value', 'Requested 7/26 @ 12:28 PM EDT');

    cy.getBySel('in-person-appt-info')
      .find('input')
      .should('have.value', 'Qualifying Info Added');

    cy.getBySel('in-person-appt-custom-responses')
      .find('label')
      .eq(0)
      .contains('How did you hear about this clinic');
    cy.getBySel('in-person-appt-custom-responses')
      .find('input')
      .eq(0)
      .should('have.value', 'Internet');

    cy.getBySel('in-person-appt-custom-responses')
      .find('label')
      .eq(1)
      .contains('How do you prefer to be contacted?');
    cy.getBySel('in-person-appt-custom-responses')
      .find('input')
      .eq(1)
      .should('have.value', 'Email');

    cy.getBySel('patient-info-firstName')
      .find('input')
      .should('have.value', 'Example');

    cy.getBySel('patient-info-lastName')
      .find('input')
      .should('have.value', 'Patient');

    cy.getBySel('patient-info-gender')
      .find('input')
      .should('have.value', 'Male');

    cy.getBySel('patient-info-birthday')
      .find('input')
      .should('have.value', '04/26/1989');

    cy.getBySel('patient-info-email')
      .find('input')
      .should('have.value', 'example+patient@betterpt.com');

    cy.getBySel('patient-info-phone')
      .find('input')
      .should('have.value', '888-888-8888');

    cy.getBySel('patient-info-address')
      .find('input')
      .should('have.value', '25 West 36th Street');

    cy.getBySel('patient-info-city')
      .find('input')
      .should('have.value', 'New York');

    cy.getBySel('patient-info-state')
      .find('input')
      .should('have.value', 'New York');

    cy.getBySel('patient-info-zipcode')
      .find('input')
      .should('have.value', '10018');

    cy.getBySel('patient-info-primary-insurance-carrier')
      .find('input')
      .should('have.value', 'Carrier');

    cy.getBySel('patient-info-primary-insurance-plan')
      .find('input')
      .should('have.value', 'Plan');

    cy.getBySel('patient-info-primary-insurance-memberNumber')
      .find('input')
      .should('have.value', 'W123456789');

    // set up the query intercepts before we open up the action menu
    setupGQLIntercepts([
      {
        name: 'FacilityEmployees',
        fixture: 'facilityEmployees.json',
      },
      {
        name: 'FacilityIntegrationDetails',
        fixture: 'facilityIntegrationDetails.json',
      },
      {
        name: 'FacilitySMSParticipation',
        fixture: 'facilitySmsParticipation.json',
      },
      {
        name: 'Employee',
        fixture: 'employee.json',
      },
    ]);

    cy.contains('REQUEST').click();
    // There are some issues with how this is appearing on the DOM that sometimes it becomes unchecked. By putting force: true, we can bypass that problem.
    cy.get('[type="radio"]').first().click({ force: true });

    cy.contains('CONTINUE').click({ force: true });

    // wait to load the employee list for this facility
    cy.wait(['@gqlFacilityEmployeesQuery']);
    cy.contains('Confirm Appointment');
    cy.contains(
      'Please add the email of the employee who will be attending this session.'
    );
    cy.getBySel('generalized-employee-picker').type('Example Provider 1');
    cy.contains('Example Provider 1').click();

    // set up the gql intercepts before we confirm the appointment
    setupGQLIntercepts([
      {
        name: 'UpdateInPersonAppointmentConfirmationStatus',
        fixture: 'updateInPersonAppointmentConfirmationStatus.json',
        isQuery: false,
      },
      {
        name: 'InPersonAppointmentDetails',
        fixture: 'inPersonAppointmentConfirmed.json', // we are sending a different fixture here because this is the updated one we expect with an upcoming appointment
      },
    ]);
    cy.getBySel('confirm-appointment-button').click();

    cy.wait([
      '@gqlUpdateInPersonAppointmentConfirmationStatusMutation',
      '@gqlInPersonAppointmentDetailsQuery',
    ]).then(([updateInPersonConfirmationStatus]) => {
      // make sure we're sending the correct data to the backend
      expect(
        updateInPersonConfirmationStatus.request.body.variables.input
          .appointmentId
      ).to.equal('1');
      expect(
        updateInPersonConfirmationStatus.request.body.variables.input
          .confirmationStatus
      ).to.equal('confirmed');
      expect(
        updateInPersonConfirmationStatus.request.body.variables.input
          .confirmedTime
      ).to.equal('2021-08-11T13:00:00.000Z');
      expect(
        updateInPersonConfirmationStatus.request.body.variables.input.employeeId
      ).to.equal('1');
    });

    // ensure that the data has flipped to an upcoming appointment
    cy.contains('Upcoming Appointment');
    cy.getBySel('in-person-appt-employee-name')
      .find('input')
      .should('have.value', 'Example Provider 1');

    cy.getBySel('in-person-appt-employee-phone')
      .find('input')
      .should('have.value', '999-999-9999');

    cy.getBySel('in-person-appt-employee-email')
      .find('input')
      .should('have.value', 'example+employee@betterpt.com');
  });

  it('Declines an appointment with an existing patient with a preset reason', () => {
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
        name: 'InPersonAppointmentDetails',
        fixture: 'inPersonAppointmentDetailsRequestWithContact.json',
      },
      {
        name: 'PatientDetails',
        fixture: 'matchedPatientDetails.json',
      },
      {
        name: 'CompanyBookingFlow',
        fixture: 'companyBookingFlow.json',
      },
      {
        name: 'FacilityBookingFlow',
        fixture: 'facilityBookingFlow.json',
      },
      {
        name: 'FacilityIntegrationDetails',
        fixture: 'facilityIntegrationDetails.json',
      },
      {
        name: 'FacilitySMSParticipation',
        fixture: 'facilitySmsParticipation.json',
      },
    ]);

    cy.visit('/appointments/in-person/details/1');

    cy.wait([
      '@loginUser',
      '@gqlMeQuery',
      '@gqlMeForProfileCheckQuery',
      '@gqlPendingAppointmentsQuery',
      '@gqlPendingVideoAppointmentsQuery',
      '@gqlCompanyBillingOverviewQuery',
      '@gqlInPersonAppointmentDetailsQuery',
      '@gqlPatientDetailsQuery',
      '@gqlCompanyBookingFlowQuery',
    ]);

    cy.contains('REQUEST').click();
    cy.get('[type="radio"]').last().check({ force: true });

    cy.contains('CONTINUE').click({ force: true });

    cy.contains('Decline Appointment Request');

    cy.getBySel('appointment-dialog-denial-reasons')
      .find('[type="radio"]')
      .first()
      .check({ force: true });

    setupGQLIntercepts([
      {
        name: 'UpdateInPersonAppointmentConfirmationStatus',
        fixture: 'updateInPersonAppointmentConfirmationStatusToDeclined.json',
        isQuery: false,
      },
      {
        name: 'InPersonAppointmentDetails',
        fixture: 'inPersonAppointmentDeclined.json',
      },
    ]);

    cy.getBySel('appointment-dialog-denial-button').click();

    cy.wait([
      '@gqlUpdateInPersonAppointmentConfirmationStatusMutation',
      '@gqlInPersonAppointmentDetailsQuery',
    ]).then(([updateInPersonAppointmentConfirmationStatus]) => {
      expect(
        updateInPersonAppointmentConfirmationStatus.request.body.variables.input
          .appointmentId
      ).to.equal('1');

      expect(
        updateInPersonAppointmentConfirmationStatus.request.body.variables.input
          .confirmationStatus
      ).to.equal('denied');

      expect(
        updateInPersonAppointmentConfirmationStatus.request.body.variables.input
          .denialReason
      ).to.equal('insurance');
    });

    cy.contains('Appointment request declined');
    cy.contains('Declined Appointment Request');
    cy.getBySel('in-person-appt-details')
      .find('input')
      .should('have.value', 'Declined');
  });

  it('Declines an appointment with an existing patient with a custom explanation', () => {
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
        name: 'InPersonAppointmentDetails',
        fixture: 'inPersonAppointmentDetailsRequestWithContact.json',
      },
      {
        name: 'PatientDetails',
        fixture: 'matchedPatientDetails.json',
      },
      {
        name: 'CompanyBookingFlow',
        fixture: 'companyBookingFlow.json',
      },
      {
        name: 'FacilityBookingFlow',
        fixture: 'facilityBookingFlow.json',
      },
      {
        name: 'FacilityIntegrationDetails',
        fixture: 'facilityIntegrationDetails.json',
      },
      {
        name: 'FacilitySMSParticipation',
        fixture: 'facilitySmsParticipation.json',
      },
    ]);

    cy.visit('/appointments/in-person/details/1');

    cy.wait([
      '@loginUser',
      '@gqlMeQuery',
      '@gqlMeForProfileCheckQuery',
      '@gqlPendingAppointmentsQuery',
      '@gqlPendingVideoAppointmentsQuery',
      '@gqlCompanyBillingOverviewQuery',
      '@gqlInPersonAppointmentDetailsQuery',
      '@gqlPatientDetailsQuery',
      '@gqlCompanyBookingFlowQuery',
    ]);

    cy.contains('REQUEST').click();
    cy.get('[type="radio"]').last().click({ force: true });

    cy.contains('CONTINUE').click({ force: true });

    cy.contains('Decline Appointment Request');

    cy.getBySel('appointment-dialog-denial-reasons')
      .find('[type="radio"]')
      .last()
      .check({ force: true });

    cy.getBySel('custom-denial-reason').find('input').type('custom reason');

    setupGQLIntercepts([
      {
        name: 'UpdateInPersonAppointmentConfirmationStatus',
        fixture:
          'updateInPersonAppointmentConfirmationStatusToDeclinedWithCustomReason.json',
        isQuery: false,
      },
      {
        name: 'InPersonAppointmentDetails',
        fixture: 'inPersonAppointmentDeclinedWithCustomReason.json',
      },
    ]);

    cy.getBySel('appointment-dialog-denial-button').click();

    cy.wait([
      '@gqlUpdateInPersonAppointmentConfirmationStatusMutation',
      '@gqlInPersonAppointmentDetailsQuery',
    ]).then(([updateInPersonAppointmentConfirmationStatus]) => {
      expect(
        updateInPersonAppointmentConfirmationStatus.request.body.variables.input
          .appointmentId
      ).to.equal('1');

      expect(
        updateInPersonAppointmentConfirmationStatus.request.body.variables.input
          .confirmationStatus
      ).to.equal('denied');

      expect(
        updateInPersonAppointmentConfirmationStatus.request.body.variables.input
          .denialReason
      ).to.equal('other');

      expect(
        updateInPersonAppointmentConfirmationStatus.request.body.variables.input
          .denialExplanation
      ).to.equal('custom reason');
    });

    cy.contains('Appointment request declined');
    cy.contains('Declined Appointment Request');
    cy.getBySel('in-person-appt-details')
      .find('input')
      .should('have.value', 'Declined');
  });
});
