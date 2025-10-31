const express = require("express");
const router = express.Router();
const alertcontroller = require("../controllers/alert_data");
const Geofancecontroller = require("../controllers/geofance");


router.post("/add_alert",alertcontroller.add_alert);
router.post("/get_alert",alertcontroller.get_alert);

router.post("/Add_geofance",Geofancecontroller.Add_geofance);
router.post("/Get_geofance",Geofancecontroller.Get_geofance);
router.post("/Delete_geofance",Geofancecontroller.Delete_geofance);


module.exports = router;

