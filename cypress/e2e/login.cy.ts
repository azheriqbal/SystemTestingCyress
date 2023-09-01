
describe('Login Test', () => {
  beforeEach(() => {
    cy.fixture('loginData.json').as('loginData');
  });

  it('Login Test with valid credentials', function() {
    cy.visit('/login');
    cy.get('#loginForm_email').type(this.loginData.username);
    cy.get('#loginForm_password').type(this.loginData.password);
    cy.get('button[type="submit"]').click();
    cy.title().should('eq', 'Source2 - QA');
    cy.get('.ant-layout-sider-children > .ant-dropdown-trigger').click();
    cy.contains("Log Out").click();
  });

  it('Validations with invalid credentials', function() {
    cy.visit('/login');
    cy.get('button[type="submit"]').click();
    cy.contains('Please input your Email!');
    cy.contains('Please input your password!');
    cy.contains('Login');
    cy.get('#loginForm_email').type(this.loginData.username);
    cy.get('#loginForm_password').type(this.loginData.invalidPassword);
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid Username or Password');
  });

});



////select salary from employee order by salay desc limit 1 offset 4;
//select max(salay) from employee wheere salary < (select max(salay) from employee wheere salary)

