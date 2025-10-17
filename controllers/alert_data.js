const Alert = require("../models/alert_model");

exports.add_alert = async (req,res) => {
    try {
        const {alert_type, data} = req.body;
        if(!alert_type || !data){
            return res.status(400).json({message : "alert type and data are required."});
        }

        await Alert.create({alert_type,data});

        res.status(200).json({message : "Data inserted successfully."});
    } catch (error) {
        console.error(error);
        res.status(500).json({message : "server error.",error : error.message});
    }
}


exports.get_alert = async (req,res) => {
    try {
        const {alert_type, page = 1, limit = 10} = req.body;
        let skip = (page - 1) * limit;

        if(!alert_type) return res.status(400).json({message : "alert_type field is required."})
        
        const query = await Alert.find({alert_type}).sort({createdAt : -1}).skip(skip).limit(limit);

        res.status(200).json({success : true , data : query});

    } catch (error) {
        console.log(error);
        res.status(500).json({message : 'Server error',error : error.message});
    }
}