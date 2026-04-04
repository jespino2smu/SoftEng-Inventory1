const express = require('express');
const router = express.Router();
const userController = require('./userController');

module.exports = router;

module.exports.setPool = function(pool) {
    userController.pool = pool;
};


router.post('/login', userController.login);
router.post('/signup', userController.signUp);

router.post('/test', userController.test);

