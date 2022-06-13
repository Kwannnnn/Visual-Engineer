import {
  dragAndDropVessel, getPropertiesSidebar, getPropertiesSidebarList
} from '../support/test-utils.js';

beforeEach(() => {
  cy.visit('http://localhost:8080');
  cy.viewport(1440, 900);
});

const closeSidebar = () => {
  cy.get('@sidebar')
    .should('exist')
    .should('be.visible');
  cy.get('[data-cy=close-sidebar-btn]')
    .should('exist')
    .should('be.visible')
    .click();
  cy.get('@sidebar')
    .should('exist')
    .should('not.be.visible');
};

describe('PropertiesSidebar', () => {
  describe('When "Vessel" is dragged and dropped from the Toolbox to the Board', () => {
    it('should populate the PropertiesSidebar with empty input fields', () => {
      getPropertiesSidebar();
      getPropertiesSidebarList();
      dragAndDropVessel();

      cy.get('@sidebar')
        .should('exist')
        .should('be.visible');

      cy.get('@sidebar-prop-list')
        .children()
        .should('exist')
        .should('be.visible');

      cy.get('@sidebar-prop-list')
        .children().each(($el) => {
          cy.wrap($el)
            .first()
            .first()
            .should('have.value', '');
        });
    });

    describe('When the close button is clicked on the PropertiesSidebar', () => {
      it('should close the PropertiesSidebar', () => {
        getPropertiesSidebar();
        getPropertiesSidebarList();
        dragAndDropVessel();

        cy.get('@sidebar')
          .should('exist')
          .should('be.visible');

        cy.get('[data-cy=close-sidebar-btn]')
          .should('exist')
          .should('be.visible')
          .click();

        cy.get('@sidebar')
          .should('exist')
          .should('not.be.visible');
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
