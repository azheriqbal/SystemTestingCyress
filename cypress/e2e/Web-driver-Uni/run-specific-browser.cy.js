describe('Different browser', () => {
    it('On the firefox', {browser: 'firefox'},() => {
        
    });

    it('On the chrome', {browser: 'chrome'}, () => {
        //logic
    });

    it('On the', {browser: 'chrome'}, () => {
        if(Cypress.isBrowser('firefox')) {
            //if we run the tests in firefox it will execute

        }else{
            
            //if we run the tests in any other browser it will not  execute

        }

    });
});