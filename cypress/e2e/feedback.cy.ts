import { faker } from "@faker-js/faker";

describe("Feedback Test", () => {
  let feedback: string;

  beforeEach(() => {
    cy.login();
    cy.visit("/feedback")
    cy.wait(6000);
  });

  before(() => {
    feedback = faker.lorem.sentence();
  });

  it("should display the Feedback page correctly", () => {
    cy.get("h5").should("contain", "Feedback");
    cy.demoPause();
    cy.get('[data-test="button-view-details"]').first().click();
    cy.url().should("match", /\/feedback\/[a-zA-Z0-9]+/);
    cy.demoPause();
    cy.get("h5").should("contain", "Quiz Title Feedback");
  });

});