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

  it('Update Tasks', () => {
    cy.request('GET', '/tasks')
      .its('body')
      .each(task => {
        cy.request('PATCH', `/tasks/${task.id}/status`, {
          status: 'DONE',
        }).then(response => {
          expect(response.body).to.have.property('status', 'DONE');
        });
      });
  });

  it('Filter Tasks', () => {
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
    cy.request('GET', 'tasks?status=OPEN').then(response => {
      expect(response.body).to.have.lengthOf(1);
    });
  });

  it('Get Task', () => {
    cy.request('GET', '/tasks')
      .its('body')
      .each(task => {
        const taskId = task.id;
        cy.request('GET', `/tasks/${taskId}`).then(response => {
          expect(response.body).to.have.any.keys(
            'id',
            'title',
            'status',
            'description',
          );
        });
      });
  });

  it('Delete All Tasks', () => {
    cy.request('GET', '/tasks')
      .its('body')
      .each(task => {
        cy.request('DELETE', `/tasks/${task.id}`).then(response => {
          cy.log('task deleted');
        });
      });
    cy.request('GET', '/tasks').then(response => {
      expect(response.body).to.have.lengthOf(0);
    });
  });
});
