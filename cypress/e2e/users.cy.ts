describe("Users Test", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/user");
    cy.wait(6000);
  });

  it("should display the users page correctly", () => {
    cy.get("h5").should("contain", "Users");
    cy.get("table").should("be.visible");
  });

  it("should user status update", () => {
    cy.demoPause();
    cy.contains(".tooltip-text", "Status").prev().click();
    cy.get('[data-test="modal-submit"]').click();
    cy.contains(/User profile is (activated|deactivated)/).should("be.visible");
  });

  it("should display the user details page correctly", () => {
    cy.demoPause();
    cy.contains(".tooltip-text", "View").prev().click();
    cy.url().should("match", /\/user\/view\/[a-zA-Z0-9]+/);
    cy.get("h5").should("contain", "View User Profile");
    cy.get("table").should("be.visible");
    cy.demoPause();
  });
});
