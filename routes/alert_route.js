const express = require("express");
const router = express.Router();
const alertcontrollert = require("../controllers/alert_data");


router.post("/add_alert",alertcontrollert.add_alert);
router.post("/get_alert",alertcontrollert.get_alert);


module.exports = router;

