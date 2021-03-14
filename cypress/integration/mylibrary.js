/// <reference types="cypress" />

import ApiAccess from "../../src/ApiAccess/ApiAccess";

describe("My Library menu", () => {
  beforeEach(() => {
    // whenever we change users in the same tab we have to clear local storage or it will pick up the previous user :(
    (new ApiAccess()).removeAccountStorage();

  });
  context("My Library Menu", () => {
    it("Appears as expected", () => {
      cy.visit("http://localhost:8080?user=public");
      cy.viewport(1280, 900);
      cy.get("uq-site-header")
        .shadow()
        .find("div#askus")
        .should("contain", "AskUs");
      cy.get("uq-site-header").shadow().find("button#askus-button").click();
      cy.wait(500);
      cy.get("uq-site-header")
        .shadow()
        .find("ul.askus-menu-list")
        .find("li")
        .should("have.length", 6);
      cy.get("uq-site-header")
          .shadow()
          .find("div.mylibrary-menu-list")
          .should('not.exist');
    });

    it("AskUs passes accessibility", () => {
      cy.visit("http://localhost:8080");
      cy.injectAxe();
      cy.viewport(1280, 900);
      cy.get("uq-site-header").shadow().find("button#mylibrary-button").click();
      cy.wait(500);
      cy.checkA11y("uq-site-header", {
        reportName: "My Library",
        scopeName: "Accessibility",
        includedImpacts: ["minor", "moderate", "serious", "critical"],
      });
    });

    it("Admin gets masquerade", () => {
      cy.visit("http://localhost:8080?user=uqstaff");
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
          .should("have.length", 10);
      cy.get("uq-site-header")
          .shadow()
          .find('li[data-testid="mylibrary-masquerade"]')
          .should('exist')
          .contains('Masquerade');
    });

    it("Researcher gets espace but not masquerade", () => {
      cy.visit("http://localhost:8080?user=s1111111");
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
      cy.get("uq-site-header")
          .shadow()
          .find('li[data-testid="mylibrary-espace"]')
          .contains('eSpace dashboard');
    });

    it("non-Researcher gets neither espace nor masquerade", () => {
      cy.visit("http://localhost:8080?user=s3333333");
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
          .should("have.length", 8);
      cy.get("uq-site-header")
          .shadow()
          .find('li[data-testid="mylibrary-masquerade"]')
          .should('not.exist');
      cy.get("uq-site-header")
          .shadow()
          .find('li[data-testid="mylibrary-espace"]')
          .should('not.exist');
    });
  });
});
