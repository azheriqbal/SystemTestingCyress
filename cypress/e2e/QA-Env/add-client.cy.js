const { faker } = require('@faker-js/faker');

describe('Add New Client', () => {
    beforeEach( () => {
        cy.loginQA();

    });
    it('Should add new client', () => {
        cy.intercept('GET','https://qa-bend.source2.link/api/clients').as('api');
        cy.visit('https://qa.source2.link/clients')
        cy.wait('@api');
        // cy.get('a > .ant-btn').click();

        // cy.get('#name').type(faker.company.name());

        // // Select a date for Original Contract Date
        // cy.get('#originalContractDate').type(faker.date.recent());
        // // Assuming you want to select today's date, you can replace 'today' with the desired date
        // // cy.get('.ant-picker-today').click();
    
        // // Fill out the Corporate Address field
        // cy.get('#address').type(faker.address.cityName());
    
        // // Fill out the Website field
        // cy.get('#url').type(faker.internet.url());
    
        // // Select an option for ATS
        // cy.get('#atsId').type('ATS Option 1');
        // // Assuming 'ATS Option 1' is the desired option from the dropdown
        // cy.contains('.ant-select-item-option', 'ATS Option 1').click();
    
        // // Select an option for Ownership
        // cy.get('#ownershipId').type('Ownership Option 2');
        // // Assuming 'Ownership Option 2' is the desired option from the dropdown
        // cy.contains('.ant-select-item-option', 'Ownership Option 2').click();
    
        // // Select an option for Olivia/Paradox
        // cy.get('#paradox').type('Paradox Option 1');
        // // Assuming 'Paradox Option 1' is the desired option from the dropdown
        // cy.contains('.ant-select-item-option', 'Paradox Option 1').click();
    
        // // Select an option for Client Service Leader
        // cy.get('#clientLeaderId').type('Client Leader Option 1');
        // // Assuming 'Client Leader Option 1' is the desired option from the dropdown
        // cy.contains('.ant-select-item-option', 'Client Leader Option 1').click();
    
        // // Click on the Submit button (assuming there's a submit button in your form)
        // cy.get('button[type="submit"]').click();
    });
});