import { AndroidFilled } from "@ant-design/icons";

describe(("Client Billing"), ()=>{
    before(()=>{
      cy.login();

    });

    it('Should Render and Validates on the client-billing page', () => {
        cy.visit("/configurations/billing-clients");
        cy.get('.ant-page-header-heading-title').should('have.text', 'Client Level Configuration');

        // Assert that the "Add New" button is present and has the text "Add New"
        cy.get('.ant-btn-primary')
          .should('exist')
          .should('have.text', 'Add New').click();
        // cy.get('button').contains("Add New").click();        
       
        cy.get('.ant-modal-content')
        .should('exist')
        .within(() => {
          // Assert the close button
          cy.get('.ant-modal-close')
            .should('exist')
            .should('have.attr', 'aria-label', 'Close');
      
          // Assert the modal title
          cy.get('.ant-modal-title')
            .should('exist')
            .should('have.text', 'Clients New Configuration');
      
          // Assert the form within the modal body
          cy.get('.ant-form')
            .should('exist')
            .within(() => {
              // Assert the input field
              cy.get('.ant-input')
                .should('exist')
                .should('have.attr', 'placeholder', 'Enter Name')
                .and('have.attr','aria-required', 'true');
      
              // Assert the Billing Type text
              cy.contains('Billing Type: Recursive')
                .should('exist');
      
              // Assert the checkbox
              cy.get('#isAssignable')
                .should('exist');
      
              // Assert the Is Assignable text
              cy.contains('Is Assignable')
                .should('exist');
            });
      
          // Assert the Cancel button in the footer
          cy.get('.ant-modal-footer')
            .should('exist')
            .find('.ant-btn-default')
            .should('exist')
            .should('have.text', 'Cancel');
      
          // Assert the Add button in the footer
          cy.get('.ant-modal-footer')
            .find('.ant-btn-primary')
            .should('exist')
            .should('have.text', 'Add');
        });

        cy.get('.ant-modal-content')
        .find('.ant-modal-close')
        .click()
        .should('not.have.class', 'ant-modal-content');
      

    });

    it('ser', () => {
        cy.visit("/configurations/billing-jobs");
    });
});