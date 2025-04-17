import { faker } from "@faker-js/faker";

describe("Quiz Domain Test", () => {
  let newQuizDomain: string;
  let updatedQuizDomain: string;

  beforeEach(() => {
    cy.login();
    cy.visit("/quiz-domain");
    cy.wait(6000);
  });

  before(() => {
    newQuizDomain = faker.lorem.words(2);
    updatedQuizDomain = faker.lorem.words(3);
  });

  it("should display the Quiz Domain page correctly", () => {
    cy.get("h5").should("contain", "Quiz Domain");
    cy.get("table").should("be.visible");
  });

  it("should create a new Quiz Domain", () => {
    cy.demoPause();
    cy.get('[data-test="button-new"]').click();
    cy.get('[data-test="modal-submit"]').click();
    cy.demoPause();
    cy.contains("Domain is required").should("be.visible");
  });

  it("should create a new Quiz Domain", () => {
    cy.demoPause();
    cy.get('[data-test="button-new"]').click();
    cy.get('[data-test="input-domain"]').type(newQuizDomain);
    cy.demoPause();
    cy.get('[data-test="modal-submit"]').click();
    cy.contains("Domain is added successfully").should("be.visible");
  });

  it("should edit an existing Quiz Domain", () => {
    cy.demoPause();
    cy.contains(".tooltip-text", "Edit").prev().click();
    cy.get('[data-test="input-domain"]').clear().type(updatedQuizDomain);
    cy.demoPause();
    cy.get('[data-test="modal-submit"]').click();
    cy.contains("Domain is updated successfully").should("be.visible");
  });
});
