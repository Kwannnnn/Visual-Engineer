describe('View example data', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  describe('Toolbox list', () => {
    it('Should have one top level group called "Item"', () => {
      cy.get('#toolbox-list')
        .should('be.visible')
        .children().should('have.length', 1);
      cy.get('#toolbox-list').children('#listing-Item')
        .should('contain', 'Item');
    });

    it('Should expend and collapse on click', () => {
      cy.get('#listing-Item-subset')
        .should('have.class', 'hidden');

      cy.get('#toolbox-list')
        .should('be.visible');

      cy.get('#listing-Item-btn')
        .should('be.visible')
        .click();

      cy.get('#listing-Item-subset')
        .should('not.have.class', 'hidden');

      cy.get('#listing-Item-btn')
        .should('be.visible')
        .click();

      cy.get('#listing-Item-subset')
        .should('have.class', 'hidden');
    });

    it('Should show two subsets after clicking on "Item"', () => {
      cy.get('#listing-Item-subset')
        .should('have.class', 'hidden');

      cy.get('#toolbox-list')
        .should('be.visible');

      cy.get('#listing-Item-btn')
        .should('be.visible')
        .click();

      cy.get('#listing-Item-subset')
        .should('not.have.class', 'hidden');

      cy.get('#listing-Item-btn')
        .should('be.visible')
        .click();

      cy.get('#listing-Item-subset')
        .children().should('have.length', 2);
    });
  });
});
