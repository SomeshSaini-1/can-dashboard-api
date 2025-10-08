const Farme = require("../models/farme");

// ✅ Add Farme Data
exports.add_farme = async (req, res) => {
    try {
        const { device_id, farme } = req.body;

        if (!device_id || !farme) {
            return res.status(400).json({ message: "device_id and farme are required" });
        }

        await Farme.create({ device_id, farme });

        res.status(200).json({ message: "Data inserted successfully." });
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Get Farme Data by Device ID
exports.get_farme = async (req, res) => {
    try {
        const { device_id, page = 1, limit = 100 } = req.body;
        const skip = (page - 1) * limit

        if (!device_id) {
            return res.status(400).json({ message: "device_id is required" });
        }

        const query = await Farme.find({ device_id }).sort({ createdAt: -1 }).skip(skip).limit(limit); // newest first

        res.status(200).json({ success: true, data: query });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


