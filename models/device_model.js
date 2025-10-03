const mongoose = require("mongoose");

const devie_schema = new mongoose.Schema({
    device_id : {type : String, require : true , unique : true},
    device_name : String,
    device_mode : String,
    date : String,
    Assing_to : String,
    comment : String,
    status : String
},{timestamps  : true});

module.exports = mongoose.model('Device_model', devie_schema);
