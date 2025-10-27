const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mqtt = require("mqtt");
const cors = require("cors");
const fs = require("fs").promises;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const mqttClients = {}; // Store MQTT clients per topic

async function fetchDevices() {
  const url = await fetch(`https://oxymora-can-api.otplai.com/api/get_device`, {
    method: "POST",
    body: JSON.stringify({ device_id: "all" }),
    headers: { "Content-Type": "application/json" }
  });
  const res = await url.json();
  console.log(res, 'device data');
  res.forEach(ele => {
    mqtt_controller(`OYTCAN/${ele.device_id}/data`);
    mqtt_controller(`OYTCAN/${ele.device_id}/status`);
  });
}

fetchDevices();
setInterval(fetchDevices, 60 * 1000); // 1 minute interval

const config = {
  mqtt: {
    brokerUrl: "mqtts://otplai.com:8883",
    username: "oxmo",
    password: "123456789",
    keepalive: 60,
    reconnectPeriod: 1000,
  },
  outputFile: "mqtt_decoded_data.txt",
  port: 27033,
};

app.use(cors({ origin: "*" }));

function mqtt_controller(topic) {
  if (mqttClients[topic]) return; // Prevent duplicate clients

  const client = mqtt.connect(config.mqtt.brokerUrl, {
    username: config.mqtt.username,
    password: config.mqtt.password,
    keepalive: config.mqtt.keepalive,
    reconnectPeriod: config.mqtt.reconnectPeriod,
  });

  mqttClients[topic] = client;

  client.on("connect", () => {
    console.log("✅ Connected to MQTT broker:", config.mqtt.brokerUrl);
    client.subscribe(topic, { qos: 1 }, (err) => {
      if (err) {
        console.error("❌ Subscribe error:", err);
      } else {
        console.log("📡 Subscribed to:", topic);
      }
    });
  });

  client.on("error", (error) => {
    console.error("❌ MQTT connection error:", error);
  });

  client.on("message", async (mqttTopic, message) => {
    let payload;
    try {
      payload = JSON.parse(message.toString());
    } catch (e) {
      payload = message.toString();
    }

    console.log(mqttTopic,'mqttTopic')
    if (payload === "CAN data not received") return;
    if (mqttTopic.includes('status')){
       await device_status(mqttTopic.split("/")[1],payload);
        return
    }

    // const filtered_d = payload && Object.fromEntries(
    //   Object.entries(payload.frames).map(([key, value]) => [`${key.slice(2, 6)}`, value])
    // );

    // const id = payload.id;
    // await insertfarme(id, payload.frames);

    // for (const [key, value] of Object.entries(filtered_d)) {
    //   let frame = `${key} , ${value}`;

      
    // const [pgnHex, dataHex] = frame.split(",").map(s => s.trim());
    // if (!pgnHex
    //    || !dataHex 
    //    || dataHex === "FFFFFFFFFFFFFFFF"
    // ) {
    //   console.log(`Skipping malformed frame: ${frame}`);
    //   continue;
    // }

    //   try {
    //     const { pgn, data } = parseFrame(key, value);
    //     const decoded = decodePGN(pgn, data);

    //     io.emit("mqtt_message", { id, decoded });
    //     await store_value(id, decoded);

    //   } catch (error) {
    //     console.error(`Error processing frame ${frame}:`, error);
    //   }
    // }


    const filtered_d = payload && Object.fromEntries(
  Object.entries(payload.frames).map(([key, value]) => [`${key.slice(2, 6)}`, value])
);

const id = payload.id;
const long_c = payload.long;
const lat_c = payload.lat;
await insertfarme(id, payload.frames);

const mergedDecoded = {};

for (const [key, value] of Object.entries(filtered_d)) {
  const frame = `${key}, ${value}`;
  const [pgnHex, dataHex] = frame.split(",").map(s => s.trim());

  if (!pgnHex || !dataHex || dataHex === "FFFFFFFFFFFFFFFF") {
    console.log(`Skipping malformed frame: ${frame}`);
    continue;
  }

  try {
    const { pgn, data } = parseFrame(key, value);
    const decoded = decodePGN(pgn, data);

    io.emit("mqtt_message", { id, decoded });

    // Merge decoded values into one object
    Object.assign(mergedDecoded, decoded);

  } catch (error) {
    console.error(`Error processing frame ${frame}:`, error);
  }
}

// Build final json_data from mergedDecoded
const json_data = {
  device_id: id,
  lat : lat_c,
  long : long_c,
  Total_VehicleDistance: mergedDecoded?.Total_VehicleDistance ?? "",
  EngineSpeed_rpm: mergedDecoded?.EngineSpeed_rpm ?? "",
  WheelBasedSpeed_kph: mergedDecoded?.WheelBasedSpeed_kph ?? "",
  EngineCoolantTemp: mergedDecoded?.EngineCoolantTemp ?? "",
  BatteryVoltage_V: mergedDecoded?.BatteryVoltage_V ?? "",
  CruiseSetSpeed_kph: mergedDecoded?.CruiseSetSpeed_kph ?? "",
  IntakeTemp: mergedDecoded?.IntakeTemp ?? "",
  Engine_Turbocharger_Boost_Pressure: mergedDecoded?.Engine_Turbocharger_Boost_Pressure ?? "",
  Engine_AirIntakeManifold1_Temperature: mergedDecoded?.Engine_AirIntakeManifold1_Temperature ?? "",
  Engine_AirInlet_Pressure: mergedDecoded?.Engine_AirInlet_Pressure ?? "",
  Net_Battery_Current: mergedDecoded?.Net_Battery_Current ?? "",
  Battery_Potential_s: mergedDecoded?.Battery_Potential_s ?? "",
  FuelLevel_Percent: mergedDecoded?.FuelLevel_Percent ?? "",
  EngineOilPressure_kPa: mergedDecoded?.EngineOilPressure_kPa ?? "",
  Engine_Crankcase_Pressure: mergedDecoded?.Engine_Crankcase_Pressure ?? "",
  Engine_Throttle_Position: mergedDecoded?.Engine_Throttle_Position ?? "",
  Engine_Fuel_Rate: mergedDecoded?.Engine_Fuel_Rate ?? "",
  Pedal_Position: mergedDecoded?.Pedal_Position ?? "",
  Engine_Load: mergedDecoded?.Engine_Load ?? "",
  Engine_TripFuel: mergedDecoded?.Engine_TripFuel ?? "",
  Engine_Total_FuelUsed: mergedDecoded?.Engine_Total_FuelUsed ?? "",
  Engine_TotalHours: mergedDecoded?.Engine_TotalHours ?? "",
  Engine_Total_Revolutions: mergedDecoded?.Engine_Total_Revolutions ?? "",
  ExhaustGasTemp_C: mergedDecoded?.ExhaustGasTemp_C ?? "",
  TurboInletTemp_C: mergedDecoded?.TurboInletTemp_C ?? "",
  Transmission_Current_Gear: mergedDecoded?.Transmission_Current_Gear ?? "",
  Catalyst_Level: mergedDecoded?.Catalyst_Level ?? "",
  status: mergedDecoded?.status ?? ""
};

// Store the final merged result
await store_value(json_data);
  // console.log(id, json_data);



  });
}

function parseFrame(pgnHex, dataHex) {
  const pgn = parseInt(pgnHex.replace(/^0x/, ""), 16);
  const data = dataHex ? Buffer.from(dataHex, "hex") : Buffer.alloc(0);
  return { pgn, data };
}

function decodePGN(pgn, data) {
  const result = {};
  // console.log(pgn,data)
  if (isNaN(pgn)) {
    result.Decoded = "Invalid PGN";
    return result;
  }

  switch (pgn) {
    case 0xF004:
      result.EngineSpeed_rpm = ((data[3] | (data[4] << 8)) / 8).toFixed(2);
      break;
    case 0xFEF1:
      const b1 = data[0], b2 = data[1], b3 = data[2], b4 = data[3], b6 = data[5];
      result.TwoSpeedAxleSwitch = b1 & 0x03;
      result.ParkingBrakeSwitch = (b1 & 0x0C) >> 2;
      result.CruisePauseSwitch = (b1 & 0x30) >> 4;
      result.WheelBasedSpeed_kph = ((b2 | (b3 << 8)) / 256).toFixed(2);
      result.ClutchSwitch = (b4 & 0xC0) >> 6;
      result.BrakeSwitch = (b4 & 0x30) >> 4;
      result.CruiseControlEnableSwitch = (b4 & 0x0C) >> 2;
      result.CruiseControlActive = b4 & 0x03;
      result.CruiseSetSpeed_kph = b6 === 0xFF ? "N/A" : (b6 / 256).toFixed(2);
      break;
    case 0xFEEE:
      result.EngineCoolantTemp = data[0] - 40;
      break;
    case 0xFEF5:
      result.IntakeTemp = data[0] - 40;
      result.Net_Battery_Current = (((data[4] | (data[5] << 8)) * 0.03125 ) - 273).toFixed(2); //Ambient_temp
      break;
    case 0xFEF6:
      result.Engine_Turbocharger_Boost_Pressure = (data[1] * 2).toFixed(1);
      result.Engine_AirIntakeManifold1_Temperature = (data[2] - 40).toFixed(1);
      result.Engine_AirInlet_Pressure = (data[3] * 2).toFixed(1);
      break;
    case 0xFEF7:
      // result.Net_Battery_Current = (data[0] - 125).toFixed(1) || "N/A";
      result.Battery_Potential_s = (data[2] * 0.05).toFixed(1) || "N/A";
      result.BatteryVoltage_V = ((data[4] | (data[5] << 8)) * 0.05).toFixed(2);
      break;
    case 0xFEFC:
      result.FuelLevel_Percent = (data[1] * 0.4).toFixed(1);
      break;
    case 0xFEEF:
      result.EngineOilPressure_kPa = (data[3] * 4).toFixed(1);
      result.Engine_Crankcase_Pressure = (((data[4] | (data[5] << 8)) / 128) - 250).toFixed(2);
      break;
    case 0xFEF2:
      result.Engine_Throttle_Position = (data[6] * 0.4).toFixed(1);
      result.Engine_Fuel_Rate = (((data[0] + data[1] * 256) + 16) * 0.05).toFixed(1);
      break;
    case 0xF003:
      result.Pedal_Position = (data[1] * 0.4).toFixed(1);
      result.Engine_Load = data[2].toFixed(1);
      result.Actual_Max_Available_EngineTorque = "--";
      break;
    case 0xFEE9:
      result.Engine_TripFuel = ((data[0] | (data[1] << 8) | (data[2] << 16) | (data[3] << 24)) * 0.05).toFixed(1);
      result.Engine_Total_FuelUsed = ((data[4] | (data[5] << 8) | (data[6] << 16) | (data[7] << 24)) * 0.05).toFixed(1);
      break;
    case 0xFEE0:
      result.Total_VehicleDistance = ((data[4] | (data[5] << 8) | (data[6] << 16) | (data[7] << 24)) * 0.125).toFixed(1);
      break;
    case 0xFEE5:
      result.Engine_TotalHours = ((data[0] | (data[1] << 8) | (data[2] << 16) | (data[3] << 24)) * 0.05).toFixed(1);
      result.Engine_Total_Revolutions = ((data[4] | (data[5] << 8) | (data[6] << 16) | (data[7] << 24)) * 1000).toFixed(1);
      break;
    case 0xFEDF:
      result.ExhaustGasTemp_C = ((data[5] | (data[6] << 8)) * 0.03125 - 273).toFixed(1);
      result.TurboInletTemp_C = ((data[1] | (data[2] << 8)) * 0.03125 - 273).toFixed(1);
      break;
    case 0xF005:
      result.Transmission_Current_Gear = data[3]; 
      break;
    case 0xFE56:
      result.Catalyst_Level = (data[0] * 0.4).toFixed(1);
      break;
    default:
      result.Decoded = "Unknown PGN";
  }
  return result;
}

async function store_value(json_data) {
  console.log("store the data",json_data)
  try {
    // const json_data = {
    //   device_id: id,
    //   Total_VehicleDistance: decoded?.Total_VehicleDistance ?? "",
    //   EngineSpeed_rpm: decoded?.EngineSpeed_rpm ?? "",
    //   WheelBasedSpeed_kph: decoded?.WheelBasedSpeed_kph ?? "",
    //   EngineCoolantTemp: decoded?.EngineCoolantTemp ?? "",
    //   BatteryVoltage_V: decoded?.BatteryVoltage_V ?? "",
    //   CruiseSetSpeed_kph: decoded?.CruiseSetSpeed_kph ?? "",
    //   IntakeTemp: decoded?.IntakeTemp ?? "",
    //   Engine_Turbocharger_Boost_Pressure: decoded?.Engine_Turbocharger_Boost_Pressure ?? "",
    //   Engine_AirIntakeManifold1_Temperature: decoded?.Engine_AirIntakeManifold1_Temperature ?? "",
    //   Engine_AirInlet_Pressure: decoded?.Engine_AirInlet_Pressure ?? "",
    //   Net_Battery_Current: decoded?.Net_Battery_Current ?? "",
    //   Battery_Potential_s: decoded?.Battery_Potential_s ?? "",
    //   FuelLevel_Percent: decoded?.FuelLevel_Percent ?? "",
    //   EngineOilPressure_kPa: decoded?.EngineOilPressure_kPa ?? "",
    //   Engine_Crankcase_Pressure: decoded?.Engine_Crankcase_Pressure ?? "",
    //   Engine_Throttle_Position: decoded?.Engine_Throttle_Position ?? "",
    //   Engine_Fuel_Rate: decoded?.Engine_Fuel_Rate ?? "",
    //   Pedal_Position: decoded?.Pedal_Position ?? "",
    //   Engine_Load: decoded?.Engine_Load ?? "",
    //   Engine_TripFuel: decoded?.Engine_TripFuel ?? "",
    //   Engine_Total_FuelUsed: decoded?.Engine_Total_FuelUsed ?? "",
    //   Engine_TotalHours: decoded?.Engine_TotalHours ?? "",
    //   Engine_Total_Revolutions: decoded?.Engine_Total_Revolutions ?? "",
    //   ExhaustGasTemp_C: decoded?.ExhaustGasTemp_C ?? "",
    //   TurboInletTemp_C: decoded?.TurboInletTemp_C ?? "",
    //   Transmission_Current_Gear: decoded?.Transmission_Current_Gear ?? "",
    //   Catalyst_Level: decoded?.Catalyst_Level ?? "",
    //   status: decoded?.status ?? ""
    // };

    await fetch("https://oxymora-can-api.otplai.com/api/add_all_info", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json_data)
    });

    await fetch("https://oxymora-can-api.otplai.com/api/add_device_info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json_data),
    });
  } catch (err) {
    console.error("❌ Error storing data:", err.message);
  }
}

async function device_status(id,data){
  try {
    
    const json_data = {
      device_id: id,
      status : data || ""
    }
  const url = await fetch("https://oxymora-can-api.otplai.com/api/update_device_status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json_data),
    });

    const res = await url.json();
    console.log(res,"devic status.");

  } catch (error) {
    console.log(error);
  }
}

async function insertfarme(id, data) {
  try {
    const bodyData = { device_id: id, farme: data };
    console.log(JSON.stringify(bodyData), "farme data");

    const url = await fetch("https://oxymora-can-api.otplai.com/api/add_farme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    const res = await url.json();
    console.log(res, "response.");
  } catch (error) {
    console.error("❌ insertfarme error:", error);
  }
}

io.on("connection", (socket) => {
  console.log("🌐 Web client connected.");
  socket.on("disconnect", () => {
    console.log("🛑 Web client disconnected.");
  });
});

process.on("SIGINT", () => {
  console.log("🛑 Shutting down server...");
  Object.values(mqttClients).forEach(client => {
    client.end(true, {}, () => {
      console.log("✅ MQTT client disconnected");
    });
  });
  server.close(() => {
    console.log("✅ Server stopped");
    process.exit(0);
  });
});

server.listen(config.port, () => {
  console.log(`🚀 Server running at http://localhost:${config.port}`);
});
