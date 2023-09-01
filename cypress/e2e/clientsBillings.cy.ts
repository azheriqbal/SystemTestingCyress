describe('Client Level Billings', () => {
    before(function () {
      cy.fixture('lookups').then(function (data) {
        this.data = data
      })
      cy.login();
      cy.contains('Configurations').click();
      cy.contains('Billing - Clients').click();
    });
  
    it('Add client billings',function  () {
      cy.get('.ant-space-item > .ant-btn').click();
      cy.get('#name').should('have.attr', 'aria-required','true'); // Assert the "Name" field has the "required" attribute
      cy.get('#name').type("Local Market Recruiter");
      cy.get('#isAssignable').check(); // To check the checkbox
      cy.get('#isAssignable').uncheck();
      cy.get('#isAssignable').check(); // To check the checkbox
      cy.contains('Recursive'); // To check the
      cy.contains('Clients New Configuration');
      cy.get('.ant-modal-footer > .ant-btn-primary').click(); // Click the "Add" button  
    });
  });