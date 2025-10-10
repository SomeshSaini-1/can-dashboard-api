const Device_info = require('../models/device_data_models');
const All_device_info = require("../models/all_info")

// Insert or update device data
exports.add_device_data = async (req, res) => {
  try {
    const {
      device_id,
      lat, long,
      Total_VehicleDistance,
      EngineSpeed_rpm,
      WheelBasedSpeed_kph,
      EngineCoolantTemp,
      BatteryVoltage_V,
      CruiseSetSpeed_kph,
      IntakeTemp,
      Engine_Turbocharger_Boost_Pressure,
      Engine_AirIntakeManifold1_Temperature,
      Engine_AirInlet_Pressure,
      Net_Battery_Current,
      Battery_Potential_s,
      FuelLevel_Percent,
      EngineOilPressure_kPa,
      Engine_Crankcase_Pressure,
      Engine_Throttle_Position,
      Engine_Fuel_Rate,
      Pedal_Position,
      Engine_Load,
      Engine_TripFuel,
      Engine_Total_FuelUsed,
      Engine_TotalHours,
      Engine_Total_Revolutions,
      ExhaustGasTemp_C,
      TurboInletTemp_C,
      Transmission_Current_Gear,
      Catalyst_Level,
      status
    } = req.body;

    // Collect values
    const updateFields = {
      device_id,
      lat, long,
      Total_VehicleDistance,
      EngineSpeed_rpm,
      WheelBasedSpeed_kph,
      EngineCoolantTemp,
      BatteryVoltage_V,
      CruiseSetSpeed_kph,
      IntakeTemp,
      Engine_Turbocharger_Boost_Pressure,
      Engine_AirIntakeManifold1_Temperature,
      Engine_AirInlet_Pressure,
      Net_Battery_Current,
      Battery_Potential_s,
      FuelLevel_Percent,
      EngineOilPressure_kPa,
      Engine_Crankcase_Pressure,
      Engine_Throttle_Position,
      Engine_Fuel_Rate,
      Pedal_Position,
      Engine_Load,
      Engine_TripFuel,
      Engine_Total_FuelUsed,
      Engine_TotalHours,
      Engine_Total_Revolutions,
      ExhaustGasTemp_C,
      TurboInletTemp_C,
      Transmission_Current_Gear,
      Catalyst_Level,
      status
    };

    Object.keys(updateFields).forEach(
      (key) => {
        if (updateFields[key] === "") {
          delete updateFields[key];
        }
      }
    );

    // Upsert only with non-empty values
    await Device_info.updateOne(
      { device_id },
      { $set: updateFields },
      { upsert: true }
    );

    // // Upsert: update if exists, insert if not
    // await Device_info.updateOne(
    //     { device_id },
    //     {
    //         $set: {
    //             device_id,
    //             Engine_Percent_Load,
    //             Engine_Speed_rpm,
    //             Wheel_BasedSpeed_kph,
    //             Cruise_SetSpeed_kph,
    //             Engine_Coolant_Temp,
    //             Intake_Temp,
    //             Engine_Turbocharger_Boost_Pressure,
    //             Engine_AirIntakeManifold1_Temperature,
    //             Engine_AirInlet_Pressure,
    //             Net_Battery_Current,
    //             Battery_Potential_s,
    //             Battery_Voltage_V,
    //             FuelLevel_Percent,
    //             Engine_OilPressure_kPa,
    //             Engine_Crankcase_Pressure,
    //             Engine_Throttle_Position,
    //             Engine_Fuel_Rate,
    //             Pedal_Position,
    //             Engine_Load,
    //             Actual_Max_Available_EngineTorque,
    //             Engine_Trip_Fuel,
    //             Engine_Total_FuelUsed,
    //             Total_Vehicle_Distance,
    //             Engine_Total_Hours,
    //             Engine_Total_Revolutions,
    //             ExhaustGasTemp_C,
    //             TurboInletTemp_C,
    //             Transmission_Current_Gear,
    //             Catalyst_Level,
    //             Engine_TripFuel_Used,
    //             Engine_TotalFuel_Used
    //         }
    //     },
    //     { upsert: true }
    // );

    res.status(200).json({ message: "Data inserted/updated successfully." });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: error.message || error });
  }
};

exports.add_all_info = async (req, res) => {
  try {
    const {
      device_id,
      lat, long,
      Total_VehicleDistance,
      EngineSpeed_rpm,
      WheelBasedSpeed_kph,
      EngineCoolantTemp,
      BatteryVoltage_V,
      CruiseSetSpeed_kph,
      IntakeTemp,
      Engine_Turbocharger_Boost_Pressure,
      Engine_AirIntakeManifold1_Temperature,
      Engine_AirInlet_Pressure,
      Net_Battery_Current,
      Battery_Potential_s,
      FuelLevel_Percent,
      EngineOilPressure_kPa,
      Engine_Crankcase_Pressure,
      Engine_Throttle_Position,
      Engine_Fuel_Rate,
      Pedal_Position,
      Engine_Load,
      Engine_TripFuel,
      Engine_Total_FuelUsed,
      Engine_TotalHours,
      Engine_Total_Revolutions,
      ExhaustGasTemp_C,
      TurboInletTemp_C,
      Transmission_Current_Gear,
      Catalyst_Level
    } = req.body;

    const all_info = new All_device_info({
      device_id,
      lat, long,
      Total_VehicleDistance,
      EngineSpeed_rpm,
      WheelBasedSpeed_kph,
      EngineCoolantTemp,
      BatteryVoltage_V,
      CruiseSetSpeed_kph,
      IntakeTemp,
      Engine_Turbocharger_Boost_Pressure,
      Engine_AirIntakeManifold1_Temperature,
      Engine_AirInlet_Pressure,
      Net_Battery_Current,
      Battery_Potential_s,
      FuelLevel_Percent,
      EngineOilPressure_kPa,
      Engine_Crankcase_Pressure,
      Engine_Throttle_Position,
      Engine_Fuel_Rate,
      Pedal_Position,
      Engine_Load,
      Engine_TripFuel,
      Engine_Total_FuelUsed,
      Engine_TotalHours,
      Engine_Total_Revolutions,
      ExhaustGasTemp_C,
      TurboInletTemp_C,
      Transmission_Current_Gear,
      Catalyst_Level
    });
    await all_info.save();

    res.status(200).json({ message: "Data Inserted." })


  } catch (error) {
    res.status(500).json({ message: error });
    console.error("db error", error);
  }

}


// Get device data by device_id
exports.get_device_data = async (req, res) => {
  try {
    const { device_id } = req.body;
    let data;

    if (device_id === "all") {
      data = await Device_info.find();
    } else {
      data = await Device_info.find({ device_id });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: error.message || error });
  }
};


exports.get_all_data = async (req, res) => {
  try {
    const { device_id, sensorKey  } = req.body;
    let page = parseInt(req.body.page) || 1;    // current page number (default 1)
    let limit = parseInt(req.body.limit) || 86400; // items per page (default 24)
    let skip = (page - 1) * limit;

    let query = await All_device_info.find(
      { [sensorKey]: { $exists: true, $ne: null, $ne: "" } }, // filter out empty
      { [sensorKey]: 1, createdAt: 1, created_at: 1, _id: 0 }
    ).sort({ created_at: 1 }).skip(skip).limit(limit);


    // let query = await All_device_info.find(
    //   {},              
    //   { [sensorKey]: 1, createdAt: 1, created_at: 1, _id: 0 } 
    // ).sort({ created_at: 1 });             


    // let query = await All_device_info.find({device_id,data});
    res.status(200).json({ query });

  } catch (error) {
    console.error("db error", error);
    res.status(200).json({ message: error.message });
  }
}


exports.total_data = async (req, res) => {
  try {
    const { sensorKey } = req.body;
    let query = await All_device_info.aggregate([
      {
        $match: { [sensorKey]: { $exists: true, $ne: null, $ne: "", $ne: 0 } } // filter out empty values
      },
      {
        $group: {
          _id: null,
          total: { $sum: `$${sensorKey}` } // sum of the field
        }
      }
    ]);

    res.status(200).json({query});

  } catch (error) {
    console.error('db error : ', error);
    res.status(500).json({message : "db error.",error : error.message});
  }
}




exports.all_data = async (req, res) => {
  try {
    const { device_id = "all", page = 1, limit = 100 } = req.body;

    // 🧠 Dynamic filter
    let filter = {};
    if (device_id !== "all") {
      filter.device_id = device_id;
    }

    const skip = (page - 1) * limit;

    // ⚙️ Fetch latest records (sorted by createdAt)
    const data = await All_device_info.find(filter)
      .sort({ createdAt: -1 }) // latest first
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    // ✅ Count total for pagination
    const total = await All_device_info.countDocuments(filter);

    res.status(200).json({
      success: true,
      device_id: device_id === "all" ? "All Devices" : device_id,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// exports.all_data = async (req, res) => {
//   try {
//     const { device_id, page = 1, limit = 100 } = req.body;

//     // 🧩 Validate input
//     if (!device_id) {
//       return res.status(400).json({ success: false, message: "device_id is required" });
//     }

//     const skip = (page - 1) * limit;

    
//     let filter = {};

//     if (device_id !== "all") {
//       filter.device_id = device_id;
//     }


//     // ⚙️ Fetch all fields for this device_id
//     const data = await All_device_info.find(filter)
//       .sort({ createdAt: -1 }) // newest first
//       .skip(Number(skip))
//       .limit(Number(limit))
//       .lean(); // faster JSON output

//     // ✅ Total count (optional, for pagination info)
//     const total = await All_device_info.countDocuments(filter);

//     res.status(200).json({
//       success: true,
//       page: Number(page),
//       limit: Number(limit),
//       total,
//       totalPages: Math.ceil(total / limit),
//       count: data.length,
//       data,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching data:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };





