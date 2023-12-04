const express = require('express');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    email: {type: String, default: ''},
    password: {type: String, default: ''},
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: ''},
    deleteAt: {type: Date, default: ''},
})

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;