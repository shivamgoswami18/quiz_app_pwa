describe("Login Test", () => {
  const email = Cypress.env("email");
  const password = Cypress.env("password");

  beforeEach(() => {
    cy.visit(Cypress.env("baseUrl"));
  });

  it("should show validation errors when inputs are empty", () => {
    cy.demoPause();
    cy.get('[data-test="button-sign-in"]').click();
    cy.demoPause();
    cy.contains("Email is required").should("be.visible");
    cy.contains("Password is required").should("be.visible");
  });


  it("Should login successfully", () => {
    cy.get('[data-test="input-email"]').type(email);
    cy.get('[data-test="input-password"]').type(password);
    cy.demoPause();
    cy.get('[data-test="button-sign-in"]').click();

    cy.url().should("include", "/dashboard");
  });
});
