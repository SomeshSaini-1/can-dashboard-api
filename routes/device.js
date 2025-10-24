
const express = require("express");
const router = express.Router();
const devicecontroller = require('../controllers/device_data');
const Device_controller = require('../controllers/device');
const Driver = require("../controllers/user");
const Farme = require("../controllers/data_farme");


router.post('/add_device_info',devicecontroller.add_device_data);
router.post('/add_all_info',devicecontroller.add_all_info);
router.post("/get_device_info", devicecontroller.get_device_data);
router.post("/get_all_data",devicecontroller.get_all_data);
router.post("/total_sensor_data",devicecontroller.total_data);
router.post("/all_data",devicecontroller.all_data);
router.get("Get_data_excle",devicecontroller.Get_data_excle);


router.post("/add_farme",Farme.add_farme);
router.post("/get_farme",Farme.get_farme);


router.post('/add_device',Device_controller.Device_add);
router.post("/get_device",Device_controller.Get_device);
router.post("/delete_device",Device_controller.delete_device);
router.post("/update_device_status",Device_controller.update_device);

router.post("/add_driver",Driver.add_driver);
router.post("/get_driver",Driver.get_driver);
router.post("/delete_driver",Driver.delete_driver);



module.exports = router;