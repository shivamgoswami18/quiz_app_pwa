import { faker } from "@faker-js/faker";

describe("Leaderboard Test", () => {
  const title = faker.lorem.words(3);
  const updatedTitle = faker.lorem.words(3);
  const startDate = faker.date.past().toISOString().slice(0, 16);
  const endDate = faker.date.future().toISOString().slice(0, 16);

  beforeEach(() => {
    cy.login();
    cy.visit("/tournament");
    cy.wait(6000);
  });

  it("should display the tournament page correctly", () => {
    cy.get("h5").should("contain", "Tournaments");
    cy.get("table").should("be.visible");
  });

  it("should show validation errors", () => {
    cy.get('[data-test="button-new"]').click();
    cy.url().should("include", "/tournament/add");
    cy.get('[data-test="button-save-&-next"]').click();
    cy.contains("Title is required").should("be.visible");
    cy.contains("Start date and time is required").should("be.visible");
    cy.contains("End date and time is required").should("be.visible");
    cy.contains("Please select at least one domain").should("be.visible");
    cy.contains("Tournament image is required").should("be.visible");
  });

  it("should create a new Tournament", () => {
    cy.get('[data-test="button-new"]').click();
    cy.url().should("include", "/tournament/add");
    cy.get('[data-test="input-title"]').type(title);
    cy.get('[data-test="input-startDate"]').type(startDate);
    cy.get('[data-test="input-startDate"]').should("have.value", startDate);
    cy.get('[data-test="input-endDate"]').type(endDate);
    cy.get('[data-test="input-endDate"]').should("have.value", endDate);
    cy.selectDropdownByLabel("Domains", 9);
    const imagePath = "./src/assets/images/bg-auth.jpg";
    cy.get('label[for="tournamentImage"]').selectFile(imagePath);
    cy.get('[data-test="button-save-&-next"]').click();
    cy.url().should("match", /\/tournament\/tournamentQuiz/);
    cy.get(".accordion-item").first().find(".accordion-button").click();
    cy.get("#checkbox-0").check();
    cy.get("#checkbox-0").should("be.checked");
    cy.get('[data-test="button-save-as-draft"]').click();
    cy.contains("Tournament quizzes is updated successfully").should(
      "be.visible"
    );
  });

  it("should create edit a Tournament", () => {
    cy.contains(".tooltip-text", "Edit").prev().click();
    cy.url().should("match", /\/tournament\/edit\/[a-zA-Z0-9]+/);
    cy.get('[data-test="input-title"]').clear().type(updatedTitle);
    cy.get('[data-test="input-startDate"]').type(startDate);
    cy.get('[data-test="input-startDate"]').should("have.value", startDate);
    cy.get('[data-test="input-endDate"]').type(endDate);
    cy.get('[data-test="input-endDate"]').should("have.value", endDate);
    cy.get('[data-test="button-save-&-next"]').click();
    cy.url().should("match", /\/tournament\/tournamentQuiz/);
    cy.get(".accordion-item").first().find(".accordion-button").click();
    cy.get("#checkbox-0").uncheck();
    cy.get("#checkbox-0").should("not.be.checked");
    cy.get('[data-test="button-save-as-draft"]').click();
    cy.contains(
      /(Tournament quizzes is updated successfully|Please select at least one quiz)/
    ).should("be.visible");
  });

  it("should tournament status update", () => {
    cy.demoPause();
    cy.contains(".tooltip-text", "Status").prev().click();
    cy.get('[data-test="modal-submit"]').click();
    cy.contains("Tournament status is updated successfully").should(
      "be.visible"
    );
  });

  it("should navigate from view tournament to see the tournament details", () => {
    cy.demoPause();
    cy.contains(".tooltip-text", "View").prev().click();
    cy.url().should("match", /\/tournament\/view\/[a-zA-Z0-9]+/);
  });
});
