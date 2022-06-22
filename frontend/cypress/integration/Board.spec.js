import {
  getBoard, getVessel, getPipeFitting, dragAndDropVessel, dragAndDropPipeFitting, connectTankToPipeFitting
} from '../support/test-utils.js';

beforeEach(() => {
  cy.visit('http://localhost:8080');
  cy.viewport(1440, 900);
  cy.get('[data-cy="board-1"]').click();
});

describe('ItemNode', () => {
  describe('When an item is moved to another position Board', () => {
    it('should send a PATCH request to update the position', () => {
      cy.intercept('PATCH', '/api/*/boards/*/objects/*').as('patchObject');

      cy.get('[data-id=PU01]')
        .move({
          deltaX: 10,
          deltaY: 0,
          force: true,
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
    it('should send a POST request with the new item', () => {
      cy.intercept('POST', '/api/*/boards/*/objects').as('postVessel');

      dragAndDropVessel();

      cy.wait('@postVessel').then(({ request, response }) => {
        const { type, x, y } = request.body;
        expect(response.statusCode).to.eq(201);
        expect(response.body).property('type').to.be.equal(type);
        expect(response.body).property('x').to.be.equal(x);
        expect(response.body).property('y').to.be.equal(y);
        expect(response.body).property('id').to.exist;
      });
    });

    it('should render on the Board', () => {
      cy.intercept('POST', '/api/*/boards/*/objects').as('postVessel');

      dragAndDropVessel();

      cy.wait('@postVessel').then(({ request, response }) => {
        const { type, x, y } = request.body;
        expect(response.statusCode).to.eq(201);
        expect(response.body).property('type').to.be.equal(type);
        expect(response.body).property('x').to.be.equal(x);
        expect(response.body).property('y').to.be.equal(y);
        expect(response.body).property('id').to.exist;

        const vesselId = response.body.id;

        cy.get(`[data-cy=itemNode-${vesselId}]`)
          .should('exist')
          .and('be.visible')
          .as('boardVessel');

        cy.get('@boardVessel')
          .find('div')
          .last().as('label');

        cy.get('@label')
          .should('contain', 'vessel');
      });
    });
  });

  describe('When "Vessel" and "PipeLine" are connected', () => {
    it('should render an edge on the board', () => {
      getVessel(); // Get a reference to the Vessel sidebar item
      getPipeFitting(); // Get a reference to the PipeFitting sidebar item
      getBoard(); // Get a reference to the Board

      cy.intercept('POST', '/api/*/boards/*/objects').as('postVessel');

      dragAndDropVessel();

      cy.wait('@postVessel').then(({ request, response }) => {
        const { type, x, y } = request.body;
        expect(response.statusCode).to.eq(201);
        expect(response.body).property('type').to.be.equal(type);
        expect(response.body).property('x').to.be.equal(x);
        expect(response.body).property('y').to.be.equal(y);
        expect(response.body).property('id').to.exist;

        const vesselId = response.body.id;
        cy.get(`[data-cy=itemNode-${vesselId}]`)
          .should('exist')
          .and('be.visible')
          .as('boardVessel');

        dragAndDropPipeFitting();

        cy.wait('@postVessel').then(({ request, response }) => {
          const { type, x, y } = request.body;
          expect(response.statusCode).to.eq(201);
          expect(response.body).property('type').to.be.equal(type);
          expect(response.body).property('x').to.be.equal(x);
          expect(response.body).property('y').to.be.equal(y);
          expect(response.body).property('id').to.exist;
          const pipeFittingId = response.body.id;

          cy.get(`[data-cy=itemNode-${pipeFittingId}]`)
            .should('exist')
            .and('be.visible')
            .as('boardPipeFitting');

          const dataTransfer = new DataTransfer();

          cy.get(`[data-cy=right-itemNode-${vesselId}]`)
            .trigger('dragstart', { dataTransfer, force: true });

          cy.get(`[data-cy=left-itemNode-${pipeFittingId}]`)
            .trigger('drop', { dataTransfer });
        });
      });
    });
  });

  describe('When a Tank is connected to a PipeFitting', () => {
    it('should send a POST request with a new relationship', () => {
      cy.intercept('POST', '/api/*/relationships').as('postRelationship');

      connectTankToPipeFitting();

      cy.wait('@postRelationship').then(({ request, response }) => {
        const { pipeline, firstItem, secondItem } = request.body;
        expect(response.statusCode).to.eq(201);
        expect(response.body.pipeline).property('id').to.be.equal(pipeline);
        expect(response.body.firstItem).property('id').to.be.equal(firstItem);
        expect(response.body.secondItem).property('id').to.be.equal(secondItem);
      });
    });
  });
});
