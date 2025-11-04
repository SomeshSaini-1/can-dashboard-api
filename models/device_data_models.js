const mongoose = require("mongoose");

const info_schema = new mongoose.Schema({
    device_id: { type: String, required: true, unique: true },
    lat: { type: String, default: 0 },
    long: { type: String, default: 0 },
    Total_VehicleDistance: { type: String, default: "--" },
    EngineSpeed_rpm: { type: String, default: "--" },
    WheelBasedSpeed_kph: { type: String, default: "--" },
    EngineCoolantTemp: { type: String, default: "--" },
    BatteryVoltage_V: { type: String, default: "--" },
    CruiseSetSpeed_kph: { type: String, default: "--" },
    IntakeTemp: { type: String, default: "--" },
    Engine_Turbocharger_Boost_Pressure: { type: String, default: "--" },
    Engine_AirIntakeManifold1_Temperature: { type: String, default: "--" },
    Engine_AirInlet_Pressure: { type: String, default: "--" },
    Net_Battery_Current: { type: String, default: "--" },
    Battery_Potential_s: { type: String, default: "--" },
    FuelLevel_Percent: { type: String, default: "--" },
    EngineOilPressure_kPa: { type: String, default: "--" },
    Engine_Crankcase_Pressure: { type: String, default: "--" },
    Engine_Throttle_Position: { type: String, default: "--" },
    Engine_Fuel_Rate: { type: String, default: "--" },
    Pedal_Position: { type: String, default: "--" },
    Engine_Load: { type: String, default: "--" },
    Engine_TripFuel: { type: String, default: "--" },
    Engine_Total_FuelUsed: { type: String, default: "--" },
    Engine_TotalHours: { type: String, default: "--" },
    Engine_Total_Revolutions: { type: String, default: "--" },
    ExhaustGasTemp_C: { type: String, default: "--" },
    TurboInletTemp_C: { type: String, default: "--" },
    Transmission_Current_Gear: { type: String, default: "--" },
    Catalyst_Level: { type: String, default: "--" },
    status: { type: String, default: "--" }
}, { timestamps: true });

module.exports = mongoose.model("device_info", info_schema);
