const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token)
      return res.status(401).json({
        error: "Unauthorize",
      });
    jwt.verify(token.split(' ')[1], 'secretkey', (err, payload) => {
      console.log(payload);
      if (err)
        return res.status(401).json({
          error: err.message,
        });
      req.email = payload.email;
    });
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
