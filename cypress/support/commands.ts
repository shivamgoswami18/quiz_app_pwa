/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommancdOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
import { faker } from "@faker-js/faker";

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
      demoPause(enabled?: boolean): Chainable<void>;
      fillOptions(numOptions: number): Chainable<void>;
      selectDropdownByLabel(labelText: string, optionIndex?: number): Chainable<void>;
      answerOption(): Chainable<number>;
    }
  }
}

Cypress.Commands.add("login", () => {
  cy.session(
    "user-session",
    () => {
      cy.visit(Cypress.env("baseUrl"));
      const email = Cypress.env("email");
      const password = Cypress.env("password");

      cy.get('[data-test="input-email"]').type(email);
      cy.get('[data-test="input-password"]').type(password);
      cy.get('[data-test="button-sign-in"]').click();

      cy.url().should("include", "/dashboard");
      cy.get(".header-profile-user", { timeout: 10000 }).should("be.visible");

    },
    {
      validate: () => {
        cy.window().its("sessionStorage.token").should("exist");
      },
    }
  );
});

Cypress.Commands.add("demoPause", (enabled = Cypress.env("demoMode")) => {
  if (enabled) {
    cy.wait(1000);
  }
});

Cypress.Commands.add("answerOption", () => {
  const randomChoice = Math.random() < 0.5 ? 2 : 4;
  return cy.wrap(randomChoice);
});
Cypress.Commands.add("fillOptions", (numOptions: number) => {
  const fakeOption = faker.word.words(2);

  for (let i = 1; i <= numOptions; i++) {
    cy.get(`input[name="option${i}"]`).type(fakeOption);
  }

  const randomOption = Math.floor(Math.random() * numOptions) + 1;
  cy.get(`input[name="correctOption"][value="option${randomOption}"]`).click();
});

Cypress.Commands.add("selectDropdownByLabel", (labelText: string, optionIndex: number = 0) => {
  cy.contains("label", labelText).parent().find("input").first().click();
  cy.get(`[id^="react-select-"][id$="-option-${optionIndex}"]`).click();
});