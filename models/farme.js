const mongoose = require("mongoose");

const farme = new mongoose.Schema({
    device_id : String,
    farme : {type : Object}
},{timestamps : true});

module.exports = mongoose.model('data_farme',farme);