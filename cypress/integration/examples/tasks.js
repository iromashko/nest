/// <reference types="cypress" />
/// <reference types="faker" />

const faker = require('faker');

let username = faker.internet.userName();
let username2 = faker.internet.userName();
let password = '563453dfgdfgdGDGF';
let bearer = '';
let bearer2 = '';

describe('Auth API', () => {
  it('User signup', () => {
    cy.log('POST /auth/signup');
    cy.log('in: {username, password}');
    cy.log('out: status 201');

    cy.request({
      url: '/auth/signup',
      method: 'POST',
      body: {
        username,
        password,
      },
    }).then(response => {
      expect(response.status).to.have.eq(201);
    });

    cy.request({
      url: '/auth/signup',
      method: 'POST',
      body: {
        username: username2,
        password,
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
        username,
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

    //user1
    cy.request({
      url: '/auth/signin',
      method: 'POST',
      body: {
        username,
        password,
      },
      auth: {
        bearer,
      },
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.have.eq(201);
      expect(response.body).to.have.property('accessToken');
      bearer = response.body.accessToken;
      cy.log(bearer);
    });

    //user 2
    cy.request({
      url: '/auth/signin',
      method: 'POST',
      body: {
        username: username2,
        password,
      },
      auth: {
        bearer,
      },
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.have.eq(201);
      expect(response.body).to.have.property('accessToken');
      bearer2 = response.body.accessToken;
      cy.log(bearer2);
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
        username,
        password: '563453dDGFf',
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
        username,
        password,
      },
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.have.eq(409);
    });
  });
});

describe('Tasks API', () => {
  it('Create Task', () => {
    cy.log('POST /tasks => Task');
    cy.log('GET 4 TASKS');

    for (let i = 0; i < 3; i++) {
      const task = {
        title: faker.commerce.product(),
        description: faker.commerce.productName(),
      };
      cy.request({
        method: 'POST',
        url: 'tasks',
        body: task,
        auth: {
          bearer,
        },
      }).then(response => {
        expect(response.body).to.have.any.keys(
          'id',
          'title',
          'status',
          'description',
          'userId',
        );
      });
      cy.request({
        method: 'POST',
        url: 'tasks',
        body: task,
        auth: {
          bearer,
        },
      }).then(response => {
        expect(response.body).to.have.any.keys(
          'id',
          'title',
          'status',
          'description',
          'userId',
        );
        expect(response.body).to.not.have.keys('user');
      });
    }
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
      auth: {
        bearer,
      },
    }).then(response => {
      expect(response.status).to.eq(400);
    });
  });

  it('List All Tasks', () => {
    cy.request({
      method: 'GET',
      url: '/tasks',
      auth: {
        bearer,
      },
    }).then(response => {
      const userId = response.body[0].userId;
      const tasks = response.body;
      expect(response.body.length).to.be.at.least(3);
      cy.get(tasks).each(task => {
        expect(task.userId).to.equal(userId);
      });
    });
  });
  it('Filter Tasks', () => {
    const task = {
      title: faker.commerce.product(),
      description: faker.commerce.productName(),
    };
    cy.request({
      method: 'POST',
      url: 'tasks',
      body: task,
      auth: {
        bearer,
      },
    }).then(response => {
      expect(response.body).to.have.any.keys(
        'id',
        'title',
        'status',
        'description',
        'userId',
      );
    });
    cy.request({
      method: 'GET',
      url: 'tasks?status=OPEN',
      auth: {
        bearer,
      },
    }).then(response => {
      expect(response.body.length).to.be.at.least(1);
    });
  });

  it('Search Tasks', () => {
    const task = {
      title: faker.commerce.product(),
      description: 'TEST',
    };
    cy.request({
      method: 'POST',
      url: 'tasks',
      body: task,
      auth: {
        bearer,
      },
    }).then(response => {
      expect(response.body).to.have.any.keys(
        'id',
        'title',
        'status',
        'description',
        'userId',
      );
    });
    cy.request({
      method: 'GET',
      url: 'tasks?search=TEST',
      auth: {
        bearer,
      },
    }).then(response => {
      expect(response.body.length).to.be.at.least(1);
    });
    cy.request({
      method: 'GET',
      url: 'tasks?search=NOTFOUND',
      auth: {
        bearer,
      },
    }).then(response => {
      expect(response.body).to.have.lengthOf(0);
    });
  });

  it('Get Single Task', () => {
    cy.request({
      method: 'GET',
      url: '/tasks',
      auth: {
        bearer,
      },
    })
      .its('body')
      .each(task => {
        cy.log(`task ${task.id}`);
        cy.request({
          method: 'GET',
          url: `/tasks/${task.id}`,
          auth: {
            bearer,
          },
        }).then(response => {
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
      url: '/tasks/34579',
      auth: {
        bearer,
      },
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.eq(404);
      expect(response.body.error).to.eq('Not Found');
      expect(response.body).to.not.have.property('message');
    });
  });

  it('Task status invalid', () => {
    cy.log('PATCH /tasks/:id/status');
    cy.log('in: invalid status');
    cy.log('out: status 400');
    cy.request({
      method: 'GET',
      url: '/tasks',
      auth: {
        bearer,
      },
    })
      .its('body')
      .each(task => {
        cy.request({
          method: 'PATCH',
          url: `/tasks/${task.id}/status`,
          body: {
            status: 'INVALIDSTATUS',
          },
          auth: {
            bearer,
          },
          failOnStatusCode: false,
        }).then(response => {
          expect(response.status).to.eq(400);
        });
      });
  });

  it('Update Tasks', () => {
    cy.request({
      method: 'GET',
      url: '/tasks',
      auth: {
        bearer,
      },
    })
      .its('body')
      .each(task => {
        cy.request({
          method: 'PATCH',
          url: `/tasks/${task.id}/status`,
          auth: {
            bearer,
          },
          body: {
            status: 'DONE',
          },
        }).then(response => {
          expect(response.body).to.have.property('status', 'DONE');
        });
      });
  });

  it('Delete Task not found', () => {
    cy.request({
      method: 'DELETE',
      url: '/tasks/93874',
      auth: {
        bearer,
      },
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.eq(404);
      expect(response.body.message).to.be.eq(undefined);
    });
  });

  it('Delete Single', () => {
    cy.request({
      method: 'GET',
      url: '/tasks',
      auth: {
        bearer,
      },
    })
      .its('body')
      .each(task => {
        cy.log(`delete ${task.id}`);
        cy.request({
          method: 'DELETE',
          url: `/tasks/${task.id}`,
          auth: {
            bearer,
          },
        }).then(response => {
          expect(response.status).to.eq(200);
        });
      });
  });
});
