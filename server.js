const express = require('express');
const connectdb = require('./config/db');
const devicerouter = require("./routes/device");
const cors = require("cors");
require('dotenv').config();

const app = express();

app.use(cors({origin :"*"}))

connectdb();

app.use(express.json());

app.use('/api',devicerouter);


app.get("/",(req,res) => {
    res.status(200).json({message : "api is working bro."});
});

const Port = process.env.Port ||  4010 ;

app.listen(Port,() => {
    console.log("server is runing...",Port);
});


