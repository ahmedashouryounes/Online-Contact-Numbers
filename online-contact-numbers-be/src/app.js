const express = require('express');
const cors = require('cors');
require('dotenv').config();
const routes = require('./routes');
const { connectDB } = require('./config/database');
connectDB();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Routes
app.use('/api', routes);

module.exports = app;
