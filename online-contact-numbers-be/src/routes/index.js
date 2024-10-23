const express = require('express');
const router = express.Router();
const authRoutes = require('./api/auth.routes');
const contactRoutes = require('./api/contact.routes');

router.use('/auth', authRoutes);
router.use('/contacts', contactRoutes);

module.exports = router;
