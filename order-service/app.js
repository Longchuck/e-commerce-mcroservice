const amqp = require('amqplib');
const express = require('express');
require('dotenv').config();
mongoose = require('mongoose');

const amqpServer = 'amqp://127.0.0.1:5672';
const PORT = process.env.PORT || 3000;

//connection
mongoose
  .connect('mongodb://127.0.0.1:27017/e-commerce-microservice', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.log(err);
  });

var chanel, connection;
async function connect_amqp() {
  connection = await amqp.connect(amqpServer);
  chanel = await connection.createChannel();
  await chanel.assertQueue('ORDER_PRODUCTS');
}

connect_amqp().then (() => {
  chanel.consume('ORDER_PRODUCTS', (data) => {
    console.log("Da co nguoi mua hang", JSON.parse(data.content));
  })
});

