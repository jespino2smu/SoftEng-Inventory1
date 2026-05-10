const express = require('express');
const router = express.Router();
const stockController = require('./stockController');
const { authenticateToken } = require('../tokens');

module.exports = router;

module.exports.setPool = function(pool) {
    stockController.pool = pool;
};
router.post('/get-products', authenticateToken, stockController.getProducts);
router.post('/add-activity', authenticateToken, stockController.addActivity);
router.post('/get-stock-activities', authenticateToken, stockController.getStockActivities);
router.post('/list-products', authenticateToken, stockController.listProductQuantities);
router.post('/get-staff', authenticateToken, stockController.getStaff);
router.post('/get-issues', authenticateToken, stockController.getIssues);

