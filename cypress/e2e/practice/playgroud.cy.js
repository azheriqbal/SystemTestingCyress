describe('Xhr request', ()=> {

    beforeEach(()=>{
        cy.visit('/');
        cy.login(Cypress.env("email"), Cypress.env("password"))
    });

    it.skip('Xhr GET', () => {
        cy.intercept('GET', '**/comments/*').as('getComment')

        cy.contains("a href").contains("/clients").click();
        cy.wait('@getComment').its('response.statusCode').should('be.oneOf', [200, 304])

    });
    

    it('Mocking Xhr GET', () => {
        cy.intercept('GET', 'https://dev-bend.source2.link/api/clients',{ body:{
            
        "message": "Data found.",
        "data": [
            {
                "id": 1,
                "name": "Test",
                "address": "LHR",
                "website": "https:\/\/www.mock.com.au",
                "swimlane_list_id": null,
                "original_contract_date": "2023-06-23 00:00:00",
                "recruitment_started_date": "2023-06-23 00:00:00",
                "ats_id": 1,
                "ownership_id": null,
                "paradox": "Yes",
                "is_block": 0,
                "client_leader_id": 6,
                "director_id": 1,
                "client_service_manager_id": 6,
                "client_success_leader_id": 6,
                "exclusivity": "No",
                "stage_id": 1,
                "reporting_schedule_id": 1,
                "created_at": "2023-06-23T11:08:37.000000Z",
                "updated_at": "2023-06-23T11:08:37.000000Z",
                "account_managers": [
                    {
                        "id": 6,
                        "name": "Azher Iqbal",
                        "pivot": {
                            "clients_id": 1,
                            "manager_id": 6
                        }
                    }
                ],
                "contacts": [
                    {
                        "id": 1,
                        "name": "Zachery Snow",
                        "phone_number": "(136) 755-6494",
                        "email": "korujy@mailinator.com",
                        "job_title": "Facilis in illo veli",
                        "created_at": "2023-06-23T11:06:09.000000Z",
                        "updated_at": "2023-06-23T11:06:09.000000Z",
                        "phone_ext": "657",
                        "pivot": {
                            "clients_id": 1,
                            "contacts_id": 1
                        }
                    }
                ],
                "client_leader": {
                    "id": 6,
                    "name": "Azher Iqbal"
                },
                "ats": {
                    "id": 1,
                    "name": "BrightMove"
                },
                "stage": {
                    "id": 1,
                    "name": "Implementation"
                }
            }
        ]
              
        }}).as('getClient')

        cy.wait(10000)
        // cy.get("a href").contains("/clients").click();
        cy.get('.ant-menu-item').contains('Clients').click()
        cy.wait('@getClient').its('response.statusCode').should('be.oneOf', [200, 304])

    });

})


//expect(response.statusCode).to.equal(200);



