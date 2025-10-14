const mongoose = require('mongoose');

const alart = new mongoose.Schema({
    alart_type : {type : String},
    data : {type : Object}
},{timestamps : true});

module.exports = mongoose.model("Alart",alart);