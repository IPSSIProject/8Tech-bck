const supertest = require('supertest');
const createServer = require('../server');
const database = require('../config/db');

const app = createServer();

let token = null;

/** Create fake order and generate token */
beforeAll(done => {
  const request = `INSERT INTO orders (id, delivery_id, date)
                   OVERRIDING SYSTEM VALUE
                   VALUES (999, 2, '21/02/2022')`;

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

describe('Orders test incorrect id', () => {
  /** Testing get order by user id with incorrect id */
  it('should return 404 with an error message', async () => {
    await supertest(app)
      .get('/api/order/59/1000')
      .set('Authorization', `bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(expect.any(Object));
      });
  });

  /** Testing update order with incorrect id */
  it('should return 404 with an error message', async () => {
    await supertest(app)
      .put('/api/order/1000')
      .send({
        delivery_id: 2,
        date: '25/04/2024'
      })
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(expect.any(Object));
      });
  });

  /** Testing delete order with incorrect id */
  it('should return 404 with an error message', async () => {
    await supertest(app)
      .delete('/api/order/1000')
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(expect.any(Object));
      });
  });
})

describe('Order test incorrect fields value', () => {
  /** Testing create order with incorrect fields value */
  it('should return 422 with an error message', async () => {
    await supertest(app)
      .post('/api/orders')
      .set('Authorization', `bearer ${token}`)
      .send({
        delivery_id: 2,
        date: '204'
      })
      .then(response => {
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual(expect.any(Object));
      });
  });

  /** Testing order update with incorrect fields value */
  it('should return 422 with an error message', async () => {
    await supertest(app)
      .put('/api/order/10')
      .send({
        delivery_id: 2,
        date: '024'
      })
      .then(response => {
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual(expect.any(Object));
      });
  });
});

describe('Order test success', () => {
  /** Testing order creation success */
  it('should return 201 with a success message', async () => {
    await supertest(app)
      .post('/api/orders')
      .set('Authorization', `bearer ${token}`)
      .send({
        delivery_id: 2,
        date: '25/02/2023'
      })
      .then(response => {
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(expect.any(Object))
      })
  })

  /** Testing get order success */
  it('should return 200 with an order', async () => {
    await supertest(app)
      .get('/api/order/59/999')
      .set('Authorization', `bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.any(Object))
      })
  })

  /** Testing update order success */
  it('should return 200 with a success message', async () => {
    await supertest(app)
      .put('/api/order/999')
      .send({
        delivery_id: 2,
        date: '25/04/2024'
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.any(Object))
      })
  })

  /** Testing delete order success */
  it('should return 200 with a success message', async () => {
    await supertest(app)
      .delete('/api/order/999')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.any(Object))
      })
  })

  /** Testing get all orders success */
  it('should return 200 with an array of orders', async () => {
    await supertest(app)
      .get('/api/orders')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.any(Object))
      })
  })
})