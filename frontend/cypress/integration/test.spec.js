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

    it('Should expand and collapse on click', () => {
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

    it('Should have one "Pipe Fitting" item after clicking on "Pipe Item', () => {
      cy.get('#listing-Item-subset')
        .should('have.class', 'hidden');

      cy.get('#toolbox-list')
        .should('be.visible');

      cy.get('#listing-Item-btn')
        .should('be.visible')
        .click();

      cy.get('#listing-Item-subset')
        .children().should('have.length', 2);

      cy.get('#listing-Pipe_Item-btn')
        .should('be.visible')
        .click();

      cy.get('#listing-Pipe_Item-subset')
        .children().should('have.length', 1);
    });

    it('Should be able to drag the "Pipe Fitting" item', () => {
      const dataTransfer = new DataTransfer();

      cy.get('#listing-Item-subset');
      cy.get('#toolbox-list');

      cy.get('#listing-Item-btn')
        .click();

      cy.get('#listing-Item-subset');

      cy.get('#listing-Pipe_Item-btn')
        .click();

      cy.get('#listing-Pipe_Item-subset')
        .first()
        .should('be.visible')
        .trigger('dragstart', {
          dataTransfer,
        });

      cy.get('#board')
        .should('be.visible');

      cy.get('#board')
        .trigger('drop', {
          dataTransfer,
        });
    });
  });
});
