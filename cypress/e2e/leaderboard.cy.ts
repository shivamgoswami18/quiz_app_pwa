describe("Leaderboard Test", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/leaderboard");
    cy.wait(6000);
  });

  it("should display the global leaderboard correctly", () => {
    cy.get("h5").should("contain", "Leaderboard");
    cy.get("table").should("be.visible");
  });

  it("should display domain wise leaderboard correctly", () => {
    cy.selectDropdownByLabel("Leaderboard Type", 1);
    cy.selectDropdownByLabel("Domain", 0);
    cy.get("h5").should("contain", "Leaderboard");
    cy.get("table").should("be.visible");
  });
});
