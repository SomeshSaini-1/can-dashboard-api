const user_model = require("../models/user_model");

exports.add_driver = async (req, res) => {
    try {
        const {
            driver_name,
            driver_num,
            driver_vhical_num,
            vhical_company,
            date,
            status,
            comment
         } = req.body;

        const user = new user_model({ driver_name, driver_num, driver_vhical_num, vhical_company, date, status, comment });
        await user.save();

        res.status(200).json({ message: "Data inserted." });

    } catch (error) {
        console.error("db error : ", error);
        res.status(500).json({ message: "db error", err: error });
    }
}



exports.get_driver = async (req, res) => {
    try {

        const { driver_name } = req.body;

        let user;
        if (driver_name === "all") {
            user = await user_model.find();
        } else {
            user = await user_model.find({ driver_name });
        }

        res.status(200).json( user );
    } catch (error) {
        console.error("db error : ", error);
        res.status(500).json({ message: error })
    }
}


exports.delete_driver = async (req, res) => {
    try {
        const { driver_name } = req.body;

        console.log(driver_name,"driver_name")
        // Validate input
        if (!driver_name) {
            return res.status(400).json({ message: "Driver name is required" });
        }

        // Execute the delete operation
        const result = await user_model.deleteOne({ driver_name : driver_name });

        // Check if any document was deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Driver not found" });
        }

        res.status(200).json({ message: "Driver deleted successfully" });

    } catch (error) {
        console.error('Error deleting driver:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

