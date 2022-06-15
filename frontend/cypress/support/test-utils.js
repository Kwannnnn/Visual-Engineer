export const getBoard = () => cy.get('[data-cy=board]')
  .should('exist')
  .and('be.visible')
  .as('board');

export const getPropertiesSidebar = () => cy.get('[data-cy=properties-sidebar]')
  .should('exist')
  .and('not.be.visible')
  .as('sidebar');
export const getPropertiesSidebarList = () => cy.get('[data-cy=sidebar-properties-list]')
  .should('exist')
  .and('not.be.visible')
  .as('sidebar-prop-list');

export const getVessel = () => cy.get('[data-cy=toolbox-item-vessel]')
  .should('exist')
  .and('be.visible')
  .as('vessel');

export const getPipeFitting = () => cy.get('[data-cy=toolbox-item-pipeFitting]')
  .should('exist')
  .and('be.visible')
  .as('pipeFitting');

export const dragAndDropVessel = () => {
  const dataTransfer = new DataTransfer();

  getVessel();
  getBoard();

  cy.get('@vessel')
    .click()
    .trigger('dragstart', { dataTransfer });

  cy.get('@board')
    .trigger('drop', { dataTransfer });
};

export const dragAndDropPipeFitting = () => {
  const dataTransfer = new DataTransfer();

  getPipeFitting();
  getBoard();

  cy.get('@pipeFitting')
    .click()
    .trigger('dragstart', { dataTransfer });

  cy.get('@board')
    .trigger('drop', { dataTransfer });
};

export const connectTankToPipeFitting = () => {
  cy.get('[data-cy=right-itemNode-T01]').click();
  cy.get('[data-cy=left-itemNode-PU01]').click();
}
