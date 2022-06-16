import {
  dragAndDropVessel, getPropertiesSidebar, getPropertiesSidebarList
} from '../support/test-utils.js';

beforeEach(() => {
  cy.visit('http://localhost:8080');
  cy.viewport(1440, 900);
  cy.get('[data-cy="board-1"]').click();
});

// const closeSidebar = () => {
//   cy.get('@sidebar')
//     .should('exist')
//     .should('be.visible');
//   cy.get('[data-cy=close-sidebar-btn]')
//     .should('exist')
//     .should('be.visible')
//     .click();
//   cy.get('@sidebar')
//     .should('exist')
//     .should('not.be.visible');
// };

describe('PropertiesSidebar', () => {
  describe('When "Vessel" is dragged and dropped from the Toolbox to the Board', () => {
    it('should send a POST request with the new item', () => {
      dragAndDropVessel();
    });

    it('should populate the PropertiesSidebar with empty input fields', () => {
      getPropertiesSidebar();
      getPropertiesSidebarList();
      dragAndDropVessel();

      cy.get('@sidebar')
        .should('exist')
        .and('be.visible');

      cy.get('@sidebar-prop-list')
        .children()
        .should('exist')
        .and('be.visible');

      cy.get('@sidebar-prop-list')
        .children().each(($el) => {
          cy.wrap($el)
            .first()
            .first()
            .should('have.value', '');
        });
    });
  });

  describe('When the close button is clicked on the PropertiesSidebar', () => {
    it('should close the PropertiesSidebar', () => {
      getPropertiesSidebar();
      getPropertiesSidebarList();
      dragAndDropVessel();

      cy.get('@sidebar')
        .should('exist')
        .and('be.visible');

      cy.get('[data-cy=close-sidebar-btn]')
        .should('exist')
        .and('be.visible')
        .click();

      cy.get('@sidebar')
        .should('exist')
        .and('not.be.visible');
    });
  });

  describe('When the delete button is clicked on the PropertiesSidebar', () => {
    it('should display a confirmation message', () => {
      getPropertiesSidebar();
      dragAndDropVessel();

      cy.get('@sidebar')
        .should('be.visible');

      cy.get('[data-cy=delete-item-btn]')
        .should('exist')
        .and('be.visible')
        .click();

      cy.get('[data-cy=delete-item-modal]')
        .should('exist')
        .and('be.visible');
    });
  });

  describe('When the delete button is clicked on the confirmation Modal', () => {
    it('should send a DELETE request', () => {
      cy.intercept('POST', '/api/*/boards/*/objects').as('postVessel');
      cy.intercept('DELETE', '/api/*/boards/*/objects/*').as('deleteVessel');
      getPropertiesSidebar();
      dragAndDropVessel();

      cy.wait('@postVessel').then(({ response }) => {
        expect(response.statusCode).to.eq(201);
        expect(response.body).property('tag').to.exist;
        return response.body.tag;
      }).then((vesselId) => {
        cy.get(`[data-cy=itemNode-${vesselId}]`)
          .as('boardVessel');

        cy.get('@boardVessel')
          .should('exist');

        cy.get('[data-cy=delete-item-btn]')
          .click();

        cy.get('[data-cy=delete-item-modal]')
          .should('exist')
          .and('be.visible');

        cy.get('[data-cy=delete-item-modal-buttons]')
          .should('exist')
          .and('be.visible')
          .find('button')
          .last()
          .as('modal-delete-btn');

        cy.get('@modal-delete-btn')
          .click();

        cy.wait('@deleteVessel').then(({ response }) => {
          expect(response.statusCode).to.eq(204);
        }).then(() => {
          // Use the selector instead of the alias since the alias requires
          // the element to exist in the DOM, thus the test will hang
          cy.get(`[data-cy=itemNode-${vesselId}]`)
            .should('not.exist');
        });
      });
    });

    /*
    describe('When pipeline is clicked', () => {
      it('Should show property list for the draft pipeline', () => {
        const dataTransfer = new DataTransfer();
        // Render 2 connectable nodes on the board
        dragAndDropVessel();
        closeSidebar();
        dragAndDropPipeFitting();
        closeSidebar();

        // Connect the 2 nodes
        cy.get('@vessel')
          .should('exist')
          .should('be.visible');
        cy.get('@pipeFitting')
          .should('exist')
          .should('be.visible');
        cy.get('@board')
          .get('[data-cy=right-itemNode_1]')
          .should('exist')
          .trigger('dragstart', { dataTransfer, force: true });
        cy.get('@board')
          .get('[data-cy=left-itemNode_3]')
          .should('exist')
          .trigger('drop', { dataTransfer, force: true });

        // Check if the prop sidebar is visible
        cy.get('@sidebar')
          .should('exist')
          .should('be.visible');
        cy.get('@sidebar-prop-list')
          .children()
          .should('exist')
          .should('be.visible');

        // Check if the edge is visible
        cy.get('.itemTmpEdge_0')
          .should('exist')
          .should('be.visible');
      });
    }); */
  });
});
