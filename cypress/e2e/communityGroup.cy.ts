import { faker } from "@faker-js/faker";

describe("Community Group Test", () => {
  const title = faker.lorem.words(3);
  const description = faker.lorem.sentence();
  const updatedTitle = faker.lorem.words(3);
  const updatedDescription = faker.lorem.sentence();

  beforeEach(() => {
    cy.login();
    cy.visit("/community-group");
    cy.wait(6000);
  });

  it("should display the community group page correctly", () => {
    cy.get("h5").should("contain", "Community Groups");
    cy.get("table").should("be.visible");
  });

  it("should show validation errors when fields are empty", () => {
    cy.get('[data-test="button-new"]').click();
    cy.get('[data-test="modal-submit"]').click();
    cy.contains("Title is required").should("be.visible");
    cy.contains("Description is required").should("be.visible");
    cy.contains("Domain is required").should("be.visible");
  });

  it("should create a new community group", () => {
    cy.get('[data-test="button-new"]').click();
    cy.get('[data-test="input-title"]').type(title);
    cy.get('[data-test="input-description"]').type(description);
    cy.selectDropdownByLabel("Domain");
    cy.get('[data-test="modal-submit"]').click();
    cy.contains("Community is added successfully").should("be.visible");
  });

  it("should edit community group", () => {
    cy.contains(".tooltip-text", "Edit").prev().click();
    cy.get('[data-test="input-title"]').clear().type(updatedTitle);
    cy.get('[data-test="input-description"]').clear().type(updatedDescription);
    cy.selectDropdownByLabel("Domain");
    cy.get('[data-test="modal-submit"]').click();
    cy.contains("Community is updated successfully").should("be.visible");
  });

  it("should community status update", () => {
    cy.demoPause();
    cy.contains(".tooltip-text", "Status").prev().click();
    cy.get('[data-test="modal-submit"]').click();
    cy.contains(/Community is (activated|deactivated)/).should("be.visible");
  });

  it("should navigate from community group to user list to user details", () => {
    cy.demoPause();
    cy.contains(".tooltip-text", "View").prev().click();
    cy.url().should("match", /\/community-group\/users\/[a-zA-Z0-9]+/);
    cy.get("h5")
      .invoke("text")
      .should("match", /.*\'s User List$/);
    cy.get("table").should("be.visible");
    cy.demoPause();

    cy.contains(".tooltip-text", "View").prev().click();
    cy.url().should("match", /\/user\/view\/[a-zA-Z0-9]+/);
    cy.get("h5").should("contain", "View User Profile");
    cy.get("table").should("be.visible");

    cy.go("back");
    cy.wait(1000);

    cy.contains(".tooltip-text", "Remove").prev().click();
    cy.get('[data-test="modal-submit"]').click();
    cy.contains("User removed from community successfully").should(
      "be.visible"
    );
  });
});
