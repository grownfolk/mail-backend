// routes/mailRoutes.js
const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mailController');

router.post('/send', mailController.sendMail);
router.get('/inbox', mailController.getInbox);

module.exports = router;
