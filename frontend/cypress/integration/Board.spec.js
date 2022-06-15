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
    it('should send a POST request with the new item', () => {
      cy.intercept('POST', '/api/*/boards/*/objects').as('postVessel');

      dragAndDropVessel();

      cy.wait('@postVessel').then(({ request, response }) => {
        const { type, x, y } = request.body;
        expect(response.statusCode).to.eq(201);
        expect(response.body).property('type').to.be.equal(type);
        expect(response.body).property('x').to.be.equal(x);
        expect(response.body).property('y').to.be.equal(y);
        expect(response.body).property('tag').to.exist;
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
        expect(response.body).property('tag').to.exist;

        const vesselTag = response.body.tag;

        cy.get(`[data-cy=itemNode-${vesselTag}]`)
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
        expect(response.body).property('tag').to.exist;

        const vesselTag = response.body.tag;
        cy.get(`[data-cy=itemNode-${vesselTag}]`)
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
          expect(response.body).property('tag').to.exist;
          const pipeFittingTag = response.body.tag;

          cy.get(`[data-cy=itemNode-${pipeFittingTag}]`)
            .should('exist')
            .and('be.visible')
            .as('boardPipeFitting');

          const dataTransfer = new DataTransfer();

          cy.get(`[data-cy=right-itemNode-${vesselTag}]`)
            .trigger('dragstart', { dataTransfer, force: true });

          cy.get(`[data-cy=left-itemNode-${pipeFittingTag}]`)
            .trigger('drop', { dataTransfer });
        });
      });
    });
  });
});
