const express = require('express');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const productSchema = new schema({
    name: {type: String, default: ''},
    description: {type: String, default: ''},
    price: {type: Number, default: 0},
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: ''},
    deleteAt: {type: Date, default: ''},
})

const productModel = mongoose.model('product', productSchema);
module.exports = productModel;