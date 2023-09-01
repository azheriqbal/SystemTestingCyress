/// <reference types="cypress" />

// import { contains } from "cypress/types/jquery";

// import { parse } from "path";

// import { aliasQuery, hasOperationName } from '../support/utils';




describe('Login', () => {

    const serverId='9g5ys3mk'
    const serverDomain=`${serverId}.mailosaur.net`
    let random = Math.floor(Math.random() * 10000);
    const emailAd= `test-${random}@`+ serverDomain

    it('Sign up and confirms Email', () => {

       //Signing up
        cy.visit('/signup')
        cy.getBySel('signup-email-input')
        .type(emailAd,{ delay: 100 })
        cy.getBySel('signup-password-input')
        .type('Better123411!')
        cy.getBySel('signup-confirm-input')
        .type('Better123411!')
        cy.getBySel('signup-button')
        .click()

        //getting the confirmation code
        cy.mailosaurGetMessage(serverId,{
            sentTo: emailAd
        }).then(email => {
            let code=email.html.codes[0].value
            let kode = parseInt(code)
        //Entering the code
            cy
            .get('[placeholder="Enter your code"]')
            .type(kode, { delay: 100 })

            cy
            .get('button')
            .contains('Submit')
            .click()
        //Signing in with new email
            cy.getBySel('login-password')
            .type('Better123411!')
            cy.getBySel('login-button')
            .click()
            cy.wait(6000)
        //Accepting the Terms
            cy.get('[type="checkbox"]')
            .first().check()
            cy.get('[type="checkbox"]')
            .last().check()
            cy.wait(3000)
            cy.get('button').contains('CONTINUE')
            .trigger("mouseoverick").click({ force: true });
            cy.wait(2000)
            cy.contains('Welcome!')
            //Creating Company
            cy.get('button')
            .contains('GET STARTED').click()
            cy.url()
            .should('include', '/onboarding/company')
            cy.get('[placeholder="Enter your company name here"]')
            .type('Test-Company')
            cy.get('[placeholder="Enter the address for your company headquarters"]')
            .type('HQ test')
            cy.get('[placeholder="Enter your company HQ\'s city name"]')
            .type('Washington')
            cy.get('[placeholder="Enter zipcode"]')
            .type('44000')
            cy.get('[placeholder="Select a state"]')
            .select('AZ')
            cy.get('[placeholder="Enter your company HQ\'s contact phone number"]')
            .type('2345678999')
            cy.get('[placeholder="Enter your company HQ\'s contact email"]')
            .type('testmail@gmail.com')
            cy.get('[placeholder="Enter the URL of your company website (Optional)"]')
            .type('www.test.com')
            cy.get('[placeholder="Industry"]')
            .select('Renal Care')
            cy.get('button').contains('NEXT').click()


        //Creating account owner profile
            cy.url().should('include', '/onboarding/profile')
            cy.contains('Create your Account Owner Profile')
            cy.get('[placeholder="Enter your first name here"]')
            .type('Testing')
            cy.get('[placeholder="Enter your last name here"]')
            .type('Name')
            cy.get('select')
            .select('Male')
            cy.get('button')
            .contains('NEXT').click()

        //Entering the Card info
            cy.url()
            .should('include', '/onboarding/billing')
            cy.contains('Card Info')
            cy.get('[placeholder="Enter the cardholder\'s name (Required)"]')
            .type('Holder')
            cy.get('[placeholder="XXXX-XXXX-XXXX-XXXX (Required)"]')
            .type('4242424242424242')
            cy.get('[placeholder="MM/YYYY (Required)"]')
            .type('022023')
            cy.get('[placeholder="Enter CVV (Required)"]')
            .type('4242')
            cy.get('[placeholder="Enter the billing contact\'s email (Required)"]')
            .type('billing@gmail.com')
            cy.get('[placeholder="Enter first name (Required)"]')
            .type('Test')
            cy.get('[placeholder="Enter last name (Required)"]')
            .type('naming')
            cy.get('button').contains('NEXT').click()
            cy.wait(10000)
        //Finishing up
            cy.get('button').contains('SKIP AND FINISH UP').click() 
        })
    })
});