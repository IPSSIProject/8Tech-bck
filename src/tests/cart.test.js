const supertest = require('supertest');
const createServer = require('../server');
const database = require("../config/db");

const app = createServer();
let token = null;

/** Create fake cart and generate token */
beforeAll(done => {
  const request = `INSERT INTO cart (id, product_id, user_id)
                   OVERRIDING SYSTEM VALUE
                   VALUES (999, 35, 59)`;

  database.query(request)
    .then(() => {
      supertest(app)
        .post('/api/user/authentication')
        .send({ email: 'jest@test.fr', password: 'azertest123' })
        .then(response => {
          token = response.body.token;
          done();
        });
    })
    .catch(error => console.log(error))
})

describe('Cart test incorrect foreign key', () => {
  /** Get cart */
  it('should return 404 with an error message', async () => {
    await supertest(app)
      .get('/api/cart/1000')
      .set('Authorization', `bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual(expect.any(Object));
      });
  });

  /** Delete product in cart */
  it('should return 404 with an error message', async () => {
    await supertest(app)
      .get('/api/cart/1000/1000')
      .set('Authorization', `bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(expect.any(Object));
      });
  });

  /** Delete all identical products in cart */
  it('should return 404 with an error message', async () => {
    await supertest(app)
      .get('/api/cart/1000/1000/all')
      .set('Authorization', `bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(expect.any(Object));
      });
  });
});

describe('Cart test incorrect fields value', () => {
  /** Add product in cart */
  it('should return 422 with success message', async () => {
    await supertest(app)
      .post('/api/cart/a/a')
      .set('Authorization', `bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual(expect.any(Object))
      });
  });
});

describe('Cart test success', () => {
  /** Add product in cart */
  it('should return 201 with a success message', async () => {
    await supertest(app)
      .post('/api/cart/59/35')
      .set('Authorization', `bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(expect.any(Object))
      });
  });

  /** Get cart by user id */
  it('should return 200 with array of carts', async () => {
    await supertest(app)
      .get('/api/cart/59')
      .set('Authorization', `bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.any(Object))
      });
  });

  /** Delete one product by user id */
  it('should return 200 with a success message', async () => {
    await supertest(app)
      .delete('/api/cart/59/35')
      .set('Authorization', `bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.any(Object))
      });
  });

  /** Delete all identical products by user id */
  it('should return 200 with a success message', async () => {
    await supertest(app)
      .delete('/api/cart/59/35/all')
      .set('Authorization', `bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.any(Object))
      });
  });
});
