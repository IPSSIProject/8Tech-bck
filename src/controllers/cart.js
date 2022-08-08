const database = require('../config/db');

/** Get all products in user cart */
exports.getProducts = (req, res) => {
  const { userId } = req.params;
  const request = `SELECT product_id FROM cart WHERE user_id = ${userId}`;

  database.query(request)
    .then(response => response.rows[0]
      ? res.status(200).send(response.rows)
      : res.status(404).send({ error: response })
    )
    .catch(error => res.status(500).send(error));
}

/** Add product in user cart */
exports.addProduct = (req, res) => {
  const { userId, productId } = req.params;
  const request = `INSERT INTO cart (user_id, product_id)
                   VALUES (${userId}, ${productId})`;

  database.query(request)
    .then(response => res.status(201).send(response))
    .catch(error => res.status(500).send(error));
}

/** Remove one product from user cart */
exports.deleteProduct = (req, res) => {
  const { userId, productId } = req.params;
  const request = `DELETE FROM cart WHERE id IN
                   (SELECT id FROM cart WHERE user_id = ${userId} 
                   AND product_id = ${productId} LIMIT 1) 
                   RETURNING *`;

  database.query(request)
    .then(response => response.rows[0]
      ? res.status(200).send(response.rows)
      : res.status(404).send({ error: 'User not found' })
    )
    .catch(error => res.status(500).send(error));
}

/** Remove all identical products from user cart */
exports.deleteIdenticalProducts = (req, res) => {
  const { userId, productId } = req.params;
  const request = `DELETE FROM cart WHERE user_id = ${userId} 
                   AND product_id = ${productId} RETURNING *`;

  database.query(request)
    .then(response => response.rows[0]
      ? res.status(200).send(response.rows)
      : res.status(404).send({ error: 'User not found' })
    )
    .catch(error => res.status(500).send(error));
}