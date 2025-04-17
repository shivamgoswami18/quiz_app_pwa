import { faker } from "@faker-js/faker";

describe("Quiz Domain Test", () => {
  let title: string;
  let description: string;
  let updatedTitle: string;
  let updatedDescription: string;

  beforeEach(() => {
    cy.login();
    cy.visit("/knowledge-corner")
    cy.wait(6000);
  });

  before(() => {
    title = faker.lorem.words(3);
    description = faker.lorem.sentence();
    updatedTitle = faker.lorem.words(3);
    updatedDescription = faker.lorem.sentence();
  });

  it("should display the Knowledge Corner page correctly", () => {
    cy.get("h5").should("contain", "Knowledge Corner");
    cy.get("table").should("be.visible");
    cy.demoPause();
  });

  it("should show validation errors", () => {
    cy.demoPause();
    cy.get('[data-test="button-new"]').click();
    cy.url().should("include","/knowledge-corner/add");
    cy.get('[data-test="button-submit"]').click();
    cy.demoPause();
    cy.contains("Article title is required").should("be.visible");
    cy.contains("Article description is required").should("be.visible");
    cy.contains("Domain is required").should("be.visible");
  });

  it("should create a new Knowledge Corner", () => {
    cy.demoPause();
    cy.get('[data-test="button-new"]').click();
    cy.get('[data-test="input-title"]').type(title);
    cy.get('[data-test="input-description"]').type(description);
    cy.get('#react-select-3-input').click();

    cy.get(".css-1nmdiq5-menu div").first().click();
    cy.demoPause();
    cy.get('[data-test="button-submit"]').click();
  });

  it("should edit an existing Knowledge Corner", () => {
    cy.demoPause();
    cy.get("table tbody tr")
      .first()
      .within(() => {
        cy.contains(".tooltip-text", "Edit").prev().click();
      });

    cy.url().should("match", /\/knowledge-corner\/edit\/[a-zA-Z0-9]+/);

    cy.get('[data-test="input-title"]').clear().type(updatedTitle);
    cy.get('[data-test="input-description"]').clear().type(updatedDescription);
    cy.demoPause();
    cy.get('[data-test="button-update"]').click();

    cy.contains("Article is updated successfully").should("be.visible");
  });
  
  it("should view an existing Knowledge Corner", () => {
    cy.demoPause();
    cy.get("table tbody tr")
      .first()
      .within(() => {
        cy.contains(".tooltip-text", "View").prev().click();
      });

    cy.url().should("match", /\/knowledge-corner\/view\/[a-zA-Z0-9]+/);

    cy.get('[data-test="input-title"]').should("be.disabled");
    cy.get('[data-test="input-description"]').should("be.disabled");;

    cy.get('[data-test="button-update"]').should("be.disabled");
    cy.demoPause();

  });
  
  it("should change status of Knowledge Corner", () => {
    cy.get("table tbody tr")
      .first()
      .within(() => {
        cy.contains(".tooltip-text", "Status").prev().click();
      });
    cy.demoPause();
    cy.get('[data-test="modal-submit"]').click();
  });
  
  it("should delete an existing Knowledge Corner", () => {
    cy.get("table tbody tr")
      .first()
      .within(() => {
        cy.contains(".tooltip-text", "Delete").prev().click();
      });
    cy.demoPause();
    cy.get('[data-test="modal-submit"]').click();
  });
});
