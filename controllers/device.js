const Device_model = require("../models/device_model");


exports.Device_add = async (req, res) => {

    try {

        const { 
            device_id,
            device_name,
            device_mode,
            date,
            Assing_to,
            comment,
            status
         } = req.body;



        const data = new Device_model({
            device_id,
            device_name,
            device_mode,
            date,
            Assing_to,
            comment,
            status
        });
        console.log(data);
        await data.save();

        res.status(200).json({ messsage: "Data inserted." })
    } catch (error) {
        console.error("db error : ", error);
        res.status(500).json({ message: error });
    }

}


exports.Get_device = async (req, res) => {
    try {
        const { device_id } = req.body;

        console.log(device_id)
        let data;
        if (device_id === "all") {
            data = await Device_model.find();
        } else {
            data = await Device_model.find({ device_id });
        }
        
// console.log(data)
        res.status(200).json(data);

    } catch (error) {
        res.status(200).json({ message: error });
        console.error("db error : ", error);
    }
}

exports.delete_device = async (req,res) => {
    try{
        
    const {device_id} = req.body;
    console.log(device_id)
    const query = await Device_model.deleteOne({device_id : device_id});
    res.status(200).json({message : "Device Deleted."});

    }catch(error){
        console.error('db error:',error);
        res.status(500).json({message : error});
    }
}
