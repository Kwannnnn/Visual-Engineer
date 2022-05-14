describe('View example data', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  describe('Click the "Read Data" button', () => {
    it('Click Button', () => {
      cy.get('#test-button')
        .should('be.visible')
        .click();

      cy.get('#test-container')
        .children().should('have.length', 2);
    });
  });
});
