const db = require('../database/db');

exports.getUser = (userID) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM account where id = ?`, userID, (err, result) => {
            if (err) reject(err);
            else resolve(result); 
        });
    });
};

exports.getUserInfo = (userID) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM user where id = ?`, userID, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

exports.getDevice = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM device`, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

exports.getDevice_human = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM human_detect`, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

exports.addDevice = (Device_num, IP, Location, Active) => {
    new Promise((resolve, reject) => {
        db.query(`INSERT INTO device VALUES(?,?,?)`,[Device_num, Location, IP], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });

    new Promise((resolve, reject) => {
        db.query(`INSERT INTO human_detect VALUES(?,?)`,[Device_num, Active], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

exports.updateDevice = (Device_num, New_Device_num, IP, Location, Active) => {
    new Promise((resolve, reject) => {
        db.query(`UPDATE device SET device_num =?, location = ?, address_ip = ? WHERE device_num = ?`, [New_Device_num, Location, IP, Device_num], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

exports.updateHuman = (Device_num, New_Device_num,  Active) => {
    console.log(Active);
    new Promise((resolve, reject) => {
        db.query(`UPDATE human_detect SET device_num =?, on_off =? WHERE device_num = ?`, [Active, New_Device_num, Device_num], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

exports.deleteDevice = (deviceId) => {
    new Promise((resolve, reject) => {
        db.query(`DELETE FROM device WHERE device_num = ?`, deviceId, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });

    new Promise((resolve, reject) => {
        db.query(`DELETE FROM human_detect WHERE device_num = ?`, deviceId, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

exports.updateUserInfo = (userID, new_name, new_phone, new_email) => {
    new Promise((resolve, reject) => {
        db.query(`UPDATE account SET name =?, phone = ?, email = ? WHERE id = ?`, [new_name, new_phone, new_email, userID], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};