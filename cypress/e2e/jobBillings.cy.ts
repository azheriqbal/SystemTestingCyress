

describe('Job Level Billings', () => {
    before(function () {
      cy.login();
      cy.contains('Configurations').click();
      cy.contains('Billing - Jobs').click();
    });
  
    it('Add Job billings',function  () {


      cy.contains('Hire Fee');
      cy.contains('Cancellation Fee');
      cy.contains('Retention Fee');
      cy.get('.ant-space-item > .ant-btn').click();
      cy.contains('Jobs New Configuration');
      cy.get('#name').should('have.attr', 'aria-required','true');
      cy.get('#name').type('Test Billings');
      cy.get('#type').should('have.attr', 'aria-required','true');
      cy.get('#type').type('One Time').type('{enter}');
      cy.get('#isAssignable').check();
      cy.get('.ant-modal-footer > .ant-btn-primary').click(); // Click the "Add" button 
      cy.contains('Test Billings');

      
    });

  });