const database = require('../config/db');

exports.getDeliveryById = (req, res) => {
  const { id } = req.params;
  const request = `SELECT * FROM delivery_details WHERE id = ${id}`;

  database.query(request)
    .then(response => response.rows[0]
      ? res.status(200).send(response.rows)
      : res.status(404).send({ error: 'Delivery not found' })
    )
    .catch(error => res.status(500).send(error));
}

exports.getDeliveriesByUserId = (req, res) => {
  const { userId } = req.params;
  const request = `SELECT * FROM delivery_details WHERE id = ${userId}`;

  database.query(request)
    .then(response => res.status(200).send(response))
    .catch(error => res.status(500).send(error));
}

exports.addDelivery = (req, res) => {
  const { userId } = req.params;
  const delivery = req.body;
  const request = `INSERT INTO delivery_details (user_id, address, city, zip_code, phone_number)
                   VALUES (${userId}, '${delivery.address}', '${delivery.city}', 
                          '${delivery.zipCode}', '${delivery.phoneNumber}')`;

  database.query(request)
    .then(response => res.sendStatus(201))
    .catch(error => res.status(500).send(error));
}

exports.updateDelivery = (req, res) => {
  const { id, userId } = req.params;
  const delivery = req.body;
  const request = `UPDATE delivery_details SET user_id = ${userId}, 
                   address = '${delivery.address}', city = '${delivery.city}', 
                   zip_code = '${delivery.zipCode}', phone_number = '${delivery.phoneNumber}'
                   WHERE id = ${id} RETURNING *`;

  database.query(request)
    .then(response => response.rows[0]
      ? res.status(200).send(response.rows)
      : res.status(404).send({ error: 'Delivery not found' })
    )
    .catch(error => res.status(500).send(error));
}

exports.deleteDelivery = (req, res) => {
  const { id } = req.params;
  const request = `DELETE FROM delivery_details WHERE id = ${id} RETURNING *`;

  database.query(request)
    .then(response => response.rows[0]
      ? res.status(200).send(response.rows)
      : res.status(404).send({ error: 'Delivery data not found' })
    )
    .catch(error => res.status(500).send(error));
}