/// <reference types="cypress" />

describe("My Library menu", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080");
    cy.injectAxe();
  });
  context("My Library Menu", () => {
    it("Appears as expected", () => {
      cy.viewport(1280, 900);
      cy.get("uq-site-header")
        .shadow()
        .find("div#mylibrary")
        .should("contain", "My library");
      cy.get("uq-site-header").shadow().find("button#mylibrary-button").click();
      cy.wait(500);
      cy.get("uq-site-header")
        .shadow()
        .find("ul.mylibrary-menu-list")
        .find("li")
        .should("have.length", 9);
    });

    it("AskUs passes accessibility", () => {
      cy.viewport(1280, 900);
      cy.get("uq-site-header").shadow().find("button#mylibrary-button").click();
      cy.wait(500);
      cy.checkA11y("uq-site-header", {
        reportName: "My Library",
        scopeName: "Accessibility",
        includedImpacts: ["minor", "moderate", "serious", "critical"],
      });
    });
  });
});
