import { faker } from "@faker-js/faker";

describe("Fact Test", () => {
  const newFact = faker.lorem.words(2);
  const updatedFact = faker.lorem.words(3);
  const selectedDate = faker.date.future().toISOString().split("T")[0];

  beforeEach(() => {
    cy.login();
    cy.visit("/fact");
    cy.wait(6000);
  });

  it("should display the fact page correctly", () => {
    cy.get("h5").should("contain", "Fact");
    cy.get("table").should("be.visible");
  });

  it("should show validation errors when fields are empty", () => {
    cy.demoPause();
    cy.get('[data-test="button-new"]').click();
    cy.get('[data-test="modal-submit"]').click();
    cy.demoPause();
    cy.contains("Title is required").should("be.visible");
    cy.contains("Date is required").should("be.visible");
  });

  it("should create a new Fact", () => {
    cy.demoPause();
    cy.get('[data-test="button-new"]').click();
    cy.get('[data-test="input-title"]').type(newFact);
    cy.get('[data-test="input-date"]').type(selectedDate);
    cy.demoPause();
    cy.get('[data-test="modal-submit"]').click();
    cy.contains("Fact is added successfully").should("be.visible");
  });

  it("should not allow creating a Fact with the same date", () => {
    cy.demoPause();
    cy.get('[data-test="button-new"]').click();
    cy.get('[data-test="input-title"]').type(faker.lorem.words(2));
    cy.get('[data-test="input-date"]').type(selectedDate);
    cy.demoPause();
    cy.get('[data-test="modal-submit"]').click();
    cy.contains("Fact is already exist").should("be.visible");
  });

  it("should edit the existing Fact on the same date", () => {
    cy.demoPause();
    cy.contains(".tooltip-text", "Edit").prev().click();
    cy.get('[data-test="input-title"]').clear().type(updatedFact);
    cy.get('[data-test="input-date"]').clear().type(selectedDate);
    cy.demoPause();
    cy.get('[data-test="modal-submit"]').click();
    cy.contains("Fact is updated successfully").should("be.visible");
  });
});
