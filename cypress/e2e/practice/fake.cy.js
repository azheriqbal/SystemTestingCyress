const { faker } = require('@faker-js/faker');
/// <reference types="Cypress" />



describe('Fake Data Test', () => {
  it('should generate and log fake data', () => {
    // Name
    const firstName = faker.lastName
    const lastName = faker.name.lastName();

    // Internet
    const email = faker.internet.email();
    const userName = faker.internet.userName();
    const url = faker.internet.url();
    const password = faker.internet.password();

    // Address
    const city = faker.address.cityName();
    const state = faker.address.state();
    const country = faker.address.country();
    const streetAddress = faker.address.streetAddress();
    const zipCode = faker.address.zipCode();

    // Date
    const pastDate = faker.date.past().toISOString().split('T')[0];
    const futureDate = faker.date.future().toISOString().split('T')[0];

    // Lorem
    const sentence = faker.lorem.sentence();
    const paragraphs = faker.lorem.paragraphs();

    // Random
    // const randomNumber = faker.random.number();
    // const randomBoolean = faker.random.boolean();
    // const randomUUID = faker.random.uuid();
    // const randomAlphaNumeric = faker.random.alphaNumeric(10);

    // Finance
    const creditCardNumber = faker.finance.creditCardNumber();
    const currencyCode = faker.finance.currencyCode();
    const currencyName = faker.finance.currencyName();
    const currencySymbol = faker.finance.currencySymbol();
    const bitcoinAddress = faker.finance.bitcoinAddress();
    const ethereumAddress = faker.finance.ethereumAddress();
    const iban = faker.finance.iban();

    // Color
    const colorHex = faker.internet.color();
    const colorRGB = faker.internet.color(true);

    // Log the generated fake data
    cy.log('Name:', firstName, lastName);
    cy.log('Email:', email);
    cy.log('Username:', userName);
    cy.log('URL:', url);
    cy.log('Password:', password);
    cy.log('City:', city);
    cy.log('State:', state);
    cy.log('Country:', country);
    cy.log('Street Address:', streetAddress);
    cy.log('Zip Code:', zipCode);
    cy.log('Past Date:', pastDate);
    cy.log('Future Date:', futureDate);
    cy.log('Sentence:', sentence);
    cy.log('Paragraphs:', paragraphs);
    // cy.log('Random Number:', randomNumber);
    // cy.log('Random Boolean:', randomBoolean);
    // cy.log('Random UUID:', randomUUID);
    // cy.log('Random Alphanumeric:', randomAlphaNumeric);
    cy.log('Credit Card Number:', creditCardNumber);
    cy.log('Currency Code:', currencyCode);
    cy.log('Currency Name:', currencyName);
    cy.log('Currency Symbol:', currencySymbol);
    cy.log('Bitcoin Address:', bitcoinAddress);
    cy.log('Ethereum Address:', ethereumAddress);
    cy.log('IBAN:', iban);
    cy.log('Color Hex:', colorHex);
    cy.log('Color RGB:', colorRGB);
  });
});
