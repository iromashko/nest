const faker = require('faker');

describe('Tasks API', () => {
  it('Create Task', () => {
    for (let i = 0; i < 3; i++) {
      const task = {
        title: faker.commerce.product(),
        description: faker.commerce.productName(),
      };
      cy.request('POST', 'tasks', task)
        .then(response => {
          expect(response.body).to.have.any.keys(
            'id',
            'title',
            'status',
            'description',
          );
        })
        .log(`Created ${i + 1} tasks`);
    }
  });

  it('Get Single Task', () => {
    cy.request('GET', '/tasks')
      .its('body')
      .each(task => {
        cy.log(`task ${task.id}`);
        cy.request('GET', `/tasks/${task.id}`).then(response => {
          expect(response.body).to.have.any.keys(
            'id',
            'title',
            'status',
            'description',
          );
        });
      });
  });

  it('Task not found', () => {
    cy.request({
      method: 'GET',
      url: '/tasks/notfound',
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.eq(404);
      expect(response.body.error).to.eq('Not Found');
    });
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

  it('Search Tasks', () => {
    const task = {
      title: faker.commerce.product(),
      description: 'TEST',
    };
    cy.request('POST', 'tasks', task).then(response => {
      expect(response.body).to.have.any.keys(
        'id',
        'title',
        'status',
        'description',
      );
    });
    cy.request('GET', 'tasks?search=TEST').then(response => {
      expect(response.body).to.have.lengthOf(1);
    });
    cy.request('GET', 'tasks?search=NOTFOUND').then(response => {
      expect(response.body).to.have.lengthOf(0);
    });
  });

  it('Create Task Validation', () => {
    const task = {
      title: '',
      description: '',
    };
    cy.request({
      method: 'POST',
      url: 'tasks',
      failOnStatusCode: false,
      body: task,
    }).then(response => {
      expect(response.status).to.eq(400);
    });
  });

  it.skip('Delete Single Task', () => {
    cy.request('GET', '/tasks').then(response => {
      expect(response.body).to.have.lengthOf(3);
    });
    //TODO: delete task
  });
});
