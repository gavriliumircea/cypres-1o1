//Commands are used for code that should be reusable in different test cases
//fixture keyword points out that the data should be load from fixtures directory with the name matching the secod argument

Cypress.Commands.add('seedAndVisit', (seedData = 'fixture:todos') => {
    cy.server()
    cy.route('GET', '/api/todos', seedData)
    cy.visit('/')
  })