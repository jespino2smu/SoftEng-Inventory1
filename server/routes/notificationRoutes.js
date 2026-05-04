const express = require('express');
const fs = require('fs');
const router = express.Router();
const notificationController = require('./notificationController');
const { authenticateToken } = require('../tokens');

module.exports = router;

module.exports.setPool = function(pool) {
    notificationController.pool = pool;
};

router.post('/check-stock-discrepancies', authenticateToken, notificationController.getStockDiscrepancies);









const notificationFile = './notifications.json';

const getNotifications = () => {
  const data = fs.readFileSync(notificationFile);
  return JSON.parse(data);
};

const readData = () => {
  if (!fs.existsSync(notificationFile)) {
    fs.writeFileSync(notificationFile, JSON.stringify([]));
  }
  const data = fs.readFileSync(notificationFile, 'utf8');
  return JSON.parse(data);
};

// Helper: Write notifications to JSON
const writeData = (data) => {
  fs.writeFileSync(notificationFile, JSON.stringify(data, null, 2));
};

router.post('/get', (req, res) => {
  const notifications = getNotifications();
  res.json(notifications);
});

router.patch('/set-read/:id', (req, res) => {
  const { id } = req.params;
  const notifications = JSON.parse(fs.readFileSync(notificationFile));
  
  const index = notifications.findIndex(n => n.id === parseInt(id));
  
  if (index !== -1 && notifications[index].type === 'info') {
    notifications[index].isRead = !notifications[index].isRead;
    fs.writeFileSync(notificationFile, JSON.stringify(notifications, null, 2));
    res.json(notifications[index]);
  } else {
    res.status(400).json({ message: "Only 'info' notifications can be toggled." });
  }
});

router.post('/add', (req, res) => {
  const { type, message } = req.body;
  const notifications = readData();

  const newNotif = {
    id: Date.now(),
    type, // 'red', 'yellow', or 'info'
    message,
    timestamp: new Date().toISOString(),
    isRead: false
  };

  notifications.push(newNotif);
  writeData(notifications);
  res.status(201).json(newNotif);
});




