beforeEach(() => {
	cy.visit('http://localhost:8080');
	cy.viewport(1440, 900);
});

const getBoard = () => cy.get('[data-cy=board]')
	.first() // react-flow
	.first() // react-flow__renderer
	.first() // react-flow__viewport
	.first() // react-flow__edges
	.first() // react-flow__nodes
	.as('board');

const getPropertiesSidebar = () => cy.get('[data-cy=properties-sidebar]').as('sidebar');
const getPropertiesSidebarList = () => cy.get('[data-cy=sidebar-properties-list]').as('sidebar-prop-list');

const getVessel = () => cy.get('[data-cy=toolbox-item-vessel]')
	.as('vessel');

const getPipeFitting = () => cy.get('[data-cy=toolbox-item-pipeFitting]')
	.as('pipeFitting');

const dragAndDropVessel = () => {
	const dataTransfer = new DataTransfer();

	getVessel();
	getBoard();
	getPropertiesSidebar();
	getPropertiesSidebarList();

	cy.get('@sidebar')
		.should('exist')
		.should('not.be.visible')

	cy.get('@board')
		.should('exist')
		.should('be.visible');

	cy.get('@vessel')
		.should('exist')
		.should('be.visible');

	cy.get('@vessel')
		.click()
		.trigger('dragstart', { dataTransfer });

	cy.get('@board')
		.trigger('drop', { dataTransfer });
}

describe('PropertiesSidebar', () => {
	describe('When "Vessel" is dragged and dropped from the Toolbox to the Board', () => {
		it('should populate the PropertiesSidebar with empty input fields', () => {
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