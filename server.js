const express = require('express');
const connectdb = require('./config/db');
const devicerouter = require("./routes/device");
const alertrouter = require("./routes/alert_route");
const cors = require("cors");
require('dotenv').config();
require("./index")
const app = express();

app.use(cors({origin :"*"}))

connectdb();

app.use(express.json());

app.use('/api',devicerouter);
app.use('/api',alertrouter);

app.get("/",(req,res) => {
    res.status(200).json({message : "can api is working bro."});
});

const Port = process.env.PORT ||  4010 ;

app.listen(Port,() => {
    console.log("server is runing...",Port);
});


