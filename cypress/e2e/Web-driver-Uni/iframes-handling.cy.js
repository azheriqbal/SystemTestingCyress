
describe('IFRAMES', () => {
    it('Testing the iframes', () => {
        cy.visit('http://www.webdriveruniversity.com');
        cy.get('#iframe').invoke('removeAttr', 'target').click({force: true});
        cy.get('#frame').then($iframe => {
            const body = $iframe.contents().find('body'); //get the body and Wrap it
            cy.wrap(body).as('iframe');
        })

        cy.get('@iframe').find('#button-find-out-more').click();

        cy.get('@iframe').find('#myModal').as('modal')

        cy.get('@modal').should(($expectText) => {
            const text = $expectText.text();
            expect(text).to.include('Welcome to webdriveruniversity.com we sell a wide range of electrical goods');
        })
        cy.get('@modal').contains('Close').click();

    });
});