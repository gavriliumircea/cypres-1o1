describe('Input form', () => {
    const typedText = "Task 1";

    //executes before each test
    beforeEach(() => {
        //access the website baseUrlspecified in the cypress.json
        //cy.visit('/')
        cy.seedAndVisit([])
    })

    it('focuses on load', () => {
        //check if there is any focused element in the page and if so check the class of the focused element
        cy.focused()
            .should('have.class', 'new-todo');
    })

    //it.only function highlights the fact that the test runs by itself(doesn't reuquire any other tests in order to run). To be used when it is desired to run a single test 
    it('accepts input', () => {
        cy.get('.new-todo')
            .type(typedText)
            .should('have.value', typedText)
    })

    //form of organizing tests
    context('Form submision', () => {
        beforeEach(() => {
            // start a fake server to be used for testing frontend functionalities whyle server is still under developement or side effects of the test are not wanted
            cy.server()
        })

        it('Adds a new todo on submit', () => {
            const itemText = 'Buy eggs'

            // create the mock route that will be used further in the test
            cy.route('POST', '/api/todos', {
              name: itemText,
              id: 1,
              isComplete: false
            })

            //checks if the input value is cleared after form is submited
            cy.get('.new-todo')
                .type('typedText')
                //simulate enterPressed event
                .type('{enter}')
                .should('have.value', '')

            //checks if the value was added to the list
            cy.get('.todo-list li')
                .should('have.length', 1)
                // and function could be replaced with should, it is used for logical chainings
                .and('contain', itemText)
        })

        it('Shows an error message on a failed submission', () => {
            //mock an error message returned by the server
            cy.route({
              url: '/api/todos',
              method: 'POST',
              status: 500,
              response: {}
            })
      
            cy.get('.new-todo')
              .type('test{enter}')
      
            //check conditional rendering of the todo-list item
            cy.get('.todo-list li')
              .should('not.exist')
      
            //check conditional rendering of the error item
            cy.get('.error')
              .should('be.visible')
          })
    })
})