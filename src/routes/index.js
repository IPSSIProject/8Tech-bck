/** Controllers */
const userControllers = require('../controllers/users');
const productControllers = require('../controllers/products');
const orderControllers = require('../controllers/orders');
const cartControllers = require('../controllers/cart');
const deliveryControllers = require('../controllers/deliveries');
const categoriesControllers = require('../controllers/category');

/** Models */
const userModel = require('../models/user');
const orderModel = require('../models/order');
const productModel = require('../models/product');
const cartModel = require('../models/cart');
const deliveryModel = require('../models/delivery');

/** Middlewares */
const { checkUserAlreadyExist } = require('../middlewares/users');
const {
  checkIfParamIsNumber,
  checkUserTokenFormat,
  checkUserTokenId,
  checkModelFields
} = require('../middlewares/base');

/** Router */
module.exports = (app) => {
  /** Users route */
  app.route('/api/users')
      .get(userControllers.getAllUsers); // Admin
  app.route('/api/user/:id')
      .get(
          [checkIfParamIsNumber, checkUserTokenId('id')],
          userControllers.getUser
      )
      .put(
          [checkIfParamIsNumber, checkUserTokenId('id'), checkModelFields(userModel)],
          userControllers.updateUser
      )
      .delete(checkIfParamIsNumber, userControllers.deleteUser); // Admin
  app.route('/api/user/registration')
      .post(
          [checkModelFields(userModel), checkUserAlreadyExist],
          userControllers.registration
      );
  app.route('/api/user/authentication')
      .post(userControllers.authentication);

  /** Products route */
  app.route('/api/products')
      .post(checkModelFields(productModel), productControllers.addProduct) // Admin
      .get(productControllers.getAllProducts);
  app.route('/api/product/:id')
      .get(
          checkIfParamIsNumber,
          productControllers.getProduct
      )
      .put(
          [checkIfParamIsNumber, checkModelFields(productModel)],
          productControllers.updateProduct
      ) // Admin
      .delete(checkIfParamIsNumber, productControllers.deleteProduct); // Admin

  /** Orders route */
  app.route('/api/orders')
      .post(checkModelFields(orderModel), orderControllers.addOrder)
      .get(orderControllers.getAllOrders); // Admin
  app.route('/api/order/:id')
      .put(
          [checkIfParamIsNumber, checkModelFields(orderModel)],
          orderControllers.updateOrder
      ) // Admin
      .delete(checkIfParamIsNumber, orderControllers.deleteOrder);
  app.route('/api/order/:userId/:id')
      .get(
          [checkIfParamIsNumber, checkUserTokenId('userId')],
          orderControllers.getOrder
      );
  app.route('/api/order/:userId')
      .get(
          [checkIfParamIsNumber, checkUserTokenId('userId')],
          orderControllers.getOrdersByUserId
      );

  /** Cart route */
  app.route('/api/cart/:userId')
      .get(
          [checkIfParamIsNumber, checkUserTokenId('userId')],
          cartControllers.getProducts
      )
      .delete(
          [checkIfParamIsNumber, checkUserTokenId('userId')],
          cartControllers.deleteAllProducts
      )
  ;
  app.route('/api/cart/:userId/:productId')
      .post(
          [checkIfParamIsNumber,  checkUserTokenId('userId')],
          cartControllers.addProduct
      )
      .delete(
          [checkIfParamIsNumber, checkUserTokenId('userId')],
          cartControllers.deleteProduct
      )
      .put(
          [checkIfParamIsNumber, checkUserTokenId('userId')],
          cartControllers.decrementQuantityProduct
      )
  app.route('/api/cart/:userId/:productId/all')
      .delete(
          [checkIfParamIsNumber, checkUserTokenId('userId')],
          cartControllers.deleteIdenticalProducts
      );

  /** Deliveries route */
  app.route('/api/delivery/:userId')
      .get(
          [checkIfParamIsNumber, checkUserTokenId('userId')],
          deliveryControllers.getDeliveriesByUserId
      )
      .post(
          [checkIfParamIsNumber, checkUserTokenId('userId'), checkModelFields(deliveryModel)],
          deliveryControllers.addDelivery
      );
  app.route('/api/delivery/:userId/:id')
      .get(
          [checkIfParamIsNumber, checkUserTokenId('userId')],
          deliveryControllers.getDeliveryById
      )
      .put(
          [checkIfParamIsNumber, checkUserTokenId('userId'), checkModelFields(deliveryModel)],
          deliveryControllers.updateDelivery
      )
      .delete(
          [checkIfParamIsNumber, checkUserTokenId('userId')],
          deliveryControllers.deleteDelivery
      );

  // Categories route
  app.route('/api/categories')
      .get(categoriesControllers.getAllCategories);
}
