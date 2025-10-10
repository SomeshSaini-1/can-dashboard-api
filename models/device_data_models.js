const mongoose = require("mongoose");

const info_schema = new mongoose.Schema({
    device_id: { type: String, required: true, unique: true },
    lat: { type: String, default: "NA" },
    long: { type: String, default: "NA" },
    Total_VehicleDistance: { type: String, default: "NA" },
    EngineSpeed_rpm: { type: String, default: "NA" },
    WheelBasedSpeed_kph: { type: String, default: "NA" },
    EngineCoolantTemp: { type: String, default: "NA" },
    BatteryVoltage_V: { type: String, default: "NA" },
    CruiseSetSpeed_kph: { type: String, default: "NA" },
    IntakeTemp: { type: String, default: "NA" },
    Engine_Turbocharger_Boost_Pressure: { type: String, default: "NA" },
    Engine_AirIntakeManifold1_Temperature: { type: String, default: "NA" },
    Engine_AirInlet_Pressure: { type: String, default: "NA" },
    Net_Battery_Current: { type: String, default: "NA" },
    Battery_Potential_s: { type: String, default: "NA" },
    FuelLevel_Percent: { type: String, default: "NA" },
    EngineOilPressure_kPa: { type: String, default: "NA" },
    Engine_Crankcase_Pressure: { type: String, default: "NA" },
    Engine_Throttle_Position: { type: String, default: "NA" },
    Engine_Fuel_Rate: { type: String, default: "NA" },
    Pedal_Position: { type: String, default: "NA" },
    Engine_Load: { type: String, default: "NA" },
    Engine_TripFuel: { type: String, default: "NA" },
    Engine_Total_FuelUsed: { type: String, default: "NA" },
    Engine_TotalHours: { type: String, default: "NA" },
    Engine_Total_Revolutions: { type: String, default: "NA" },
    ExhaustGasTemp_C: { type: String, default: "NA" },
    TurboInletTemp_C: { type: String, default: "NA" },
    Transmission_Current_Gear: { type: String, default: "NA" },
    Catalyst_Level: { type: String, default: "NA" },
    status: { type: String, default: "NA" }
}, { timestamps: true });

module.exports = mongoose.model("device_info", info_schema);
