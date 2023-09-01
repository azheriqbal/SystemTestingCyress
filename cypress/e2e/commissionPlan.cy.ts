

describe('Commission Plans', () => {
     
    it('Creating commission Plans',function  () {

      //Login and navigation to the commission plan tab
      cy.login();
      cy.contains('Configurations').click();
      cy.contains('Commission Plans').click();
  
      //Verifying the Headings
      cy.log('Verifying the Headings');
      cy.contains('Commission Plans'); 
      cy.get('a > .ant-btn').click();
      cy.contains('Save').click();

      //Verifying the required validations
      cy.log('Verifying the required validations');
      cy.get('#planName').should('have.attr', 'aria-required','true');
      cy.get('#defaultBillingThreshold').should('have.attr', 'aria-required','true');
      cy.get('#appliedHire_value').should('have.attr', 'aria-required','true');
      cy.get('#sourceHired_value').should('have.attr', 'aria-required','true');
      cy.get('#referral_value').should('have.attr', 'aria-required','true');
      cy.get('#cancellations_value').should('have.attr', 'aria-required','true');
      cy.get('#hiringEvent_value').should('have.attr', 'aria-required','true');

      //Verifying the validation messages
      cy.log('Verifying the validation messages');
      cy.contains('Plan Name is required.'); 
      cy.contains('Default Billing is required.'); 
      cy.contains('Applied Hires is required.'); 
      cy.contains('Source Hired is required.'); 
      cy.contains('Referral is required.'); 
      cy.contains('Cancellations is required.'); 
      cy.contains('Hiring Event is required.'); 

      cy.log('Filling the commission details');
      cy.get('#planName').type('Commission Plan - 1');
      cy.get('#defaultBillingThreshold').type('150');
      // cy.get("div[id='appliedHiresSelectIdParent']").type('{downarrow}').type('{enter}'); // Click to open the dropdown
      cy.get('#appliedHire_value').type('75.75');
      cy.get('#sourceHired_value').type('12.45');
      cy.get('#referral_value').type('50');
      cy.get('#cancellations_value').type('30');
      cy.get('#hiringEvent_value').type('25.798');

      cy.log('Save plan');
      cy.contains('Save').click();
    });

  });