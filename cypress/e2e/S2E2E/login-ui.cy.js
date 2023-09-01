const { faker } = require('@faker-js/faker');


describe('Login Page', () => {

  beforeEach(()=>{
    cy.visit('/');
  });

  it('Should Validate the User Inputs and Page render', () => {
    //Verifying the login page render and its title
    cy.location('pathname').should('eq', '/login'); 
    cy.title("Login");

    //Validating the Email input field
    cy.getDataCy("email-input")
      .find("input")
      .should("have.attr","aria-required", "true")
      .and("have.attr", "placeholder", "Email");
    cy.get('#loginForm_email').type("test").clear();
    cy.get('#loginForm_email_help').should("have.text","Please input your Email!")

    //Validating the Email input field
    cy.getDataCy("password-input")
      .find("input")
      .should("have.attr","aria-required", "true")
      .and("have.attr", "placeholder", "Password");
    cy.get('#loginForm_password').type("132564").clear();
    cy.get('#loginForm_password_help').should("have.text","Please input your password!");

    //Checking and uncheckig the rememberMe checkbox
    cy.get("#loginForm_remember").uncheck().check();
  
    //Checking the forgetpassword link
    cy.getDataCy("forget-password-link").should("be.visible");

    //Validating the login button
    cy.getDataCy("login-button").contains("Login").should("not.have.attr", "ant-click-animating-without-extra-node");
    })

    it('Should not Allow to Land on HomePage with Invlalid Credentials', () => {
      cy.login(faker.internet.email(), faker.internet.password())
      cy.contains("The selected email is invalid.");
    });

    it('Should Allow to Land on HomePage with Valid Credentials and Logout', () => {
      cy.login(Cypress.env("email"), Cypress.env("password"));
      cy.location('pathname').should('eq', '/');
      cy.contains("Dashboard");
      cy.go("back")
      cy.location('pathname').should('eq', '/');
      cy.wait(5000)
      cy.get('.ant-dropdown-trigger.sider_siderProfile__3dwi2.siderProfile').click();
      cy.contains('Log Out').click();
      cy.location('pathname').should('not.eq', '/');
      
    });
})