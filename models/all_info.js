const mongoose = require("mongoose");

const info_scama = new mongoose.Schema({
  device_id: { type: String, require: true },
  lat : String,
  long : String,
  Total_VehicleDistance: String,
  EngineSpeed_rpm: String,
  WheelBasedSpeed_kph: String,
  EngineCoolantTemp: String,
  BatteryVoltage_V: String,
  CruiseSetSpeed_kph: String,
  IntakeTemp: String,
  Engine_Turbocharger_Boost_Pressure: String,
  Engine_AirIntakeManifold1_Temperature: String,
  Engine_AirInlet_Pressure: String,
  Net_Battery_Current: String,
  Battery_Potential_s: String,
  FuelLevel_Percent: String,
  EngineOilPressure_kPa: String,
  Engine_Crankcase_Pressure: String,
  Engine_Throttle_Position: String,
  Engine_Fuel_Rate: String,
  Pedal_Position: String,
  Engine_Load: String,
  Engine_TripFuel: String,
  Engine_Total_FuelUsed: String,
  Engine_TotalHours: String,
  Engine_Total_Revolutions: String,
  ExhaustGasTemp_C: String,
  TurboInletTemp_C: String,
  Transmission_Current_Gear: String,
  Catalyst_Level: String,

}, { timestamps: true });

module.exports = mongoose.model("all_device_info", info_scama)



