import { faker } from "@faker-js/faker";

describe("Change Password Test", () => {
  let shortPassword: string;
  let mismatchedPassword: string;
  let validPassword: string;
  let invalidFormatPassword: string;

  beforeEach(() => {
    cy.login();
    cy.wait(1000);
    cy.visit("/change-password");
  });

  before(() => {
    shortPassword = faker.internet.password({ length: 3 }); 
    mismatchedPassword = faker.internet.password({ length: 12 }); 
    validPassword = faker.internet.password({ length: 10, pattern: /[A-Za-z0-9@]/ }); 
    invalidFormatPassword = "abcdefgh";
  });

  it("should show validation errors when inputs are empty", () => {
    cy.demoPause();
    cy.get('[data-test="button-change-password"]').click();
    cy.contains("Current password is required").should("be.visible");
    cy.contains("New password is required").should("be.visible");
    cy.contains("Confirm new password is required").should("be.visible");
  });

  it("should show error when new password is too short", () => {
    cy.get('[data-test="input-currentPassword"]').type(Cypress.env("password"));
    cy.get('[data-test="input-newPassword"]').type(shortPassword);
    cy.get('[data-test="input-confirmPassword"]').type(shortPassword);
    cy.demoPause();
    cy.get('[data-test="button-change-password"]').click();
    cy.contains("Password should be at least 8 characters").should("be.visible");
    cy.demoPause();
  });

  it("should show error when new password is 8+ characters but does not meet complexity rules", () => {
    cy.get('[data-test="input-currentPassword"]').type(Cypress.env("password"));
    cy.get('[data-test="input-newPassword"]').type(invalidFormatPassword);
    cy.get('[data-test="input-confirmPassword"]').type(invalidFormatPassword);
    cy.demoPause();
    cy.get('[data-test="button-change-password"]').click();
    cy.contains(
      "Password should include eight characters, uppercase letter, lowercase letter, one number and one special character."
    ).should("be.visible");
    cy.demoPause();
  });
  it("should show error when confirm password does not match new password", () => {
    cy.get('[data-test="input-currentPassword"]').type(Cypress.env("password"));
    cy.get('[data-test="input-newPassword"]').type(validPassword);
    cy.get('[data-test="input-confirmPassword"]').type(mismatchedPassword);
    cy.demoPause();
    cy.get('[data-test="button-change-password"]').click();
    cy.contains("New password and confirm new password should be same").should(
      "be.visible"
    );
    cy.demoPause();
  });

  it("Should submit successfully", () => {
    cy.get('[data-test="input-currentPassword"]').type(Cypress.env("password"));
    cy.get('[data-test="input-newPassword"]').type(Cypress.env("password"));
    cy.get('[data-test="input-confirmPassword"]').type(Cypress.env("password"));
    cy.demoPause();
    cy.get('[data-test="button-change-password"]').click();
    cy.url().should("include", "/login");
  });
});
