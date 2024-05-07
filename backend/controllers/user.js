const bcrypt = require('bcrypt');
const userDB = require('../models/userDB');

//로그인
exports.loginCheck = async (req, res) => {
    const { userID, userPW } = req.body;
    var ress;

    try {
        const getUser = await userDB.getUser(userID);
        const getUserInfo = await userDB.getUserInfo(userID);

        if (!getUser.length) {
            return res.status(401).json({ success: false, message: '존재하지 않는 아이디입니다.' });
        }

        bcrypt.compare(userPW, getUser[0].password, (err, same) => {
            console.log(same);
            if (!same) {
                return res.status(401).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
            }
            userDB.updateUser(userID, 'LoginDate', '');

            res.status(200).json({ success: true, message: '로그인 성공', user: getUser, userinfo: getUserInfo});
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
};

//사용자 정보 (이름, 이메일...)
exports.getUserAcc = async (req, res) => {
    const { userID } = req.body;

    try {
        const getUser = await userDB.getUser(userID);

        if (!getUser.length) {
            return res.status(401).json({ success: false, message: '존재하지 않는 아이디입니다.' });
        }

        res.status(200).json({ success: true, message: '불러오기 성공', user: getUser});

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
};

//사용자 정보 (조작내역, 로그인 내역...)
exports.getUserInfo = async (req, res) => {
    const { userID } = req.body;

    try {
        const getUserInfo = await userDB.getUserInfo(userID);

        if (!getUserInfo.length) {
            return res.status(401).json({ success: false, message: '존재하지 않는 정보입니다.' });
        }

        res.status(200).json({ success: true, message: '불러오기 성공', userinfo: getUserInfo});

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
};

exports.updateUserInfo = async (req, res) => {
    const { userID, new_name, new_phone, new_email } = req.body;
    try {
        await userDB.updateUserInfo(userID, new_name, new_phone, new_email);

        res.status(200).json({ success: true, message: 'updateUserInfo 성공'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
};

//기기 정보 (ip, location...)
exports.getDevice = async (req, res) => {
    try {
        const getdevice = await userDB.getDevice();

        if (!getdevice.length) {
            return res.status(401).json({ success: false, message: '존재하지 않는 정보입니다.' });
        }

        res.status(200).json({ success: true, message: '불러오기 성공', deviceinfo: getdevice});

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
};

//기기 정보 (on/off)
exports.getDevice_human = async (req, res) => {
    try {
        const getdevice_human = await userDB.getDevice_human();

        if (!getdevice_human.length) {
            return res.status(401).json({ success: false, message: '존재하지 않는 정보입니다.' });
        }

        res.status(200).json({ success: true, message: '불러오기 성공', deviceinfo_human: getdevice_human});

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
};

exports.addDevice = async (req, res) => {
    const { UserId, Msg, Log, Device_num, IP, Latitude, Longitude, Location, Active } = req.body;
    try {
        await userDB.addDevice(Device_num, IP, Latitude, Longitude, Location, Active);
        await userDB.updateUser(UserId, Msg, Log);
        
        res.status(200).json({ success: true, message: 'INSERT 성공'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
};

exports.UpdateDevice = async (req, res) => {
    const { UserId, Msg, Log, Device_num, New_Device_num, New_Latitude, New_Longitude, Location, IP, Active } = req.body;
    try {
        await userDB.updateDevice(Device_num, New_Device_num, New_Latitude, New_Longitude, Location, IP);
        await userDB.updateHuman(Device_num, New_Device_num, Active);
        await userDB.updateUser(UserId, Msg, Log);
        
        res.status(200).json({ success: true, message: 'Update 성공'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
};

exports.deleteDevice = async (req, res) => {
    const { UserId, Msg, Log, deviceId } = req.body;
    try {
        await userDB.deleteDevice(deviceId);
        await userDB.updateUser(UserId, Msg, Log);

        res.status(200).json({ success: true, message: 'DELETE 성공'});

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
};