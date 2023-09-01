describe("Post XHR", () => {
  beforeEach(() => {
    cy.login();

    cy.fixture("client-billings").as("client-billings");
  });

  it("Mock the post", () => {
    cy.get("@client-billings").then((data) => {
      cy.get("#name").type(data.name);
      cy.get("#password").type(data.password);
    });
    cy.intercept(
      {
        method: "GET",
        url: "https://dev-bend.source2.link/api/client-level-billing-type",
      },
      {
        body: { fixture: "client-billings" },
      }
    ).as("setBills");
    cy.visit("/configurations/billing-clients");
    cy.wait("@setBills");
    // cy.intercept({
    //     method:'POST',
    //     url: 'https://dev-bend.source2.link/api/client-level-billing-type/store',

    //     }).as('getBill');

    cy.intercept(
      {
        method: "POST",
        url: "https://dev-bend.source2.link/api/client-level-billing-type/store",
      },
      {
        message: "ClientLevelBillingType created successfully.",
        data: {
          name: "jhg",
          type: "RECURSIVE",
          is_assignable: false,
          has_markup: false,
          updated_at: "2023-08-01T11:01:29.000000Z",
          created_at: "2023-08-01T11:01:29.000000Z",
          id: 8,
        },
      }
    ).as("getBill");
    // cy.contains('Add New').click();
    // cy.get('#name').type('testbill');
    // cy.get('.ant-modal-footer > .ant-btn-primary').click();
    // cy.wait('@getBill').then((req, res) => {
    //     console.log(req);
    //     console.log(res);
    // })
  });
});

describe("Example Test", () => {
  it("should add two numbers using .wrap()", () => {
    // Call the add() function and store the result
    const result = add(2, 3);

    // Use .wrap() to turn the result into a Cypress subject
    cy.wrap(result).should("eq", 5);
  });
});
