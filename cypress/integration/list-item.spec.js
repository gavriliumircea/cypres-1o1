describe('List items', () =>{
    beforeEach(()=>{
        cy.seedAndVisit()
    })

    it('properly displays completed items', () =>{
        cy.get('.todo-list li')
            //select just the items with the completed class
            .filter('.completed')
            .should('have.length',1)
            //checks the text content
            .and('contain', 'Eggs')
            //performs search through the element children looking for toggle class
            .find('.toggle')
            .should('be.checked')
    })

    it('Shows remaining todos in the footer', () => {
        cy.get('.todo-count')
            .should('contain', 3)
    })

    it('Removes a todo', () =>{
        cy.route({
            url: 'api/todos/1',
            method: 'DELETE',
            status: 200,
            response: {}
        })

        cy.get('.todo-list li')
            //creates an references that could be reffered with @list
            // keep in mind that cypress runs async and an approach like const x= cy.get won't work 
            .as('list')

        cy.get('@list')
            .first()
            .find('.destroy')
            //handle invisible data
            .invoke('show')
            .click()

        cy.get('@list')
            .should('have.length',3)
            .and('not.contain','Milk')

    })
})