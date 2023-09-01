
const { faker } = require('@faker-js/faker');

describe('login on Qa', () => {
    beforeEach(() => {
        cy.loginQA();
    });
    it('login and add candidate', () => {
        
        cy.visit('https://qa.source2.link/clients/10/job/246')
        // cy.get('#loginForm_email').type('azher.iqbal@codedistrict.com');
        // cy.get('#loginForm_password').type('12345678');
        // cy.get('.ant-btn').click();
        // cy.wait(3000)
        // cy.get('.ant-menu-title-content').contains('Clients').click();
        // cy.get('.ag-row-last > [aria-colindex="2"]').click();
        // cy.get('#rc-tabs-1-tab-jobs').click();
        // cy.get('.ag-row-even > [aria-colindex="2"]').click();


        // cy.scrollTo('bottom');
        // cy.contains('View Activity').scrollTo('left')


        // for (let i = 1; i <= 10; i++) {
        //     const rowindexValue = 5 + i;
        //     const selector = `[aria-rowindex="${rowindexValue}"] > [aria-colindex="8"] > .ant-btn > span`;
          
        //     cy.get(selector).click(); // Or perform any other action you want with the element
        //   }
          
        for(let i = 0; i <30; i++) {
        cy.get('.clientsJob_addCandidateModal__2aGIw > .ant-btn').click();


        cy.get("#hireType").type('Sourced Hire{enter}');
    
        cy.get('.ant-form-item-control-input-content > .ant-input-group-wrapper > .ant-input-wrapper > .ant-input-group-addon').click();
    
        cy.get("#firstName").type(faker.name.firstName());
    
        cy.get("#lastName").type(faker.name.lastName());
       
        cy.get("#candidateStatusesId").type('Active{enter}');
    
        cy.get("#candidateJobRecruiters").click().type('alex{enter}');
        cy.get('#sourceId').click().type('fr{enter}');
    
        cy.get("#initialStatus").type('pro{enter}')
    
        cy.get("#sourcedDate").click().type('08-02-2023{enter}');
    
        cy.get("#interviewConfirmation").check();
        cy.get('.clientsJob_candidateSubmitButton__3lcqu').click();

        cy.wait(2000)
        }

    });

});