describe('Smoke tests', () => {
    //clear db before each context
    beforeEach(() => {
      // make an actual request
      cy.request('GET', '/api/todos')
        //get the body of the response
        .its('body')
        //foreach obj in the array call the delete endpoint
        .each(todo => cy.request('DELETE', `/api/todos/${todo.id}`))
    })
  
    context('With no todos', () => {
      it('Saves new todos', () => {
        //data driven test approach
        const items = [
          {text: 'Buy milk', expectedLength: 1},
          {text: 'Buy eggs', expectedLength: 2},
          {text: 'Buy bread', expectedLength: 3}
        ]

        cy.visit('/')
        cy.server()
        //if no response is specified we create a reference to the actual request and fake it
        cy.route('POST', '/api/todos')
          .as('create')
  
        cy.wrap(items)
          .each(todo => {
            cy.focused()
              .type(todo.text)
              .type('{enter}')
            
            //wait to finish the request. Removes flakiness generated by server delays
            cy.wait('@create')
  
            cy.get('.todo-list li')
              .should('have.length', todo.expectedLength)
          })
      })
    })

    context('With active todos', () => {
        beforeEach(() => {
          //populate db with data from fixtures
          cy.fixture('todos')
            .each(todo => {
              const newTodo = Cypress._.merge(todo, {isComplete: false})
              cy.request('POST', '/api/todos', newTodo)
            })
          cy.visit('/')
        })
    
        it('Loads existing data from the DB', () => {
          cy.get('.todo-list li')
            .should('have.length', 4)
        })
    
        it('Deletes todos', () => {
          cy.server()
          cy.route('DELETE', '/api/todos/*')
            .as('delete')
    
          cy.get('.todo-list li')
            .each($el => {
              cy.wrap($el)
                .find('.destroy')
                .invoke('show')
                .click()
    
              cy.wait('@delete')
            })
            .should('not.exist')
        })
    
      it('Toggles todos', () => {
        //reusable function
        const clickAndWait = ($el) => {
          cy.wrap($el)
            .as('item')
            .find('.toggle')
            .click()
    
          cy.wait('@update')
        }
        cy.server()
        cy.route('PUT', '/api/todos/*')
          .as('update')
        
        // check and un check test for all elements
        cy.get('.todo-list li')
          .each($el => {
            clickAndWait($el)
            cy.get('@item')
              .should('have.class', 'completed')
          })
          .each($el => {
            clickAndWait($el)
            cy.get('@item')
              .should('not.have.class', 'completed')
          })
        })
      })
  })