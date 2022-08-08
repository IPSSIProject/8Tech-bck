const supertest = require('supertest');
const createServer = require('../server');
const database = require('../config/db');

const app = createServer();

/** Create fake user and generate token */
beforeAll(done => {
  const request = `INSERT INTO products (id, name, category_id, subcategory_id, brand, price, promotion, image)
                   OVERRIDING SYSTEM VALUE
                   VALUES (999, 'test', 1, 1, 'test', 10, 0, 'test')`;

  database.query(request)
    .then(() => done())
    .catch(error => console.log(error))
});

describe('products with unknown id', () => {
  /** Testing product get with incorrect id */
  it('should return 404 with an error message', async () => {
    await supertest(app)
      .get('/api/product/1000')
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(expect.any(Object));
      });
  });

  /** Testing product update with incorrect id */
  it('should return 404 with an error message', async () => {
    await supertest(app)
      .put('/api/product/1000')
      .send({
        name: 'test',
        category_id: 1,
        subcategory_id: 1,
        brand: 'test',
        price: 10,
        promotion: 0,
        image: 'testeeeeeeeeee'
      })
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(expect.any(Object));
      });
  });

  /** Testing product delete with incorrect id */
  it('should return 404 with an error message', async () => {
    await supertest(app)
      .delete('/api/product/1000')
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(expect.any(Object));
      });
  });
});

describe('product with incorrect fields value', () => {
  /** Testing user udpate with incorrect fields value */
  it('should return 422 with an error message', async () => {
    await supertest(app)
      .post('/api/products')
      .send({
        name: '',
        category_id: 1,
        subcategory_id: 1,
        brand: 'UNI',
        price: 550,
        promotion: 0,
        image: 'UNI'
      })
      .then(response => {
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual(expect.any(Object));
      });
  });

  it('should return 422 with an error message', async () => {
    await supertest(app)
      .put('/api/product/10')
      .send({
        name: '',
        category_id: 1,
        subcategory_id: 1,
        brand: 'UNI',
        price: 550,
        promotion: 0,
        image: 'UNI'
      })
      .then(response => {
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual(expect.any(Object));
      });
  });
});

describe('product controller tests success', () => {
  /** Testing product creation success */
  it('should return 201 with a success message', async () => {
    await supertest(app)
      .post('/api/products')
      .send({
        name: 'test',
        category_id: 1,
        subcategory_id: 1,
        brand: 'test',
        price: 10,
        promotion: 0,
        image: 'testeeeeeee'
      })
      .then(response => {
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(expect.any(Object))
      })
  })

  /** Testing query all products */
  it('should return 200 with an array of products', async () => {
    await supertest(app)
      .get('/api/products')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.any(Object))
      })
  })

  /** Testing product query by id success */
  it('should return 200 status with a product', async () => {
    await supertest(app)
      .get('/api/product/999')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.any(Object))
      })
  })

  /** Testing product update success */
  it('should return 200 status with a success message', async () => {
    await supertest(app)
      .put('/api/product/999')
      .send({
        name: 'UNIa',
        category_id: 1,
        subcategory_id: 1,
        brand: 'UNI',
        price: 550,
        promotion: 0,
        image: 'UNIiuhiuhiuhiuhuihiuh'
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.any(Object))
      })
  });

  /** Testing product delete success */
  it('should return 200 status with success message', async () => {
    await supertest(app)
      .delete('/api/product/999')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.any(Object))
      })
  });
});