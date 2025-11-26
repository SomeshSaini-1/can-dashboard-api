
// const fs = require("fs").promises;

// const SPEED_LIMIT = 60; // km/h limit
// const prevData = {};
// const LOG_FILE = "overspeed_log.txt";

// async function fetchDevices() {
//   const url = await fetch(`https://oxymora-can-api.otplai.com/api/get_device`, {
//     method: "POST",
//     body: JSON.stringify({ device_id: "all" }),
//     headers: { "Content-Type": "application/json" },
//   });

//   const res = await url.json();
//   console.log(res,"res")
//   res.forEach((ele) => get_device_info(ele.device_id));
// }

// fetchDevices();
// setInterval(fetchDevices, 10000); // every 3 seconds

// async function get_device_info(id) {
//   try {
//     const response = await fetch(`https://oxymora-can-api.otplai.com/api/get_device_info`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ device_id: id }),
//     });

//     const data = await response.json();
//     if (!Array.isArray(data) || data.length === 0) return;

//     const latest = data[data.length - 1];
//     const speed = parseFloat(latest.WheelBasedSpeed_kph);
//     const distance = parseFloat(latest.Total_VehicleDistance);
//     const time = new Date(latest.updatedAt).getTime();

//     if (prevData[id]) {
//       console.log(latest, speed, distance, time);

//       const prev = prevData[id];
//       console.log(distance, prev.distance)
//       const distanceDiff = (distance - prev.distance) / 1000;
//       const timeDiff = (time - prev.time) / 1000;

//       const duration = formatDuration(timeDiff);
//       const overSpeed = speed > SPEED_LIMIT ? `${speed.toFixed(0)} km/h` : null;

//       if (overSpeed && distanceDiff > 0) {
//         const logEntry = `
//   Vehicle: ${id}
//   Over Speed: ${overSpeed}
//   Duration: ${duration}
//   Distance Travelled: ${distanceDiff.toFixed(2)} km
//   Date & Time: ${new Date(latest.updatedAt).toLocaleString()}
//   --------------------------------------------------------------
//   `;


//         const logEntry2 = {
//           vehicle: id,
//           overSpeed: overSpeed,
//           duration: duration,
//           distanceTravelled: Number(distanceDiff.toFixed(2)),
//           dateTime: new Date().toLocaleString(),
//         };



//         console.log("over_speed",logEntry);
//         saveLog(logEntry2);
//       }


//       console.log(`${speed },prev ${JSON.stringify(prevData[id])}`)
//       if(speed - prev.speed > 12){
//         const logEntry = {
//            vehicle: id,
//            dateTime: new Date().toLocaleString(),
//         }
//         console.log(speed ,'HarshAcceleration');
//         saveLog("HarshAcceleration",logEntry);
//       }


//       if(prev.speed - speed > 12) {
//         const logEntry = {
//            vehicle: id,
//            dateTime: new Date().toLocaleString(),
//         }
//         console.log(speed ,'HardBrake');
//         saveLog("HardBrake",logEntry);
//       }

//           // dateTime: new Date().toLocaleString(),

//     // "over_speed": "Over Speed",
//     // "HarshAcceleration": "Harsh Acceleration",
//     // "Idling": "Idling",
//     // "HardBrake": "Hard Brake",
//     // "Stoppage": "Stoppage",
//     // "Freerun": "Freerun",
//     // "Geofence": "Geofence"

//     }

//     prevData[id] = {speed, distance, time };

//   } catch (error) {
//     console.error("Error fetching device info:", error);
//   }
// }

// function formatDuration(seconds) {
//   if (seconds < 60) return `${Math.round(seconds)} Secs`;
//   const mins = Math.floor(seconds / 60);
//   const secs = Math.round(seconds % 60);
//   return `${mins} min${mins > 1 ? "s" : ""}${secs ? ` ${secs} Secs` : ""}`;
// }

// async function saveLog(type,entry) {

//   const url = await fetch("https://oxymora-can-api.otplai.com/api/add_alert", {
//     method: "post",
//     headers: { 'Content-Type': "Application/json" },
//     body: JSON.stringify({ alert_type: type, data: entry })
//   });

//   const res = await url.json();
//   console.log(res)
//   // fs.appendFile(LOG_FILE, entry, (err) => {
//   //   if (err) console.error("Error writing to log file:", err);
//   // });


// }











// const SPEED_LIMIT = 60; // km/h limit
// const prevData = {};
// const idlingFlags = {};
// const LOG_FILE = "overspeed_log.txt";

// // Fetch devices periodically
// async function fetchDevices() {
//   const url = await fetch(`https://oxymora-can-api.otplai.com/api/get_device`, {
//     method: "POST",
//     body: JSON.stringify({ device_id: "all" }),
//     headers: { "Content-Type": "application/json" },
//   });
//   const res = await url.json();
//   res.forEach((ele) => get_device_info(ele.device_id));
// }
// fetchDevices();
// setInterval(fetchDevices, 10000); // every 10 seconds

// // Process each device's info
// async function get_device_info(id) {
//   try {
//     const response = await fetch(`https://oxymora-can-api.otplai.com/api/get_device_info`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ device_id: id }),
//     });
//     const data = await response.json();
//     if (!Array.isArray(data) || data.length === 0) return;
//     const latest = data[data.length - 1];
//     const speed = parseFloat(latest.WheelBasedSpeed_kph) || 0;
//     const distance = parseFloat(latest.Total_VehicleDistance) || 0;
//     const engineSpeed = parseFloat(latest.EngineSpeed_rpm) || 0;
//     const time = new Date(latest.updatedAt).getTime();
//     const Ambient_Temperature = parseFloat(latest.Net_Battery_Current)

//     // --- Idling detection via separate function
//     checkIdling(id, speed, engineSpeed, time, latest, Ambient_Temperature);

//     // --- Over speed detection
//     if (prevData[id]) {
//       const prev = prevData[id];
//       const distanceDiff = (distance - prev.distance) / 1000;
//       const timeDiff = (time - prev.time) / 1000;
//       const duration = formatDuration(timeDiff);
//       const overSpeed = speed > SPEED_LIMIT ? `${speed.toFixed(0)} km/h` : null;

//       if (overSpeed && distanceDiff > 0) {
//         const logEntry2 = {
//           vehicle: id,
//           overSpeed: overSpeed,
//           duration: duration,
//           distanceTravelled: Number(distanceDiff.toFixed(2)),
//           dateTime: new Date().toLocaleString(),
//         };
//         saveLog("Over Speed", logEntry2);
//       }

//       // Harsh acceleration
//       if(speed - prev.speed > 12){
//         const logEntry = {
//           vehicle: id,
//           dateTime: new Date().toLocaleString(),
//         }
//         saveLog("HarshAcceleration", logEntry);
//       }

//       // Hard brake
//       if(prev.speed - speed > 12) {
//         const logEntry = {
//           vehicle: id,
//           dateTime: new Date().toLocaleString(),
//         }
//         saveLog("HardBrake", logEntry);
//       }
//     }
//     prevData[id] = {speed, distance, time, engineSpeed};
//   } catch (error) {
//     console.error("Error fetching device info:", error);
//   }
// }

// // Idling detection in its own function
// function checkIdling(id, speed, engineSpeed, time, latest, Ambient_temp) {
//   if (!idlingFlags[id]) {
//     idlingFlags[id] = { isIdling: false, startTime: null };
//   }

//   // Start idling
//   if (engineSpeed !== 0 && speed === 0 && !idlingFlags[id].isIdling) {
//     idlingFlags[id].isIdling = true;
//     idlingFlags[id].startTime = time;
//   }

//   // End idling
//   if (idlingFlags[id].isIdling && (speed > 0 || engineSpeed === 0)) {
//     const durationSec = (time - idlingFlags[id].startTime) / 1000;
//     const duration = formatDuration(durationSec);
//     const logEntry = {
//       vehicle: id,
//       idlingDuration: duration,
//       Ambient_Temperature,
//       startTime: new Date(idlingFlags[id].startTime).toISOString(),
//       endTime: new Date(time).toISOString(),
//       dateTime: new Date().toLocaleString(),
//     };
//     saveLog("Idling", logEntry);
//     idlingFlags[id].isIdling = false;
//     idlingFlags[id].startTime = null;
//   }
// }

// // Format duration for logs
// function formatDuration(seconds) {
//   if (seconds < 60) return `${Math.round(seconds)} Secs`;
//   const mins = Math.floor(seconds / 60);
//   const secs = Math.round(seconds % 60);
//   return `${mins} min${mins > 1 ? "s" : ""}${secs ? ` ${secs} Secs` : ""}`;
// }

// // Logging wrapper to send to API
// async function saveLog(type,entry) {
//   const url = await fetch("https://oxymora-can-api.otplai.com/api/add_alert", {
//     method: "post",
//     headers: { 'Content-Type': "Application/json" },
//     body: JSON.stringify({ alert_type: type, data: entry })
//   });
//   const res = await url.json();
//   console.log(res)
// }




// import fetch from "node-fetch"; npm install @turf/turf

// import turf from "@turf/turf";
// import * as turf from "@turf/turf";
const turf = require("@turf/turf");

const SPEED_LIMIT = 60; // km/h limit
const prevData = {};
const idlingFlags = {};
const apiurl = "https://oxymora-can-api.otplai.com/api"; // Define base API URL

// Fetch devices periodically
async function fetchDevices() {
  const response = await fetch(`${apiurl}/get_device`, {
    method: "POST",
    body: JSON.stringify({ device_id: "all" }),
    headers: { "Content-Type": "application/json" },
  });


  const res = await response.json();

  res.forEach((ele) => {
    get_device_info(ele.device_id);
  });
}
fetchDevices();
setInterval(fetchDevices, 10000); // every 10 seconds

// Process each device's info
async function get_device_info(id) {
  try {
    const response = await fetch(`${apiurl}/get_device_info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device_id: id }),
    });

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return;

    const latest = data[data.length - 1];
    const speed = parseFloat(latest.WheelBasedSpeed_kph) || 0;
    const lat = parseFloat(latest.lat) || 0;
    const lng = parseFloat(latest.long) || 0;
    const distance = parseFloat(latest.Total_VehicleDistance) || 0;
    const engineSpeed = parseFloat(latest.EngineSpeed_rpm) || 0;
    const time = new Date(latest.updatedAt).getTime();
    const Ambient_Temperature = parseFloat(latest.Net_Battery_Current);

    // Idling detection
    checkIdling(id, speed, engineSpeed, time, latest, Ambient_Temperature);
    geofance_cheker(id, lat, lng);

    // Over speed detection
    if (prevData[id]) {
      const prev = prevData[id];
      const distanceDiff = (distance - prev.distance) / 1000;
      const timeDiff = (time - prev.time) / 1000;
      const duration = formatDuration(timeDiff);
      const overSpeed = speed > SPEED_LIMIT ? `${speed.toFixed(0)} km/h` : null;

      if (overSpeed && distanceDiff > 0) {
        const logEntry2 = {
          vehicle: id,
          overSpeed: overSpeed,
          duration: duration,
          distanceTravelled: Number(distanceDiff.toFixed(2)),
          dateTime: new Date().toLocaleString(),
        };
        saveLog("Over Speed", logEntry2);
      }

      // Harsh acceleration
      if (speed - prev.speed > 12) {
        const logEntry = {
          vehicle: id,
          dateTime: new Date().toLocaleString(),
        };
        saveLog("HarshAcceleration", logEntry);
      }

      // Hard brake
      if (prev.speed - speed > 12) {
        const logEntry = {
          vehicle: id,
          dateTime: new Date().toLocaleString(),
        };
        saveLog("HardBrake", logEntry);
      }
    }

    prevData[id] = { speed, distance, time, engineSpeed };
  } catch (error) {
    console.error("Error fetching device info:", error);
  }
}




// // ✅ Check if a point is inside, outside, or near the polygon boundary
// function isPointInsidePolygon(id , name,date, point, polygonLatLngs, tolerance = 10) {
//   // Create turf point
//   const pt = turf.point([point[1], point[0]]);

//   // Create turf polygon
//   const polygon = turf.polygon([
//     [...polygonLatLngs.map(p => [p.lng, p.lat]), [polygonLatLngs[0].lng, polygonLatLngs[0].lat]],
//   ]);

//   // Check inside polygon
//   const isInside = turf.booleanPointInPolygon(pt, polygon);

//   // Calculate distance to polygon boundary (in meters)
//   const distanceToBoundary = turf.pointToLineDistance(pt, turf.polygonToLine(polygon), { units: "meters" });

//   console.log(distanceToBoundary,"distanceToBoundary",tolerance)
//   // Determine condition
//   if (isInside && distanceToBoundary < 0 && distanceToBoundary <= tolerance ) {
//     // return "near-boundary-inside"; // inside but close to edge

//     const logEntry = {
//       location: `${id} inside ${name}`,
//       dateTime: new Date().toLocaleString(),
//     };
//     console.log("Geofence", logEntry);c
//     saveLog("Geofence", logEntry);

//   } else if (!isInside && distanceToBoundary < 0  && distanceToBoundary <= tolerance) {
//     // return "near-boundary-outside"; // outside but close to edge

//     const logEntry = {
//       location: `${id} outside ${name}`,
//       dateTime: new Date().toLocaleString(),
//     };
//     console.log("Geofence", logEntry);
//     saveLog("Geofence", logEntry);
//   }

//     return isInside;

// }

function isPointInsidePolygon(id, name, date, point, polygonLatLngs, tolerance = 50) {
  // Validate inputs
  if (!Array.isArray(point) || point.length !== 2 || !Array.isArray(polygonLatLngs) || polygonLatLngs.length < 3) {
    console.error("Invalid point or polygonLatLngs");
    return false;
  }

  // Create turf point (longitude, latitude)
  const pt = turf.point([point[1], point[0]]);

  // Build polygon ring and close the polygon
  const ring = polygonLatLngs.map(p => [p.lng, p.lat]);
  ring.push([polygonLatLngs[0].lng, polygonLatLngs[0].lat]);

  const polygon = turf.polygon([ring]);

  // Check if the point is inside the polygon
  const isInside = turf.booleanPointInPolygon(pt, polygon);

  // Calculate distance from point to polygon boundary in meters
  const distanceToBoundary = turf.pointToLineDistance(
    pt,
    turf.polygonToLine(polygon),
    { units: "meters" }
  );

  console.log(isInside, "distanceToBoundary(m):", distanceToBoundary, "tolerance:", tolerance, id);

  if (isInside && distanceToBoundary <= tolerance) {
    const logEntry = {
      id: id,
      location: `${id} inside ${name}`,
      dateTime: new Date().toLocaleString(),
    };
    console.log("Geofence", logEntry);
    saveLog("Geofence", logEntry);

  } else if (!isInside && distanceToBoundary <= tolerance) {
    const logEntry = {
      id: id,
      location: `${id} outside ${name}`,
      dateTime: new Date().toLocaleString(),
    };
    console.log("Geofence", logEntry);
    saveLog("Geofence", logEntry);
  }

  return isInside;
}



// Utility: Check if a point is inside a circle using Turf.js
function isPointInsideCircle(id, date, name, point, center, radius) {
  const pt = turf.point([point[1], point[0]]);
  const ctr = turf.point([center[1], center[0]]);
  const distance = turf.distance(ctr, pt, { units: "meters" });

  const tolerance = 10; // meters
  const delta = distance - radius; // >0 => outside, <0 => inside

  if (delta >= -tolerance && delta < 0) {
    // Near boundary (inside)
    const logEntry = {
      id: id,
      location: `${id} inside ${name}`,
      dateTime: new Date().toLocaleString(),
    };
    console.log("Geofence", logEntry);
    saveLog("Geofence", logEntry);
  } else if (delta > 0 && delta <= tolerance) {
    // Near boundary (outside)
    // console.log(delta, tolerance);
    const logEntry = {
      id: id,
      location: `${id} outside ${name}`,
      dateTime: new Date().toLocaleString(),
    };
    console.log("Geofence", logEntry);
    saveLog("Geofence", logEntry);
  }


  console.log(distance, radius, delta, tolerance, id, "Geofence")
  return distance <= radius;
}

async function geofance_cheker(id, lat, lng) {
  try {
    console.log(id, lat, lng);

    if (lat === 0 && lng === 0) return;

    const response = await fetch(`${apiurl}/Get_geofance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "all" }),
    });
    const geoFences = await response.json();

    // console.log("API Data:", geoFences);


    geoFences.forEach((fence, index) => {
      const geo = fence.Data[0];
      if (!geo) return;

      if (geo.type === "Circle" && geo.Data?.center && geo.Data?.radius) {
        // Circle geofence check
        const inside = isPointInsideCircle(
          id,
          fence.updatedAt,
          fence.Name,
          [lat, lng],
          [geo.Data.center.lat, geo.Data.center.lng],
          geo.Data.radius
        );
        console.log(`Geofence ${fence.Name} (Circle) - Point inside:`, inside);

      } else if (geo.type === "Polygon" && Array.isArray(geo.Data)) {
        // Polygon geofence check
        const inside = isPointInsidePolygon(
          id,
          fence.Name,
          fence.updatedAt,
          [lat, lng],
          geo.Data
        );
        console.log(id, [lat, lng], geo);
        console.log(`Geofence ${fence.Name} (Polygon) - Point inside:`, inside);

      } else {
        console.log(`Geofence ${index} - Unknown or unsupported geofence type`);
      }
    });
  } catch (error) {
    console.error("Error in geofance_cheker:", error);
  }
}

// Idling detection
function checkIdling(id, speed, engineSpeed, time, latest, Ambient_temp) {
  if (!idlingFlags[id]) {
    idlingFlags[id] = { isIdling: false, startTime: null };
  }

  // Start idling
  if (engineSpeed !== 0 && speed === 0 && !idlingFlags[id].isIdling) {
    idlingFlags[id].isIdling = true;
    idlingFlags[id].startTime = time;
  }

  // End idling
  if (idlingFlags[id].isIdling && (speed > 0 || engineSpeed === 0)) {
    const durationSec = (time - idlingFlags[id].startTime) / 1000;
    const duration = formatDuration(durationSec);
    const logEntry = {
      vehicle: id,
      idlingDuration: duration,
      Ambient_Temperature: Ambient_temp,
      startTime: new Date(idlingFlags[id].startTime).toISOString(),
      endTime: new Date(time).toISOString(),
      dateTime: new Date().toLocaleString(),
    };
    saveLog("Idling", logEntry);
    idlingFlags[id].isIdling = false;
    idlingFlags[id].startTime = null;
  }
}

// Format duration for logs
function formatDuration(seconds) {
  if (seconds < 60) return `${Math.round(seconds)} Secs`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins} min${mins > 1 ? "s" : ""}${secs ? ` ${secs} Secs` : ""}`;
}

// Logging wrapper to send to API
async function saveLog(type, entry) {
  try {
    console.log(entry, type, "savelogs")
    const response = await fetch(`${apiurl}/add_alert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alert_type: type, data: entry }),
    });
    const res = await response.json();
    console.log(res);
  } catch (err) {
    console.error("Error sending log:", err);
  }
}
