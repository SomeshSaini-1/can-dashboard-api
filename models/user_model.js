const mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
    driver_name : String,
    driver_num : Number,
    driver_vhical_num : String,
    vhical_company : String,
    date : String,
    status : String,
    comment : String
},{timestamps : true});

module.exports = mongoose.model('user_model',user_schema);
