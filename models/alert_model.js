const mongoose = require('mongoose');

const alert = new mongoose.Schema({
    alert_type : {type : String},
    data : {type : Object}
},{timestamps : true});

module.exports = mongoose.model("Alert",alert);