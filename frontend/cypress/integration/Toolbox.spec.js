beforeEach(() => {
  cy.visit('http://localhost:8080');
});

describe('Toolbox Sidebar', () => {
  describe('When Toolbox Sidebar is rendered', () => {
    it('should render the Toolbox List', () => {
      cy.get('[data-cy=toolbox-list]').should('exist');
    });

    it('should render all possible items', () => {
      cy.get('[data-cy=toolbox-list]').should('exist');
      cy.get('[data-cy=toolbox-item-Pipe_Fitting]').should('exist');
      cy.get('[data-cy=toolbox-item-Pump]').should('exist');
      cy.get('[data-cy=toolbox-item-Blower]').should('exist');
      cy.get('[data-cy=toolbox-item-Tank]').should('exist');
      cy.get('[data-cy=toolbox-item-Vessel]').should('exist');
    });

    it('should match the content of all possible items', () => {
      cy.get('[data-cy=toolbox-list]').should('exist');
      cy.get('[data-cy=toolbox-item-Pipe_Fitting]').should('contain', 'Pipe Fitting');
      cy.get('[data-cy=toolbox-item-Pump]').should('contain', 'Pump');
      cy.get('[data-cy=toolbox-item-Blower]').should('contain', 'Blower');
      cy.get('[data-cy=toolbox-item-Tank]').should('contain', 'Tank');
      cy.get('[data-cy=toolbox-item-Vessel]').should('contain', 'Vessel');
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
