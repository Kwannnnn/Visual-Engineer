beforeEach(() => {
  cy.visit('http://localhost:8080');
});

describe('Board', () => {
  describe('When "Vessel" is dragged and dropped from the Toolbox', () => {
    const dataTransfer = new DataTransfer();

    it('it should render on the Board', () => {
      cy.get('[data-cy=toolbox-item-Vessel]')
        .as('Vessel');

      cy.get('[data-cy=board]')
        .first() // react-flow
        .first() // react-flow__renderer
        .first() // react-flow__viewport
        .first() // react-flow__edges
        .first() // react-flow__nodes
        .as('board');

      cy.get('@board')
        .should('exist')
        .should('be.visible');

      cy.get('@Vessel')
        .should('exist')
        .should('be.visible');

      cy.get('@Vessel')
        .click()
        .trigger('dragstart', { dataTransfer });

      cy.get('@board')
        .trigger('drop', { dataTransfer });

      cy.get('@board')
        .get('[data-cy=itemNode_1]')
        .as('boardVessel');

      cy.get('@boardVessel')
        .should('exist')
        .should('be.visible');
    });
  });
});
