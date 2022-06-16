beforeEach(() => {
  cy.visit('http://localhost:8080');
  cy.viewport(1440, 900);
  cy.get('[data-cy="board-1"]').click();
});

describe('Toolbox Sidebar', () => {
  describe('When Toolbox Sidebar is rendered', () => {
    it('should render the Toolbox List', () => {
      cy.get('[data-cy=toolbox-list]').should('exist');
    });

    it('should render all possible items', () => {
      cy.get('[data-cy=toolbox-list]').should('exist');
      cy.get('[data-cy=toolbox-item-pipeFitting]').should('exist');
      cy.get('[data-cy=toolbox-item-pump]').should('exist');
      cy.get('[data-cy=toolbox-item-blower]').should('exist');
      cy.get('[data-cy=toolbox-item-tank]').should('exist');
      cy.get('[data-cy=toolbox-item-vessel]').should('exist');
    });

    it('should match the content of all possible items', () => {
      cy.get('[data-cy=toolbox-list]').should('exist');
      cy.get('[data-cy=toolbox-item-pipeFitting]').should('contain', 'Pipe Fitting');
      cy.get('[data-cy=toolbox-item-pump]').should('contain', 'Pump');
      cy.get('[data-cy=toolbox-item-blower]').should('contain', 'Blower');
      cy.get('[data-cy=toolbox-item-tank]').should('contain', 'Tank');
      cy.get('[data-cy=toolbox-item-vessel]').should('contain', 'Vessel');
    });
  });

  describe('When Toolbox List item is clicked', () => {
    it('should collapse if it is open', () => {
      cy.get('[data-cy=listing-Item-btn]').click();
      cy.get('[data-cy=listing-Item-subset]').should('have.class', 'hidden');
    });

    it('should expand if it is collapsed', () => {
      cy.get('[data-cy=listing-Item-btn]').click();
      cy.get('[data-cy=listing-Item-subset]').should('have.class', 'hidden');
      cy.get('[data-cy=listing-Item-btn]').click();
      cy.get('[data-cy=listing-Item-subset]').should('not.have.class', 'hidden');
    });
  });
});
