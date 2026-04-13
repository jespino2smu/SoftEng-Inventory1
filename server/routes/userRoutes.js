const express = require('express');
const router = express.Router();
const userController = require('./userController');

const { authenticateToken } = require('../tokens');

module.exports = router;

module.exports.setPool = function(pool) {
    userController.pool = pool;
};

router.post('/login', userController.login);
router.post('/signup', userController.signUp);
router.post('/role', authenticateToken, async (req, res) => {
    try {
        res.status(200).json({ role: req.role });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Error getting role", details: error.message });
    }
});