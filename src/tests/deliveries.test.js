const supertest = require('supertest');
const createServer = require('../server');
const database = require('../config/db');

const app = createServer();
let token = null;

/** Create fake delivery and generate token */
beforeAll(done => {
  const request = `INSERT INTO delivery_details (id, address, city, zip_code, phone_number, user_id)
                   OVERRIDING SYSTEM VALUE
                   VALUES (999, 'test', 'test', 'test', '0123456789', 59)`;

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

describe('delivery test with incorrect fields value', () => {
  /** Update delivery by id */
  it('should return 422 with an error message', async () => {
    await supertest(app)
      .put('/api/delivery/59/999')
      .set('Authorization', `bearer ${token}`)
      .send({
        address: '',
        city: '',
        zipCode: '',
        phoneNumber: ''
      })
      .then(response => {
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual(expect.any(Object));
      });
  });
})

describe('delivery test with incorrect id', () => {
  /** Update delivery by id */
  it('should return 422 with an error message', async () => {
    await supertest(app)
      .put('/api/delivery/59/1000')
      .set('Authorization', `bearer ${token}`)
      .send({
        address: 'test',
        city: 'test',
        zipCode: 'test',
        phoneNumber: '0123456789'
      })
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(expect.any(Object));
      });
  });
});

describe('delivery tests success', () => {
  /** Add delivery */
  it('should return 201 with a success message', async () => {
    await supertest(app)
      .post('/api/delivery/59')
      .set('Authorization', `bearer ${token}`)
      .send({
        address: 'test',
        city: 'test',
        zipCode: 'test',
        phoneNumber: '0123456789'
      })
      .then(response => {
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(expect.any(Object));
      });
  });

  /** Get delivery by id */
  it('should return 200 with a delivery', async () => {
    await supertest(app)
      .get('/api/delivery/59/999')
      .set('Authorization', `bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.any(Object));
      });
  });

  /** Get deliveries by user id */
  it('should return 200 with an array of deliveries', async () => {
    await supertest(app)
      .get('/api/delivery/59')
      .set('Authorization', `bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.any(Object));
      });
  });

  /** Update delivery by id */
  it('should return 200 with a success message', async () => {
    await supertest(app)
      .put('/api/delivery/59/999')
      .set('Authorization', `bearer ${token}`)
      .send({
        address: 'test',
        city: 'test',
        zipCode: 'test',
        phoneNumber: '0123456789'
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.any(Object));
      });
  });

  /** Delete delivery by id */
  it('should return 200 with a success message', async () => {
    await supertest(app)
      .delete('/api/delivery/59/999')
      .set('Authorization', `bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.any(Object));
      });
  });
})