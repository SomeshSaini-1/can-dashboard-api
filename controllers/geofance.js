const Geofance = require("../models/geofance_model");

exports.Add_geofance = async (req,res) =>{
    try {
        const {Name,Type,Tag,Comment,Data} = req.body;

        const data = new Geofance({Name,Type,Tag,Comment,Data});

        await data.save();

        res.status(200).json({message : "Geofance added successfully."});
    } catch (error) {
        console.error(error);
        res.status(500).json({message : "Server error.",error: error.message});
    }
}


exports.Get_geofance = async (req,res) => {
    try {
        const {name} = req.body;
        let data ;
        if(name === "all"){
            data = await Geofance.find();
        }else{
            data = await Geofance.find({name});
        }

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({message : "Server error.",error: error.message});
    }
}


