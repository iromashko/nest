const faker = require('faker');

describe('Tasks API', () => {
  it('Create Task', () => {
    cy.log('POST /tasks => Task');
    cy.log('GET 4 TASKS');

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

  it('Task not found', () => {
    cy.request({
      method: 'GET',
      url: '/tasks/34579',
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.eq(404);
      expect(response.body.error).to.eq('Not Found');
      expect(response.body.message).to.not.string('Cannot GET');
    });
  });

  it('List All Tasks', () => {
    cy.request('GET', '/tasks').then(response => {
      expect(response.body).to.have.lengthOf(3);
    });
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

  it('Task status invalid', () => {
    cy.log('PATCH /tasks/:id/status');
    cy.log('in: invalid status');
    cy.log('out: status 400');
    cy.request('GET', '/tasks')
      .its('body')
      .each(task => {
        cy.request({
          method: 'PATCH',
          url: `/tasks/${task.id}/status`,
          body: {
            status: 'INVALIDSTATUS',
          },
          failOnStatusCode: false,
        }).then(response => {
          expect(response.status).to.eq(400);
        });
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

  it('Delete Task not found', () => {
    cy.request({
      method: 'DELETE',
      url: '/tasks/93874',
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.eq(404);
      expect(response.body.message).to.not.string('Cannot DELETE');
    });
  });

  it('Delete Single', () => {
    cy.request('GET', '/tasks')
      .its('body')
      .each(task => {
        cy.log(`delete ${task.id}`);
        cy.request('DELETE', `/tasks/${task.id}`).then(response => {
          expect(response.status).to.eq(200);
        });
      });
  });
});

describe('Auth API', () => {
  it('User signup', () => {
    cy.log('POST /auth/signup');
    cy.log('in: {username, password}');
    cy.log('out: status 201');

    cy.request({
      url: '/auth/signup',
      method: 'POST',
      body: {
        username: 'TEST',
        password: '563453dfgdfgdGDGF',
      },
    }).then(response => {
      expect(response.status).to.have.eq(201);
    });
  });
  it('Weak password', () => {
    cy.log('POST /auth/signup');
    cy.log('in: password 123456');
    cy.log('out: status 400');

    cy.request({
      url: '/auth/signup',
      method: 'POST',
      body: {
        username: 'TEST',
        password: '123456',
      },
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.have.eq(400);
    });
  });

  it('Signin User', () => {
    cy.log('POST /auth/signin');
    cy.log('in: USER ');
    cy.log('out: status 201');

    cy.request({
      url: '/auth/signin',
      method: 'POST',
      body: {
        username: 'TEST',
        password: '563453dfgdfgdGDGF',
      },
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.have.eq(201);
      expect(response.body).to.have.property('accessToken');
    });
  });

  it('Invalid password', () => {
    cy.log('POST /auth/signin');
    cy.log('in: INVALID PASSWORD');
    cy.log('out: status 401');

    cy.request({
      url: '/auth/signin',
      method: 'POST',
      body: {
        username: 'TEST',
        password: '563453dfgdfgdGDGFf',
      },
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.have.eq(401);
    });
  });

  it('Unique Username', () => {
    cy.log('POST /auth/signup');
    cy.log('in: password lsksjs4l53LKS');
    cy.log('out: status 500');

    cy.request({
      url: '/auth/signup',
      method: 'POST',
      body: {
        username: 'NOTUNIQUE',
        password: 'lsksjs4l53LKS',
      },
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.have.eq(201);
    });
    cy.request({
      url: '/auth/signup',
      method: 'POST',
      body: {
        username: 'NOTUNIQUE',
        password: 'lsksjs4l53LKS',
      },
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.have.eq(409);
    });
  });
});

// const crypto = require('crypto');
// const pw = crypto.randomBytes(10).toString('hex');
// const email = `${usr}@${usr}.com`;
