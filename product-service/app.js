const express = require('express');
const mongoose = require('mongoose');
const Product = require('./product');
const { authenticate } = require('./isAuth');
const amqp = require('amqplib');
require('dotenv').config();

const amqpServer = 'amqp://localhost:5672';
const app = express();
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
  await chanel.assertQueue('BUY_PRODUCTS');
}

connect_amqp();
app.use(express.json());

app.post('/product/create', authenticate, async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const product = await Product.create({ name, description, price });
    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/product/buy', authenticate, async (req, res) => {
  try {
    const { ids } = req.body;
    const products = await Product.find({
      _id: {
        $in: ids,
      },
    });
    chanel.sendToQueue(
      'ORDER_PRODUCTS',
      Buffer.from(JSON.stringify({ products, email: req.email }))
    );
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//listen port
app.listen(PORT, () => {
  console.log(`Product running on port ${PORT}`);
});
