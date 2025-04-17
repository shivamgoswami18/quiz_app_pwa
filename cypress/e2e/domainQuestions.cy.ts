import { faker } from "@faker-js/faker";

describe("Quiz Domain Test", () => {

  beforeEach(() => {
    cy.login();
    cy.visit("/domain-question");
    cy.wait(600);
  });

  it("should display the Domain Questions page correctly", () => {
    cy.get("h5").should("contain", "Domain Questions");
    cy.get("table").should("be.visible");
    cy.demoPause();
  });

  it("should create a new Domain Question and handle radio selection with inputs", () => {
    cy.demoPause();
    cy.get('[data-test="button-new"]').click();
    cy.contains("label", "Domain").parent().find("input").first().click();
    cy.get("#react-select-3-option-0").should("be.visible").click();
    cy.demoPause();
    cy.get('[data-test="modal-submit"]').click();

    cy.url().should("match", /\/[a-zA-Z0-9]+\/question\/add/);
    cy.demoPause();
    cy.get('[data-test="button-add"]').click();
    cy.get(".ck.ck-reset.ck-editor.ck-rounded-corners").should("exist");
    cy.get('.ck.ck-content[contenteditable="true"]').should("exist");
    
    cy.wait(1000); 
    cy.get(".ck-editor__editable").then((editable) => {
      const editor = editable[0].ckeditorInstance;
      if (editor) {
        editor.setData(faker.lorem.lines());
      } else {
        cy.log("CKEditor 5 instance not found.");
      }
    });

    cy.answerOption().then((randomChoice) => {
      cy.get(`#${randomChoice}`).click();
      cy.fillOptions(randomChoice);
    });
    cy.demoPause();
    cy.get('[data-test="modal-submit"]').click();
    cy.contains("Question is added successfully").should("be.visible");

    cy.get(".accordion-item").first().find(".accordion-button").click();
    cy.get(".accordion-item")
      .first()
      .find(".accordion-button")
      .parent()
      .find(".mdi-pencil")
      .click();
    cy.get('[data-test="modal-submit"]').click();
    cy.get(".accordion-item")
      .first()
      .find(".accordion-button")
      .parent()
      .find(".mdi-delete")
      .then(($btn) => {
        if (
          !$btn.hasClass("opacity-25") &&
          !$btn.hasClass("pointer-events-none")
        ) {
          cy.wrap($btn).click();
          cy.demoPause();
          cy.get('[data-test="modal-submit"]').click();
        } else {
          cy.log("Delete button is disabled");
        }
      });
  });

  it("should edit Domain Question and handle radio selection with inputs", () => {
    cy.demoPause();
    cy.get('[data-test="button-new"]').click();
    cy.demoPause();
    cy.contains("label", "Domain").parent().find("input").first().click();
    cy.get("#react-select-3-option-0").should("be.visible").click();
    cy.demoPause();
    cy.get('[data-test="modal-submit"]').click();
    cy.demoPause();
    cy.url().should("match", /\/[a-zA-Z0-9]+\/question\/add/);
    cy.get('[data-test="button-add"]').click();
    cy.get(".ck.ck-reset.ck-editor.ck-rounded-corners").should("exist");
    cy.get('.ck.ck-content[contenteditable="true"]').should("exist");

    cy.wait(1000);
    cy.get(".ck-editor__editable").then((editable) => {
      const editor = editable[0].ckeditorInstance;
      if (editor) {
        editor.setData(faker.lorem.sentences(2));
      } else {
        cy.log("CKEditor 5 instance not found.");
      }
    });
    
    cy.answerOption().then((randomChoice) => {
      cy.get(`#${randomChoice}`).click();
      cy.fillOptions(randomChoice);
    });
    cy.get('[data-test="modal-submit"]').click();
    cy.wait(3000);
    cy.get(".accordion-item").first().find(".accordion-button").click();
    cy.demoPause();
    cy.get(".accordion-item")
      .first()
      .find(".accordion-button")
      .parent()
      .find(".mdi-pencil")
      .click();
    cy.demoPause();
    cy.get('[data-test="modal-submit"]').click();
    cy.demoPause();
    cy.get(".accordion-item")
      .first()
      .find(".accordion-button")
      .parent()
      .find(".mdi-delete")
      .then(($btn) => {
        if (
          !$btn.hasClass("opacity-25") &&
          !$btn.hasClass("pointer-events-none")
        ) {
          cy.wrap($btn).click();
          cy.demoPause();
          cy.get('[data-test="modal-submit"]').click();
        } else {
          cy.log("Delete button is disabled");
        }
      });
    cy.demoPause();
  });
});