describe('Input form', () => {
    
    //executes before each test
    beforeEach(() => {
        //access the website baseUrlspecified in the cypress.json
        cy.visit('/')
    })

    it('focuses on load', () => {
        //check if there is any focused element in the page and if so check the class of the focused element
        cy.focused()
            .should('have.class', 'new-todo');
    })

    //only function highlights the fact that the test runs by itself(doesn't reuquire any other tests in order to run) 
    it.only('accepts input', () => {
        const typedText = "Task 1";
        cy.get('.new-todo')
            .type(typedText)
            .should('have.value', typedText)
    })
})