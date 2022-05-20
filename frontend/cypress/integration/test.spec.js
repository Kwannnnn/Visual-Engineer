describe('View example data', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  describe('Toolbox list', () => {
    it('Should have one top level group called "Items"', () => {
      cy.get('#toolbox-list')
        .should('be.visible')
        .children().should('have.length', 1)
        .children()
        .invoke('text')
        .then((text) => {
          expect(text.trim().split(' ')[0]).equal('Items');
        });
    });

    it('Should expend and collapse on click', () => {
      cy.get('#listing-Items-subset')
        .should('have.class', 'hidden');

      cy.get('#toolbox-list')
        .should('be.visible');

      cy.get('#listing-Items-btn')
        .should('be.visible')
        .click();

      cy.get('#listing-Items-subset')
        .should('not.have.class', 'hidden');

      cy.get('#listing-Items-btn')
        .should('be.visible')
        .click();

      cy.get('#listing-Items-subset')
        .should('have.class', 'hidden');
    });

    it('Should show two subsets after clicking on "Items"', () => {
      cy.get('#listing-Items-subset')
        .should('have.class', 'hidden');

      cy.get('#toolbox-list')
        .should('be.visible');

      cy.get('#listing-Items-btn')
        .should('be.visible')
        .click();

      cy.get('#listing-Items-subset')
        .should('not.have.class', 'hidden');

      cy.get('#listing-Items-btn')
        .should('be.visible')
        .click();

      cy.get('#listing-Items-subset')
        .children().should('have.length', 2);
    });
  });
});
