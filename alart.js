
const fs = require("fs").promises;

const SPEED_LIMIT = 60; // km/h limit
const prevData = {};
const LOG_FILE = "overspeed_log.txt";

async function fetchDevices() {
  const url = await fetch(`https://oxymora-can-api.otplai.com/api/get_device`, {
    method: "POST",
    body: JSON.stringify({ device_id: "all" }),
    headers: { "Content-Type": "application/json" },
  });

  const res = await url.json();
  res.forEach((ele) => get_device_info(ele.device_id));
}

fetchDevices();
setInterval(fetchDevices, 3000); // every 3 seconds

async function get_device_info(id) {
  try {
    const response = await fetch(`https://oxymora-can-api.otplai.com/api/get_device_info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device_id: id }),
    });

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return;

    const latest = data[data.length - 1];
    const speed = parseFloat(latest.WheelBasedSpeed_kph);
    const distance = parseFloat(latest.Total_VehicleDistance);
    const time = new Date(latest.updatedAt).getTime();

    if (prevData[id]) {
      console.log(latest, speed, distance, time);

      const prev = prevData[id];
      console.log(distance, prev.distance)
      const distanceDiff = (distance - prev.distance) / 1000;
      const timeDiff = (time - prev.time) / 1000;

      const duration = formatDuration(timeDiff);
      const overSpeed = speed > SPEED_LIMIT ? `${speed.toFixed(0)} km/h` : null;

      if (overSpeed && distanceDiff > 0) {
        const logEntry = `
  Vehicle: ${id}
  Over Speed: ${overSpeed}
  Duration: ${duration}
  Distance Travelled: ${distanceDiff.toFixed(2)} km
  Date & Time: ${new Date(latest.updatedAt).toLocaleString()}
  --------------------------------------------------------------
  `;


        const logEntry2 = {
          vehicle: id,
          overSpeed: overSpeed,
          duration: duration,
          distanceTravelled: Number(distanceDiff.toFixed(2)),
          dateTime: new Date(latest.updatedAt).toISOString(),
        };



        console.log("over_speed",logEntry);
        saveLog(logEntry2);
      }


      console.log(`${speed },prev ${JSON.stringify(prevData[id])}`)
      if(speed - prev.speed > 12){
        const logEntry = {
           vehicle: id,
           dateTime: new Date(latest.updatedAt).toISOString(),
        }
        console.log(speed ,'HarshAcceleration');
        saveLog("HarshAcceleration",logEntry);
      }
      if(prev.speed - speed > 12) {
        const logEntry = {
           vehicle: id,
           dateTime: new Date(latest.updatedAt).toISOString(),
        }
        console.log(speed ,'HardBrake');
        saveLog("HardBrake",logEntry);
      }

          // dateTime: new Date(latest.updatedAt).toISOString(),
          
    // "over_speed": "Over Speed",
    // "HarshAcceleration": "Harsh Acceleration",
    // "Idling": "Idling",
    // "HardBrake": "Hard Brake",
    // "Stoppage": "Stoppage",
    // "Freerun": "Freerun",
    // "Geofence": "Geofence"

    }

    prevData[id] = { distance, time };
  } catch (error) {
    console.error("Error fetching device info:", error);
  }
}

function formatDuration(seconds) {
  if (seconds < 60) return `${Math.round(seconds)} Secs`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins} min${mins > 1 ? "s" : ""}${secs ? ` ${secs} Secs` : ""}`;
}

async function saveLog(type,entry) {

  const url = await fetch("https://oxymora-can-api.otplai.com/api/add_alert", {
    method: "post",
    headers: { 'Content-Type': "Application/json" },
    body: JSON.stringify({ alert_type: type, data: entry })
  });

  const res = await url.json();
  console.log(res)
  // fs.appendFile(LOG_FILE, entry, (err) => {
  //   if (err) console.error("Error writing to log file:", err);
  // });


}
