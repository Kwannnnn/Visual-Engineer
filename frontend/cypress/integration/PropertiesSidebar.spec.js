import {
  dragAndDropVessel, getPropertiesSidebar, getPropertiesSidebarList
} from '../support/test-utils.js';

beforeEach(() => {
  cy.visit('http://localhost:8080');
  cy.viewport(1440, 900);
});

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
  });
});
