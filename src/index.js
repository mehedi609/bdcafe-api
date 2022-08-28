const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const createError = require('http-errors');
require('dotenv').config();

const categoryRoutes = require('./routes/category');
const dishRoutes = require('./routes/dish');

const app = express();

app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  );
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

const PORT = process.env.PORT;
const DATABASE = process.env.DATABASE;
const PREFIX = '/' + process.env.PREFIX;

app.use(PREFIX, categoryRoutes);
app.use(PREFIX, dishRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!' });
});

app.listen(PORT, async () => {
  console.log('🚀 ~ file: index.js ~ line 14 ~ app.listen ~ port', PORT);

  try {
    await mongoose.connect(DATABASE);
    console.log('.');
    console.log(
      '🚀 ~ file: index.js ~ line 29 ~ app.listen ~ ...Connected to MONGO..',
    );
  } catch (error) {
    console.log('🚀 ~ file: index.js ~ line 31 ~ app.listen ~ error', error);
  }
});

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  // res.status = err.status || 500;
  console.log(err.status);

  res.status(err.status || 500).json({
    error: {
      status: err.status || 500,
      message: err.message || 'Internal Server Error',
    },
  });
});
