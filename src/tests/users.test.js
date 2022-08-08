const supertest = require('supertest');
const createServer = require('../server');
const jwt = require('jsonwebtoken');
const database = require('../config/db');

const app = createServer();

const randomWord = (length) => {
  let alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let word = '';

  for (let i = 0; i < length; i++)
    word += alphabet[Math.floor(Math.random() * 26)]

  return word;
}

let token = null;
const email = `${randomWord(8)}@${randomWord(8)}.${randomWord(2)}`;

/** Create fake user and generate token */
beforeAll(done => {
  const request = `INSERT INTO users (id, firstname, lastname, email_address, password)
                   OVERRIDING SYSTEM VALUE
                   VALUES (999, 'test', 'test', '${email}', 'azertest')`;

  database.query(request)
    .then(() => {
      supertest(app)
        .post('/api/user/authentication')
        .send({ email: email, password: 'azertest' })
        .then(response => {
          token = response.body.token;
          done();
        });
    })
    .catch(error => console.log(error))
})

describe('User creation tests', () => {
  /** Testing user creation success */
  it('should return 201 status and success message with user data', async () => {
    await supertest(app)
      .post('/api/user/registration')
      .send({
        firstname: 'test',
        lastname: 'test',
        email: `${randomWord(8)}@${randomWord(8)}.${randomWord(2)}`,
        password: 'azerty234'
      })
      .then(response => {
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(expect.any(Object))
      })
  });

  /** Testing user creation with incorrect fields value */
  it('should return 422 status with an error message', async () => {
    await supertest(app)
      .post('/api/user/registration')
      .send({
        firstname: '',
        lastname: '',
        email: '',
        password: ''
      })
      .then(response => {
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual(expect.any(Object))
      })
  });

  /** Testing user creation with email already existing */
  it('should return 409 status with an error message', async () => {
    await supertest(app)
      .post('/api/user/registration')
      .send({
        firstname: 'test',
        lastname: 'test',
        email: 'ab@ab.fr',
        password: 'azerty234'
      })
      .then(response => {
        expect(response.statusCode).toBe(409);
        expect(response.body).toEqual(expect.any(Object))
      })
  });
});

describe('User authentication tests', () => {
  /** Testing user authentication success */
  it('should return 200 status with jwt token', async () => {
    await supertest(app)
      .post('/api/user/authentication')
      .send({ email: email, password: 'azertest' })
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ token: expect.any(String) })
      });
  });

  /** Testing user authentication fail */
  it('should return 404 status with an error message', async () => {
    await supertest(app)
      .post('/api/user/authentication')
      .send({ email: email, password: '' })
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(expect.any(Object));
      });
  });
});

describe('Update user test', () => {
  /** Testing user update success */
  it('should return 200 with a success message', async () => {
    await supertest(app)
      .put('/api/user/999')
      .set('Authorization', `bearer ${token}`)
      .send({
        firstname: 'teste',
        lastname: 'test',
        email: email,
        password: 'azertest7',
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.any(Object));
      });
  });

  /** Testing user udpate with incorrect fields value */
  it('should return 422 with an error message', async () => {
    await supertest(app)
      .put('/api/user/999')
      .set('Authorization', `bearer ${token}`)
      .send({
        firstname: '',
        lastname: '',
        email: '',
        password: ''
      })
      .then(response => {
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual(expect.any(Object));
      });
  });

  /** Testing user update with incorrect id */
  it('should return 401 with an error message', async () => {
    await supertest(app)
      .put('/api/user/1000')
      .set('Authorization', `bearer ${token}`)
      .send({
        firstname: 'teste',
        lastname: 'test',
        email: email,
        password: 'azertest',
      })
      .then(response => {
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual(expect.any(Object));
      });
  });
});

describe('Get user tests', () => {
  /** Testing user query success */
  it('should return 200 with a user', async () => {
    await supertest(app)
      .get('/api/user/999')
      .set('Authorization', `bearer ${token}`)
      .then(response => {
        console.log(token)
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.any(Object));
      });
  });

  /** Testing user query with incorrect id */
  it('should return 401 with an error message', async () => {
    await supertest(app)
      .get('/api/user/1000')
      .set('Authorization', `bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual(expect.any(Object));
      });
  });
});

describe('Delete user tests', () => {
  /** Testing user delete success */
  it('should return 200 with a success message', async () => {
    await supertest(app)
      .delete('/api/user/999')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.any(Object));
      });
  });
  /** Testing user query with incorrect id */
  it('should return 404 with an error message', async () => {
    await supertest(app)
      .delete('/api/user/1000')
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(expect.any(Object));
      });
  });
});