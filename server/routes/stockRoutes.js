const express = require('express');
const router = express.Router();
const stockController = require('./stockController');

module.exports = router;

module.exports.setPool = function(pool) {
    stockController.pool = pool;
};
router.post('/get-products', stockController.getProducts);