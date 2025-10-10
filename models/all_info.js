const mongoose = require("mongoose");

const info_schema = new mongoose.Schema(
  {
    device_id: { type: String, required: true, index: true },

    lat: { type: String },
    long: { type: String },

    Total_VehicleDistance: { type: String },
    EngineSpeed_rpm: { type: String },
    WheelBasedSpeed_kph: { type: String },
    EngineCoolantTemp: { type: String },
    BatteryVoltage_V: { type: String },
    CruiseSetSpeed_kph: { type: String },
    IntakeTemp: { type: String },
    Engine_Turbocharger_Boost_Pressure: { type: String },
    Engine_AirIntakeManifold1_Temperature: { type: String },
    Engine_AirInlet_Pressure: { type: String },
    Net_Battery_Current: { type: String },
    Battery_Potential_s: { type: String },
    FuelLevel_Percent: { type: String },
    EngineOilPressure_kPa: { type: String },
    Engine_Crankcase_Pressure: { type: String },
    Engine_Throttle_Position: { type: String },
    Engine_Fuel_Rate: { type: String },
    Pedal_Position: { type: String },
    Engine_Load: { type: String },
    Engine_TripFuel: { type: String },
    Engine_Total_FuelUsed: { type: String },
    Engine_TotalHours: { type: String },
    Engine_Total_Revolutions: { type: String },
    ExhaustGasTemp_C: { type: String },
    TurboInletTemp_C: { type: String },
    Transmission_Current_Gear: { type: String },
    Catalyst_Level: { type: String },
  },
  { timestamps: true } // adds createdAt, updatedAt
);

// 🧠 Compound index for fast queries and sorting by time
info_schema.index({ device_id: 1, createdAt: -1 });

module.exports = mongoose.model("all_device_info", info_schema);
