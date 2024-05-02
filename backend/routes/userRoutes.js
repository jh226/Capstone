const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/data', userController.data);
router.post('/loginCheck', userController.loginCheck);
router.post('/getUserInfo', userController.getUserInfo);
router.post('/getDevice', userController.getDevice);
router.post('/getDevice_human', userController.getDevice_human);
router.post('/addDevice', userController.addDevice);
router.post('/deleteDevice', userController.deleteDevice);
router.post('/updateUserInfo', userController.updateUserInfo);
router.post('/UpdateDevice', userController.UpdateDevice);


module.exports = router;