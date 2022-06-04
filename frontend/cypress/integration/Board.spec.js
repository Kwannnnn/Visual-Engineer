beforeEach(() => {
  cy.visit('http://localhost:8080');
});

const getBoard = () => cy.get('[data-cy=board]')
  .first() // react-flow
  .first() // react-flow__renderer
  .first() // react-flow__viewport
  .first() // react-flow__edges
  .first() // react-flow__nodes
  .as('board');

const getVessel = () => cy.get('[data-cy=toolbox-item-Vessel]')
  .as('vessel');

const getPipeFitting = () => cy.get('[data-cy=toolbox-item-Pipe_Fitting]')
  .as('pipeFitting');

describe('Board', () => {
  describe('When "Vessel" is dragged and dropped from the Toolbox', () => {
    const dataTransfer = new DataTransfer();

    it('should render on the Board', () => {
      getVessel();
      getBoard();

      cy.get('@board')
        .should('exist')
        .should('be.visible');

      cy.get('@vessel')
        .should('exist')
        .should('be.visible');

      cy.get('@vessel')
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

  describe('When "Vessel" and "PipeLine" are connected', () => {
    const dataTransfer = new DataTransfer();

    it('should render an edge on the board', () => {
      getVessel(); // Get a reference to the Vessel sidebar item
      getPipeFitting(); // Get a reference to the PipeFitting sidebar item
      getBoard(); // Get a reference to the Board

      cy.get('@board')
        .should('exist')
        .should('be.visible');

      cy.get('@vessel')
        .should('exist')
        .should('be.visible');

      cy.get('@pipeFitting')
        .should('exist')
        .should('be.visible');

      // Drag the vessel item
      cy.get('@vessel')
        .click()
        .trigger('dragstart', { dataTransfer });

      // Drop the vessel item on the board
      cy.get('@board')
        .trigger('drop', { dataTransfer });

      // Drag the pipe fitting item
      cy.get('@pipeFitting')
        .click({ force: true })
        .trigger('dragstart', { dataTransfer });

      // Drop the pipe fitting item on the board
      cy.get('@board')
        .trigger('drop', { dataTransfer });

      // Get reference to the vessel node on the board
      cy.get('@board')
        .get('[data-cy=itemNode_1]')
        .as('boardVessel');

      // Get reference to the pipe fitting node on the board
      cy.get('@board')
        .get('[data-cy=itemNode_3]')
        .as('boardPipeFitting');

      cy.get('@boardVessel')
        .should('exist')
        .should('be.visible');

      cy.get('@boardPipeFitting')
        .should('exist')
        .should('be.visible');

      cy.get('@board')
        .get('[data-cy=right-itemNode_1]')
        .click({ force: true })
        .trigger('dragstart', { dataTransfer, force: true });

      cy.get('@board')
        .get('[data-cy=left-itemNode_3]')
        .trigger('drop', { dataTransfer });
    });
  });
});
