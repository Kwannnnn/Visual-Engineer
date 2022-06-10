import {
  getBoard, getVessel, getPipeFitting, dragAndDropVessel, dragAndDropPipeFitting
} from '../support/test-utils.js';

beforeEach(() => {
  cy.visit('http://localhost:8080');
  cy.viewport(1440, 900);
});

describe('ItemNode', () => {
  describe('When an item is moved to another position Board', () => {
    it('should send a PATCH request to update the position', () => {
      cy.intercept('PATCH', '/api/*/boards/*/objects/*').as('patchObject');

      cy.get('[data-id=PU01]')
        .move({
          deltaX: 10,
          deltaY: 0,
        });

      cy.wait('@patchObject').should(({ request, response }) => {
        const { x, y } = request.body;
        expect(response.statusCode).to.eq(200);
        expect(response.body).property('x').to.be.equal(x);
        expect(response.body).property('y').to.be.equal(y);
      });
    });
  });
});

describe('Board', () => {
  describe('When "Vessel" is dragged and dropped from the Toolbox', () => {
    const dataTransfer = new DataTransfer();
    it('should render on the Board', () => {
      getVessel();

      cy.get('@vessel')
        .should('exist')
        .trigger('dragstart', { dataTransfer });

      cy.get('[data-cy=board]')
        .should('exist')
        .trigger('drop', { dataTransfer });

      cy.get('[data-cy=itemNode_1]')
        .should('exist')
        .and('be.visible');

      cy.get('[data-cy=itemNode_1]')
        .find('div')
        .last().as('label');

      cy.get('@label')
        .should('contain', 'vessel');
    });
  });

  describe('When "Vessel" and "PipeLine" are connected', () => {
    const dataTransfer = new DataTransfer();

    it('should render an edge on the board', () => {
      getVessel(); // Get a reference to the Vessel sidebar item
      getPipeFitting(); // Get a reference to the PipeFitting sidebar item
      getBoard(); // Get a reference to the Board

      dragAndDropVessel(); // Drag the Vessel sidebar item to the Board
      dragAndDropPipeFitting(); // Drag the PipeFitting sidebar item to the Board

      // Get reference to the vessel node on the board
      cy.get('[data-cy=itemNode_1]')
        .should('exist')
        .and('be.visible')
        .as('boardVessel');

      // Get reference to the pipe fitting node on the board
      cy.get('[data-cy=itemNode_3]')
        .should('exist')
        .and('be.visible')
        .as('boardPipeFitting');

      cy.get('[data-cy=right-itemNode_1]')
        .trigger('dragstart', { dataTransfer, force: true });

      cy.get('[data-cy=left-itemNode_3]')
        .trigger('drop', { dataTransfer });
    });
  });
});
