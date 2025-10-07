
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mqtt = require("mqtt");
const cors = require("cors");
const fs = require("fs").promises;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

async function fetchDevices() {
  const url = await fetch(`https://oxymora-can-api.otplai.com/api/get_device`, {
    method: "POST",
    body: JSON.stringify({ device_id: "all" }),
    headers: { "Content-Type": "application/json" }
  });
  const res = await url.json();
  console.log(res, 'device data');
  res.map(ele => {
    mqtt_controller(`OYTCAN/${ele.device_id}/data`);
  });


};

fetchDevices();
setInterval(() => {
  fetchDevices();
}, 2 * 30 * 1000);

// Configuration
const config = {
  mqtt: {
    brokerUrl: "mqtts://otplai.com:8883",
    topic: "OYTCAN/08D1F942EED8/data",
    username: "oxmo",
    password: "123456789",
    keepalive: 60,
    reconnectPeriod: 1000,
  },
  outputFile: "mqtt_decoded_data.txt",
  port: 27033,
};

// Enable CORS
app.use(cors({ origin: "*" }));


function mqtt_controller(topics) {
  // MQTT Client
  const client = mqtt.connect(config.mqtt.brokerUrl, {
    username: config.mqtt.username,
    password: config.mqtt.password,
    keepalive: config.mqtt.keepalive,
    reconnectPeriod: config.mqtt.reconnectPeriod,
  });

  client.on("connect", () => {
    console.log("✅ Connected to MQTT broker:", config.mqtt.brokerUrl);
    client.subscribe(topics, { qos: 1 }, (err) => {
      if (err) {
        console.error("❌ Subscribe error:", err);
      } else {
        // config.mqtt.topic
        console.log("📡 Subscribed to:", topics);
      }
    });
  });

  client.on("error", (error) => {
    console.error("❌ MQTT connection error:", error);
  });

  // Handle MQTT messages
  client.on("message", async (mqttTopic, message) => {
    let payload;
    try {
      payload = JSON.parse(message.toString());
    } catch (e) {
      payload = message.toString();
    }

    if(payload === "CAN data not received") return;

    console.log(payload.frames, "payload ");

    const filtered_d = payload && Object.fromEntries(
      Object.entries(payload.frames).map(([key, value]) => [`${key.slice(2, 6)}`, value])
    );

    // Print the result
    console.log(filtered_d);

    // const parts = payload.split("#");
    // const id = parts[0].startsWith("*") ? parts[0] : "unknown_id";
    const id = payload.id;
    // const frames = parts.slice(1).filter((frame) => frame && frame.includes(","));
     insertfarme(id, payload.frames);
    for (const [key, value] of Object.entries(filtered_d)) {
      // console.log(`${key} : ${value}`);
      let frame = `${key} , ${value}`
      //   if (frame.startsWith("*")) continue;
      try {
        const { pgn, data } = parseFrame(key, value);
        const decoded = decodePGN(pgn, data);

        console.log(decoded)
        io.emit("mqtt_message", { id, decoded });
        await store_value(id, decoded);

      } catch (error) {
        console.error(`Error processing frame ${frame}:`, error);
      }
    }

  });

}



// Parse frames
function parseFrame(pgnHex, dataHex) {
  // console.log()
  // const { pgnHex = '', dataHex = '' } = frame || {};
  // const [pgnHex, dataHex] = frame.split(",");
  const pgn = parseInt(pgnHex.replace(/^0x/, ""), 16);
  const data = dataHex ? Buffer.from(dataHex, "hex") : Buffer.alloc(0);
  return { pgn, data };
}

// Decoder (same as yours, unchanged)...
function decodePGN(pgn, data) {
  const result = {};
  if (isNaN(pgn)) {
    result.Decoded = "Invalid PGN";
    return result;
  }

  switch (pgn) {
    case 0xF004: // 61444 - EEC1
      // result.EngineThrottlePosition = (data[0] * 0.4).toFixed(1);
      // result.EnginePercentLoad = (data[1] * 0.4).toFixed(1);
      result.EngineSpeed_rpm = ((data[2] | (data[3] << 8)) / 8).toFixed(2);
      break;


      case 0xFEF1: // 65265 - Cruise Control / Vehicle Speed
  const b1 = data[0];
  const b2 = data[1];
  const b3 = data[2];
  const b4 = data[3];
  const b6 = data[5];

  result.TwoSpeedAxleSwitch = b1 & 0x03; // SPN 69
  result.ParkingBrakeSwitch = (b1 & 0x0C) >> 2; // SPN 70
  result.CruisePauseSwitch = (b1 & 0x30) >> 4; // SPN 1633

  result.WheelBasedSpeed_kph = ((b2 | (b3 << 8)) / 256).toFixed(2); // SPN 84

  result.ClutchSwitch = (b4 & 0xC0) >> 6; // SPN 598
  result.BrakeSwitch = (b4 & 0x30) >> 4;  // SPN 597
  result.CruiseControlEnableSwitch = (b4 & 0x0C) >> 2; // SPN 596
  result.CruiseControlActive = b4 & 0x03; // SPN 595

  result.CruiseSetSpeed_kph = b6 === 0xFF ? "N/A" : (b6 / 256).toFixed(2); // SPN 86
  break;

    // case 0xFEF1: // 65265
    //   result.WheelBasedSpeed_kph = ((data[0] | (data[1] << 8)) / 256).toFixed(2);
    //   result.CruiseSetSpeed_kph = ((data[2] | (data[3] << 8)) / 256).toFixed(2);

    //   break;

    case 0xFEEE: // 65262 - EEC3
      result.EngineCoolantTemp = data[0] - 40;
      break;

    case 0xFEF5: // 65269
      result.IntakeTemp = data[0] - 40;
      break;

    case 0xFEF6:
      result.Engine_Turbocharger_Boost_Pressure = (data[2] * 2).toFixed(1);
      result.Engine_AirIntakeManifold1_Temperature = (data[3] - 40).toFixed(1);
      result.Engine_AirInlet_Pressure = (data[4] * 2).toFixed(1);
      break;

    case 0xFEF7: // 65271
      result.Net_Battery_Current = (data[0] - 125).toFixed(1) || "N/A";
      result.Battery_Potential_s = (data[2] * 0.05).toFixed(1) || "N/A";
      result.BatteryVoltage_V = ((data[5] | (data[6] << 8)) * 0.05).toFixed(2);
      break;

    case 0xFEFC: // 65276
      result.FuelLevel_Percent = (data[2] * 0.4).toFixed(1);
      break;

    case 0xFEEF: // 65263
      result.EngineOilPressure_kPa = (data[4] * 4).toFixed(1);
      result.Engine_Crankcase_Pressure = (
        ((data[5] | (data[6] << 8)) / 128) -
        250
      ).toFixed(2);
      break;

    case 0xFEF2: // 65266
      result.Engine_Throttle_Position = (data[6] * 0.4).toFixed(1);
      result.Engine_Fuel_Rate = (
        ((data[1] + data[2] * 256) + 16) *
        0.05
      ).toFixed(1);
      break;

    case 0xF003: // 61443
      result.Pedal_Position = (data[1] * 0.4).toFixed(1);
      result.Engine_Load = data[2].toFixed(1);
      result.Actual_Max_Available_EngineTorque = "N/A";
      break;

    case 0xFEE9: // 65257
      result.Engine_TripFuel = (
        (data[1] | (data[2] << 8) | (data[3] << 16) | (data[4] << 24)) *
        0.05
      ).toFixed(1);
      result.Engine_Total_FuelUsed = (
        (data[5] | (data[6] << 8) | (data[7] << 16) | (data[8] << 24)) *
        0.05
      ).toFixed(1);
      break;

    case 0xFEE0: // 65248
      result.Total_VehicleDistance = (
        (data[1] | (data[2] << 8) | (data[3] << 16) | (data[4] << 24)) *
        0.125
      ).toFixed(1);
      break;

    case 0xFEE5: // 65253
      result.Engine_TotalHours = (
        (data[0] | (data[1] << 8) | (data[2] << 16) | (data[3] << 24)) *
        0.05
      ).toFixed(1);
      result.Engine_Total_Revolutions = (
        (data[4] | (data[5] << 8) | (data[6] << 16) | (data[7] << 24)) *
        1000
      ).toFixed(1);
      break;

    case 0xFEDF: // 65247
      result.ExhaustGasTemp_C = (
        (data[0] | (data[1] << 8)) * 0.03125 -
        273
      ).toFixed(1);
      result.TurboInletTemp_C = (
        (data[2] | (data[3] << 8)) * 0.03125 -
        273
      ).toFixed(1);
      break;

    case 0xF005: // 61445
      result.Transmission_Current_Gear = data[4];
      break;

    case 0xFE56:
      result.Catalyst_Level = (data[1] * 0.4).toFixed(1);
      break;

    // case 0xFD09: // 64777
    //   result.Engine_TripFuel_Used = "N/A";
    //   result.Engine_TotalFuel_Used = "N/A";
    //   break;

    default:
      result.Decoded = "Unknown PGN";
  }

  return result;
}
// Store value into API
async function store_value(id, decoded) {
  try {
    const json_data = {
      device_id: id,
      // EngineThrottlePosition: decoded?.EngineThrottlePosition ?? "",
      // EnginePercentLoad: decoded?.EnginePercentLoad ?? "",
      Total_VehicleDistance: decoded?.Total_VehicleDistance ?? "",
      EngineSpeed_rpm: decoded?.EngineSpeed_rpm ?? "",
      WheelBasedSpeed_kph: decoded?.WheelBasedSpeed_kph ?? "",
      EngineCoolantTemp: decoded?.EngineCoolantTemp ?? "",
      BatteryVoltage_V: decoded?.BatteryVoltage_V ?? "",
      CruiseSetSpeed_kph: decoded?.CruiseSetSpeed_kph ?? "",
      IntakeTemp: decoded?.IntakeTemp ?? "",
      Engine_Turbocharger_Boost_Pressure: decoded?.Engine_Turbocharger_Boost_Pressure ?? "",
      Engine_AirIntakeManifold1_Temperature: decoded?.Engine_AirIntakeManifold1_Temperature ?? "",
      Engine_AirInlet_Pressure: decoded?.Engine_AirInlet_Pressure ?? "",
      Net_Battery_Current: decoded?.Net_Battery_Current ?? "",
      Battery_Potential_s: decoded?.Battery_Potential_s ?? "",
      FuelLevel_Percent: decoded?.FuelLevel_Percent ?? "",
      EngineOilPressure_kPa: decoded?.EngineOilPressure_kPa ?? "",
      Engine_Crankcase_Pressure: decoded?.Engine_Crankcase_Pressure ?? "",
      Engine_Throttle_Position: decoded?.Engine_Throttle_Position ?? "",
      Engine_Fuel_Rate: decoded?.Engine_Fuel_Rate ?? "",
      Pedal_Position: decoded?.Pedal_Position ?? "",
      Engine_Load: decoded?.Engine_Load ?? "",
      Engine_TripFuel: decoded?.Engine_TripFuel ?? "",
      Engine_Total_FuelUsed: decoded?.Engine_Total_FuelUsed ?? "",
      Engine_TotalHours: decoded?.Engine_TotalHours ?? "",
      Engine_Total_Revolutions: decoded?.Engine_Total_Revolutions ?? "",
      ExhaustGasTemp_C: decoded?.ExhaustGasTemp_C ?? "",
      TurboInletTemp_C: decoded?.TurboInletTemp_C ?? "",
      Transmission_Current_Gear: decoded?.Transmission_Current_Gear ?? "",
      Catalyst_Level: decoded?.Catalyst_Level ?? "",
      // Engine_TripFuel_Used: decoded?.Engine_TripFuel_Used ?? "",
      // Engine_TotalFuel_Used: decoded?.Engine_TotalFuel_Used ?? "",
    };

    console.log(json_data)
    const url = await fetch("https://oxymora-can-api.otplai.com/api/add_all_info", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json_data)
    });

    const res = await url.json();

    console.log("res : ", res)
    const response = await fetch("https://oxymora-can-api.otplai.com/api/add_device_info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json_data),
    });

    const data = await response.json();
    console.log("✅ Data stored:", data);
  } catch (err) {
    console.error("❌ Error storing data:", err.message);
  }
}


// insert farme 
async function insertfarme(id, data) {
  try {
    console.log(id,data)
    // const url = await fetch('https://oxymora-can-api.otplai.com/api/add_farme', {
    //   method: "post",
    //   body: JSON.stringify({ device_id: id, farme: data })
    // });

    // const res = await url.json();
    // console.log(res, "response.");
  } catch (error) {
    console.error(error);
  }
}

// Socket.IO events
io.on("connection", (socket) => {
  console.log("🌐 Web client connected.");
  socket.on("disconnect", () => {
    console.log("🛑 Web client disconnected.");
  });
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("🛑 Shutting down server...");
  client.end(true, {}, () => {
    console.log("✅ MQTT client disconnected");
    server.close(() => {
      console.log("✅ Server stopped");
      process.exit(0);
    });
  });
});

server.listen(config.port, () => {
  console.log(`🚀 Server running at http://localhost:${config.port}`);
});


