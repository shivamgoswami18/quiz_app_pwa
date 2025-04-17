import { faker } from "@faker-js/faker";

describe("Quizzes Test", () => {
  let title: string;
  let digit: string;

  beforeEach(() => {
    cy.login();
    cy.visit("/quizzes");
    cy.wait(100);
  });

  before(() => {
    title = faker.lorem.words(3);
    digit = faker.number.int().toString();
  });
  const startDate = faker.date.past().toISOString().slice(0, 16);
  const endDate = faker.date.future().toISOString().slice(0, 16);
  const randomTime = faker.date.future();
  const minutes = randomTime.getMinutes();
  const seconds = randomTime.getSeconds();

  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  it("should display the Quizzes page correctly", () => {
    cy.demoPause();
    cy.get("h5").should("contain", "Quiz");
    cy.get("table").should("be.visible");
  });

  it("should create a new Quiz", () => {
    cy.demoPause();
    cy.get('[data-test="button-new"]').click();
    cy.url().should("match", /\/quizzes\/add/);
    cy.demoPause();
    cy.get('[data-test="input-title"]').type(title);
    cy.get('[data-test="input-questions"]').type(digit);
    cy.get('[data-test="input-duration"]').clear().type(formattedTime);
    cy.get('[data-test="input-maximumParticipant"]').type(digit);
    cy.get('[data-test="input-startDate"]').type(startDate);
    cy.get('[data-test="input-startDate"]').should("have.value", startDate);
    cy.get('[data-test="input-endDate"]').type(endDate);
    cy.get('[data-test="input-endDate"]').should("have.value", endDate);
    cy.selectDropdownByLabel("Type");
    cy.selectDropdownByLabel("Domain");
    cy.selectDropdownByLabel("Difficulty Level");
    const imagePath = "./src/assets/images/bg-auth.jpg";
    cy.get('label[for="quizImage"]').selectFile(imagePath);
    cy.demoPause();
    cy.get('[data-test="button-save-&-next"]').click();
    cy.url().should("match", /\/quizzes\/quizQuestion/);
    cy.wait(6000);
    cy.get('[data-test="button-bonus"]').click();
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
    cy.demoPause();
    cy.get('[data-test="modal-submit"]').click();
    cy.contains("Quiz question is added successfully").should("be.visible");
  });

  it("should edit Quiz", () => {
    cy.demoPause();
    cy.wait(5000);

    cy.get("table thead th").each(($th, index: any) => {
      cy.wrap($th)
        .invoke("text")
        .then((text) => {
          if (text.trim().toLowerCase() === "status") {
            cy.log(`Found 'Status' column at index: ${index}`);
            
            cy.get("table tbody tr").each(($row) => {
              cy.wrap($row)
                .find("td")
                .eq(index)
                .find(".badge")
                .then(($badge) => {
                  const badgeText = $badge.text().trim().toLowerCase();
                  if (badgeText === "draft") {
                    cy.log("Found a draft status, proceeding with edit...");

                    cy.wrap($row)
                      .contains(".tooltip-text", "Edit")
                      .prev()
                      .click();

                    cy.url().should("match", /\/quizzes\/edit\/[a-zA-Z0-9]+/);
                    cy.demoPause();

                    cy.get('[data-test="input-title"]').type(title);
                    cy.get('[data-test="input-questions"]').type(digit);
                    cy.get('[data-test="input-duration"]')
                      .clear()
                      .type(formattedTime);
                    cy.get('[data-test="input-maximumParticipant"]').type(
                      digit
                    );
                    cy.get('[data-test="input-startDate"]').type(startDate);
                    cy.get('[data-test="input-startDate"]').should(
                      "have.value",
                      startDate
                    );
                    cy.get('[data-test="input-endDate"]').type(endDate);
                    cy.get('[data-test="input-endDate"]').should(
                      "have.value",
                      endDate
                    );
                    cy.selectDropdownByLabel("Type");
                    cy.selectDropdownByLabel("Domain");
                    cy.selectDropdownByLabel("Difficulty Level");

                    cy.demoPause();
                    cy.get('[data-test="button-save-&-next"]').click();
                    cy.url().should("match", /\/quizzes\/quizQuestion/);
                    cy.demoPause();

                    cy.get('[data-test="button-bonus"]').click();
                    cy.get(".ck.ck-reset.ck-editor.ck-rounded-corners").should(
                      "exist"
                    );
                    cy.get('.ck.ck-content[contenteditable="true"]').should(
                      "exist"
                    );

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
                    cy.demoPause();
                    cy.get('[data-test="modal-submit"]').click();
                    cy.contains("Quiz question is added successfully").should(
                      "be.visible"
                    );

                    cy.get(".accordion-item")
                      .first()
                      .find(".accordion-button")
                      .click();
                    cy.demoPause();
                    cy.get("#checkbox-0").check();
                    cy.get("#checkbox-0").should("be.checked");
                    cy.demoPause();
                    cy.get('[data-test="button-save-as-draft"]').click();
                    cy.contains(
                      "Quiz questions is updated successfully"
                    ).should("be.visible");
                  } else {
                    cy.log("No draft status found in this row, skipping...");
                  }
                });
            });
          }
        });
    });
  });

  it("should change status of quiz", () => {
    let statusColumnIndex: number = -1;
    let typeColumnIndex: number = -1;
    cy.wait(5000);
    cy.get("table thead th")
      .each(($header, index: any) => {
        if ($header.text().includes("Status")) {
          statusColumnIndex = index;
        }
        if ($header.text().includes("Type")) {
          typeColumnIndex = index;
        }
      })
      .then(() => {
        cy.get("table tbody tr").each(($row) => {
          cy.wrap($row)
            .find(`td:nth-child(${typeColumnIndex + 1})`)
            .invoke("text")
            .then((quizType) => {
              cy.wrap($row)
                .find(`td:nth-child(${statusColumnIndex + 1}) .badge`)
                .should("exist")
                .invoke("text")
                .then((statusText) => {
                  const status = statusText.trim().toLowerCase();

                  if (status === "draft") {
                    if (quizType.trim().toLowerCase() === "publish") {
                      cy.contains(".tooltip-text", "Status").prev().click();
                      cy.get('[data-test="modal-submit"]').click();
                    } else if (quizType.trim().toLowerCase() === "private") {
                      cy.contains(".tooltip-text", "Approve").prev().click();
                      cy.get('[data-test="modal-submit"]').click();
                      cy.wait(3000);
                      cy.contains(".tooltip-text", "Reject").prev().click();
                      cy.get('[data-test="modal-submit"]').click();
                      cy.wait(3000);
                      cy.contains(".tooltip-text", "Status").prev().click();
                      cy.get('[data-test="modal-submit"]').click();
                    }
                  } else {
                    cy.log(
                      "No draft status found. Skipping the status change test."
                    );
                    return false;
                  }
                });
            });
        });
      });
  });
});
