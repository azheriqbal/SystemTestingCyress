import Password from "antd/lib/input/Password";


describe('Xhr request', ()=> {

    beforeEach(()=>{
        cy.visit('https://example.cypress.io/commands/network-requests')
    });

    it('Xhr GET', () => {
        cy.intercept('GET', '**/comments/*').as('getComment')

        cy.contains('Get Comment').click();
        cy.wait('@getComment').its('response.statusCode').should('be.oneOf', [200, 304])

    });

    it('Mocking Xhr GET', () => {
        cy.intercept('GET', '**/comments/*',{ body:{
            
                "postId": 1,
                "id": 1,
                "name": "Xhr Message",
                "email": "mockingtest@gardner.biz",
                "body": "Hello World"
              
        }}).as('getComment')

        cy.contains('Get Comment').click();
        cy.wait('@getComment').its('response.statusCode').should('be.oneOf', [200, 304])

    });

    it('intercept the post', () => {
        cy.intercept('POST', '/url', {status: 201}).as('post');
        cy.visit('/url');
        cy.get('button').click();
        cy.wait('@post');
        cy.contains('201');
    });

    it('intercept the post', () => {
        cy.intercept('POST', '/url*', {message: 'This user exists already'}).as('post');
        cy.visit('/url');
        cy.get('button').click();
        cy.wait('@post');
        cy.contains('This user exists already');
    });

    it('Should send request to the backend', () => {
        cy.request({
            //Request take the data as object
            method: 'POST',
            url: 'http://',
            body: {
                //This is the body object
                email: 'test@example.com',
                Password: 'password'
            }
        }).then(res=>{
            expect(res.status).to.equal(200);
        });
    });
})