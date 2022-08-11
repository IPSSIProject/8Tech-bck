const database = require('../config/db');

/** Get all products in user cart */
exports.getProducts = (req, res) => {
    const { userId } = req.params;
    const request = `SELECT product_id, quantity FROM cart WHERE user_id = ${userId}`;

    database.query(request)
        .then(response => res.status(200).send(response.rows))
        .catch(error => res.status(500).send(error));
}

/** Add product in user cart */
exports.addProduct = (req, res) => {
    const { userId, productId } = req.params;
    // On essaie d'insérer une nouvelle ligne
    // Si cette ligne existe déjà (basé sur user_id & product_id) on modifie la valeur quantity de cette ligne
    const request = `INSERT INTO cart(user_id, product_id, quantity) VALUES(${userId}, ${productId}, 1)
                    ON CONFLICT (user_id, product_id) 
                    DO UPDATE SET quantity = cart.quantity + 1 RETURNING *`;

    database.query(request)
        .then(response => res.status(201).send(response.rows[0]))
        .catch(error => res.status(500).send(error));
}

exports.decrementQuantityProduct = (req, res) => {
    const { userId, productId } = req.params;

    const request = `UPDATE cart SET quantity = quantity - 1
                        WHERE user_id = ${userId} AND product_id = ${productId}
                        RETURNING *`

    database.query(request)
        .then(response => res.status(201).send(response.rows[0]))
        .catch(error => res.status(500).send(error));
}

/** Remove one product from user cart */
exports.deleteProduct = (req, res) => {
    const { userId, productId } = req.params;
    const request = `DELETE FROM cart
                     WHERE user_id = ${userId} AND product_id = ${productId}
                     RETURNING *`;

    database.query(request)
        .then(response => response.rows[0]
            ? res.status(200).send(response.rows[0])
            : res.status(404).send({ error: 'Not found' })
        )
        .catch(error => res.status(500).send(error));
}
// On remove tous les articles du user
exports.deleteAllProducts = (req, res) => {
    const { userId } = req.params;
    const request = `DELETE FROM cart WHERE user_id = ${userId} 
                     RETURNING *`;

    database.query(request)
        .then(response => response.rows
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
