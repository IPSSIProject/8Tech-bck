const database = require('../config/db');

exports.getAllOrders = (req, res) => {
  const request = `SELECT * FROM orders INNER JOIN delivery_details
                   ON orders.delivery_id = delivery_details.id`;

  database.query(request)
    .then(response => res.status(200).send(response.rows))
    .catch(error => res.status(500).send(error));
}

exports.addOrder = (req, res) => {
  const order = req.body;
  const request = `INSERT INTO orders (delivery_id, date)
                   VALUES (${order.delivery_id}, '${order.date}')`;

  database.query(request)
    .then(response => res.status(201).send(response))
    .catch(error => res.status(500).send(error));

}

exports.deleteOrder = (req, res) => {
  const id = req.params.id;
  const request = `DELETE FROM orders WHERE id = ${id} RETURNING id`

  database.query(request)
    .then(response => response.rows[0]
      ? res.status(200).send(response.rows)
      : res.status(404).send({ error: 'Order not found' })
    )
    .catch(error => res.status(500).send(error));
}

exports.getOrder = (req, res) => {
  const { id } = req.params;
  const request = `SELECT * FROM orders INNER JOIN delivery_details
                   ON orders.delivery_id = delivery_details.id
                   WHERE orders.id = '${id}'`

  database.query(request)
    .then(response => response.rows[0]
      ? res.status(200).send(response.rows)
      : res.status(404).send({ error: 'Order not found' })
    )
    .catch(error => res.status(500).send(error));
}

exports.getOrdersByUserId = (req, res) => {
  const { userId } = req.params;
  const request = `SELECT * FROM orders INNER JOIN delivery_details
                   ON orders.delivery_id = delivery_details.id
                   WHERE delivery_details.userId = '${userId}'`

  database.query(request)
    .then(response => response.rows)
    .catch(error => res.status(500).send(error));
}

exports.updateOrder = (req, res) => {
  const { id } = req.params;
  const order = req.body;
  const request = `UPDATE orders
                   SET delivery_id = ${order.delivery_id}, date = '${order.date}'
                   WHERE id = ${id} RETURNING *;`

  database.query(request)
    .then(response => response.rows[0]
      ? res.status(200).send(response.rows)
      : res.status(404).send({ error: 'Order not found' })
    )
    .catch(error => res.status(500).send(error));
}