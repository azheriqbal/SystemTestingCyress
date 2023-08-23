describe('Env variables', () => {
    it('Should load the env variables', () => {
        cy.log(Cypress.env('first_Name'));
        cy.log(Cypress.env('last_Name'));

    });
});

// Override the env variables=> ./node_modules/.bin/cypress run --env first_Name=Tim --env last_Name=Jobny