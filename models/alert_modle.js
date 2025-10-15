const mongoose = require('mongoose');

const alert = new mongoose.Schema({
    alart_type : {type : String},
    data : {type : Object}
},{timestamps : true});

module.exports = mongoose.model("Alert",alert);