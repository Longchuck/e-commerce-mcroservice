const express = require('express');
const mongoose = require('mongoose');
const User = require('./user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

app.use(express.json());

app.post('/user/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkEmail = await User.findOne({ email });
    if (checkEmail) return res.status(200).json({ error: 'email exist' });
    const creUser = await User.create({
      email,
      password,
    });
    return res.status(201).json(creUser);
  } catch (error) {
    return res.status(500).json({
      status: error.message,
    });
  }
});

app.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found!!' });
    if (user.password !== password)
      return res.status(401).json({ error: 'Wrong password!!' });
    const payload = {
      email,
    };
    jwt.sign(payload, 'secretkey', (err, token) => {
      if (err)
        return res.status(500).json({
          status: err.message,
        });
      return res.status(200).json({
        email: user.email,
        accessToken: token,
      });
    });
  } catch (error) {
    return res.status(500).json({
      status: error.message,
    });
  }
});
//listen port

app.listen(PORT, () => {
  console.log(`Authenticate running on port ${PORT}`);
});
