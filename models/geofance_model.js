const Mongoose = require("mongoose");

const geofance_schema = new Mongoose.Schema({
    Name  : {type : String, default :"--"},
    Type : {type : String, required :true},
    Tag : {type : String},
    Comment : {type : String},
    Data : {type : Array, required : true}
},{timestamps :true});

module.exports = Mongoose.model('geofance',geofance_schema);

