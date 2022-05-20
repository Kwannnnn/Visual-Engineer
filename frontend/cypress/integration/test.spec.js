describe('View example data', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  describe('Toolbox list', () => {
    it('Should have one top level group called "Items"', () => {
      cy.get('#toolbox-list')
        .should('be.visible')
        .children().should('have.length', 1);
      cy.get('#toolbox-list').children('#listing-Items')
        .should('contain', 'Items');
    });

    it('Should expend and collapse on click', () => {
      cy.get('#listing-Items-subset')
        .should('have.class', 'collapse');

      cy.get('#toolbox-list')
        .should('be.visible');

      cy.get('#listing-Items-btn')
        .should('be.visible')
        .click();

      cy.get('#listing-Items-subset')
        .should('not.have.class', 'collapse');

      cy.get('#listing-Items-btn')
        .should('be.visible')
        .click();

      cy.get('#listing-Items-subset')
        .should('have.class', 'collapse');
    });

    it('Should show two subsets after clicking on "Items"', () => {
      cy.get('#listing-Items-subset')
        .should('have.class', 'collapse');

      cy.get('#toolbox-list')
        .should('be.visible');

      cy.get('#listing-Items-btn')
        .should('be.visible')
        .click();

      cy.get('#listing-Items-subset')
        .should('not.have.class', 'collapse');

      cy.get('#listing-Items-btn')
        .should('be.visible')
        .click();

      cy.get('#listing-Items-subset')
        .children().should('have.length', 2);
    });
  });
});
