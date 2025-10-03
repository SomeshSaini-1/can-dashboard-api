const mongoose = require('mongoose');

const connectdb = async () =>{
    try{
        console.log(process.env.MONGODB_URL);
        await mongoose.connect(process.env.MONGODB_URL,{
            useNewUrlParser : true,
            useUnifiedTopology : true
        });
        console.log("Mongoodb  Connnect")
    }catch(error){
        console.error("MongoDb Connection error: ", error);
        process.exit(1);
    }

};

module.exports = connectdb;

