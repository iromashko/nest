const faker = require('faker');

describe('Tasks API', () => {
  it('Create Task', () => {
    for (let i = 0; i < 3; i++) {
      const task = {
        title: faker.commerce.product(),
        description: faker.commerce.productName(),
      };
      cy.request('POST', 'tasks', task).then(response => {
        expect(response.body).to.have.any.keys(
          'id',
          'title',
          'status',
          'description',
        );
      });
    }
  });

  it('List All Tasks', () => {
    cy.request('GET', '/tasks').then(response => {
      expect(response.body).to.have.lengthOf(3);
    });
  });

  it('Delete Tasks', () => {
    cy.request('GET', '/tasks')
      .its('body')
      .each(task => {
        const taskId = task.id;
        cy.request('DELETE', `/tasks/${taskId}`).then(response => {
          cy.log(response);
        });
      });
  });
});
