const express = require("express");
const router = express.Router();
const userController = require("./userDBControl");

router.post("/loginCheck", userController.loginCheck);
router.get("/getDevice", userController.getDevice);
router.get("/getDevice_human", userController.getDevice_human);
router.get("/getDevice_on_off", userController.getDevice_on_off);
router.get("/getSensor", userController.getSensor);
router.get("/getDevice_error", userController.getError);

router.post("/getUserInfo", userController.getUserInfo);
router.post("/getUserAcc", userController.getUserAcc);
router.post("/updateUserInfo", userController.updateUserInfo);

router.post("/UpdateDevice", userController.UpdateDevice);
router.post("/addDevice", userController.addDevice);
router.post("/deleteDevice", userController.deleteDevice);


module.exports = router;
