beforeEach(() => {
  cy.visit('http://localhost:8080');
  cy.viewport(1440, 900);
});

describe('Navbar', () => {
  describe('When the page loads', () => {
    it('should display the Projects NavLink', () => {
      cy.get('[data-cy="nav-projects"]')
        .should('exist')
        .and('be.visible');
    });
  });
});

describe('Projects page', () => {
  describe('When the page loads', () => {
    it('should display all 3 projects list items', () => {
      cy.get('[data-cy="boards-list"]')
        .should('exist')
        .and('be.visible')
        .children()
        .should('have.length', 3);

      cy.get('[data-cy="board-1"]')
        .should('exist')
        .and('be.visible');

      cy.get('[data-cy="board-2"]')
        .should('exist')
        .and('be.visible');

      cy.get('[data-cy="board-3"]')
        .should('exist')
        .and('be.visible');
    });
  });

  describe('When a project is selected from the list', () => {
    it('should display display the Board page', () => {
      cy.get('[data-cy="board-1"]')
        .should('exist')
        .and('be.visible')
        .click();

      cy.location().should((loc) => {
        expect(loc.pathname).to.eq('/');
      });

      cy.get('[data-cy="board"]')
        .should('exist')
        .and('be.visible');
    });

    it('should be opened and selected in the TabBar', () => {
      cy.get('[data-cy="board-1"]')
        .should('exist')
        .and('be.visible')
        .click();

      cy.location().should((loc) => {
        expect(loc.pathname).to.eq('/');
      });

      cy.get('[data-cy="tab-board-1"]')
        .should('exist')
        .and('be.visible')
        .and('have.class', 'border-b-4'); // Only selected tabs have border-b-4
    });

    it('should not be opened again in the TabBar when it already exists', () => {
      cy.get('[data-cy="board-1"]')
        .should('exist')
        .and('be.visible')
        .click();

      cy.location().should((loc) => {
        expect(loc.pathname).to.eq('/');
      });

      cy.get('[data-cy="nav-projects"]')
        .click();

      cy.get('[data-cy="board-1"]')
        .click();

      cy.get('[data-cy="tabBar"]')
        .should('exist')
        .and('be.visible')
        .as('tabBar');

      cy.get('@tabBar')
        .find('[data-cy="tab-board-1"]')
        .its('length')
        .should('eq', 1);
    });
  });
});
