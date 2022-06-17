beforeEach(() => {
    cy.visit('http://localhost:8080');
    cy.viewport(1440, 900);
    cy.get('[data-cy=create-project-button]')
        .should('exist')
        .and('be.visible')
        .click()
});

describe('When the "New Project" button is clicked on the Nav bar', () => {
    it('should display the new project Modal with an input field', () => {
        cy.get('[data-cy=create-project-modal]')
            .should('exist')
            .and('be.visible')

        cy.get('[data-cy=project-name-input]')
            .should('exist')
            .and('be.visible')
    });

    describe('when project name is given and create button is clicked', () => {
        it('should send a POST board request', () => {
            cy.intercept('POST', '/api/*/boards').as('postBoard');

            const projectName = 'London Bridge'
            cy.get('[data-cy=project-name-input]')
                .type(projectName)

            cy.get('[data-cy=create-project-modal-buttons]')
                .should('exist')
                .and('be.visible')
                .find('button')
                .last()
                .as('modal-create-btn')

            cy.get('@modal-create-btn')
                .click();

            cy.wait('@postBoard').then(({ response }) => {
                expect(response.statusCode).to.eq(201)
                expect(response.body).property('id').to.exist
                expect(response.body).property('name').to.exist
                expect(response.body).property('name').to.eq(projectName)
            })
        })

        it('should open a new tab for the new project', () => {
            cy.intercept('POST', '/api/*/boards').as('postBoard');

            const projectName = 'NASA Spaceship'
            cy.get('[data-cy=project-name-input]')
                .type(projectName)

            cy.get('[data-cy=create-project-modal-buttons]')
                .should('exist')
                .and('be.visible')
                .find('button')
                .last()
                .as('modal-create-btn')

            cy.get('@modal-create-btn')
                .click();

            cy.wait('@postBoard').then(({ response }) => {
                return response.body.id
            }).then((boardId) => {
                cy.get(`[data-cy=tab-project-${boardId}]`)
                    .should('exist')
                    .and('be.visible')
            })
        });

    });
});