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


exports.Delete_geofance = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ message: "Missing 'id' in request body." });
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id." });

        const deleted = await Geofance.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Geofance not found." });

        return res.status(200).json({ message: "Geofance deleted successfully.", id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
}

