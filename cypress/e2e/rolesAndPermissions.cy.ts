

describe('Commission Plans', () => {
     
    it('Creating commission Plans',function  () {

      //Login and navigation to the commission plan tab
      cy.login();
      cy.contains('Configurations').click();
      cy.contains('Roles & Permissions').click();
  
      //Verifying the Headings
      cy.log('Verifying the Headings');
      cy.contains('Roles & Permissions'); 
      cy.contains('Super Admin');
      cy.contains('Client Service Leader');
      cy.contains('Account Manager');
      cy.contains('Hiring Manager');
      cy.contains('Recruiter');
      cy.contains('Information Technology');

      cy.contains('Add New').click();
      cy.contains('Create New Roles & Permissions')
      

      cy.contains('Save').should('be.disabled');
      cy.get('#name').should('have.attr', 'aria-required','true');
      cy.get('#name').type('Test Role and Permission');

      cy.get('[title="Clients - Can Create Client"] > .ant-checkbox-wrapper').find('input').check();
      cy.get('[title="Configurations - View Billing Clients"] > .ant-checkbox-wrapper').find('input').check();
      cy.get('.ant-transfer-operation > .ant-btn').click();
      cy.task("log", "hello World");
      cy.contains('Save').click();
    });

  });