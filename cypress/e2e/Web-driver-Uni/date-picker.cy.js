describe('Date Picker', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('#datepicker').invoke('removeAttr', 'target').click({force: true});
    })
    it.skip('Should pick the date', () => {
        
        
        // var dateCurrent = new Date();
        // dateCurrent.setDate(dateCurrent.getDate()); //get the current date
        // cy.log(dateCurrent.getDate());

        // var dateFuture = new Date();
        // dateFuture.setDate(dateFuture.getDate()+5);
        // cy.log(dateFuture.getDate());

        var date = new Date();
        date.setDate(date.getDate()+365);
        
        var fYear = date.getFullYear();

        var fMonth = date.toLocaleString('default', {month: 'long'});

        var fDay = date.getDay();

        cy.log(fYear,fMonth,fDay);

        function selectMonthandYear(){
            cy.get('.datepicker-dropdown').find('.datepicker-switch').first().then(currentDate=>{
                if(!currentDate.text().includes(fYear)){
                    cy.get('.next').first().click();
                    selectMonthandYear();
                }
            })
        }
    });
});