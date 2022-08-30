Cypress.Commands.add('getByTestId', (id) => cy.get(`[data-test=${id}]`))
