describe('Alerts', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('#popup-alerts').invoke('removeAttr', 'target').click({force: true});
    })
    it('Js alerts', () => {
        cy.get('#button1').click();
        cy.on('window:alert',(str)=>{
            expect(str).to.equal('I am an alert box!')
        })
        
    });

    it('Js alert with confirmation buttons', () => {
        cy.get('#button4').click(); //cypress will click the ok button
        cy.on('window.confirm', () => {
            return true;
        })
        cy.get('#confirm-alert-text').should('have.text', 'You pressed OK!');

       

    });

    it('Pressing cancel', () => {
        cy.get('#button4').click(); 
        cy.on('window.confirm', (str) => {
            return false;
        })
        cy.get('#confirm-alert-text').contains('You pressed Cancel!');
    });

    it.only('Alerts with STUBS', () => {
        const stub = cy.stub();
        cy.on('window:confirm', stub);
        cy.get('#button4').click().then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Press a button!')
        }).then(() => {
            return true;
        }).then(() => {
            cy.get('#confirm-alert-text').should('have.text', 'You pressed OK!');
        }); 
    });


});