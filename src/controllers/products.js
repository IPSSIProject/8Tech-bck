const database = require('../config/db');
const jwt = require('jsonwebtoken');

// Get all products
exports.getAllProducts = (req, res) => {
  const request = 'SELECT * FROM products INNER JOIN categories ON products.category_id = categories.category_id';

  // Execute request
  database.query(request)
    .then(response => res.status(200).send(response.rows))
    .catch(error => res.status(500).send(error));
}

// Add product
exports.addProduct = (req, res) => {
  const product = req.body;
  const request = `INSERT INTO products (name, category_id, subcategory_id, brand, price, promotion, image)
                   VALUES ('${ product.name }', ${ product.category_id }, ${ product.subcategory_id },
                   '${ product.brand }', ${ product.price }, ${ product.promotion }, '${ product.image }');`

  database.query(request)
    .then(response => res.status(201).send(response))
    .catch(error => res.status(500).send(error));
}

// Delete product by id
exports.deleteProduct = (req, res) => {
  const id = req.params.id;
  const request = `DELETE FROM products WHERE id = ${id} RETURNING id`

  database.query(request)
    .then(response => response.rows[0]
      ? res.status(200).send(response.rows)
      : res.status(404).send({ error: 'User not found' })
    )
    .catch(error => res.status(500).send(error));
}

// Update product by id
exports.updateProduct = (req, res) => {
  const id = req.params.id;
  const product = req.body;
  const request = `UPDATE products
                   SET name = '${product.name}', category_id = ${product.category_id}, 
                   subcategory_id = ${product.category_id}, brand = '${product.brand}',
                   price = ${product.price}, promotion = ${product.promotion}, image = '${product.image}'
                   WHERE id = ${id} RETURNING *;`

  database.query(request)
    .then(response => response.rows[0]
      ? res.status(200).send(response.rows)
      : res.status(404).send({ error: 'User not found' })
    )
    .catch(error => res.status(500).send(error));
}

// Get product by id
exports.getProduct = (req, res) => {
  const id = req.params.id;
  const request = `SELECT * FROM products WHERE id = ${id}`;

  database.query(request)
    .then(response => response.rows[0]
      ? res.status(200).send(response.rows)
      : res.status(404).send({ error: 'User not found' })
    )
    .catch(error => res.status(500).send(error));
}
