describe("POST /login", () => {

    it('Intercept by matching POST method', () => {
        cy.fixture('contact.json').then((contactDetails)=>{

            cy.intercept(
                'POST',
                'https://qa-bend.source2.link/api/contacts',contactDetails
                ).as('createContact')
        });
        cy.login();
        cy.contains('Configurations').click();
        cy.contains('Client Contacts').click();
        cy.get('.ag-row-first').should('have.length', 12)
        cy.contains('Create').click();
        cy.get('#name').type('text');
        cy.get('#email').type('text@gmail.com'); 
        cy.get('#phoneNumber').type('1234567089');
        cy.get('#phoneExt').type('12'); 
        cy.get('#jobTitle').type('text');
        cy.get('.ant-modal-footer > .ant-btn-primary').click();
        cy.wait('@createContact').then((xhr) => {
            // Assertions based on the blog post response
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200);
            expect(xhr.response.body.name).to.equal('Vera Fowler');
            expect(xhr.response.body.email).to.equal('cokonyx@mailinator.com');
            expect(xhr.response.body.phoneExt).to.equal('54');
            expect(xhr.response.body.jobTitle).to.equal('QA');


            // expect(xhr.responseBody.email).to.equal('John Doe');
            // // ... perform other assertions on the blog post data
          });
          
      })

  })



  

  
