const db = require('../database/db');

//사용자 정보 (이름, 이메일...)
exports.getUser = (userID) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM account where id = ?`, userID, (err, result) => {
            if (err) reject(err);
            else resolve(result); 
        });
    });
};

//사용자 정보 (조작내역, 로그인 내역...)
exports.getUserInfo = (userID) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM user where id = ?`, userID, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

//사용자 조작 내역 업데이트
exports.updateUser = (UserId, Msg, Log) => {
    var today = new Date();

    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);

    var hours = ('0' + today.getHours()).slice(-2); 
    var minutes = ('0' + today.getMinutes()).slice(-2);
    var seconds = ('0' + today.getSeconds()).slice(-2); 
    var dateString = year + '-' + month  + '-' + day +" "+ hours + ':' + minutes  + ':' + seconds;

    switch(Msg){
        case("ControlDate"):
            new Promise((resolve, reject) => {
                db.query(`INSERT INTO user(id, ControlDate, Log) VALUES(?,?,?)`,[ UserId, dateString,Log], (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
            break;
        case("LoginDate"):
            new Promise((resolve, reject) => {
                db.query(`INSERT INTO user(id, LoginDate) VALUES(?,?)`,[ UserId, dateString], (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
            break;
    }
};

//사용자 정보 업데이트
exports.updateUserInfo = (userID, new_name, new_phone, new_email) => {
    new Promise((resolve, reject) => {
        db.query(`UPDATE account SET name =?, phone = ?, email = ? WHERE id = ?`, [new_name, new_phone, new_email, userID], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

//기기 정보 (ip, location...)
exports.getDevice = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM display`, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

//기기 정보 (on/off)
exports.getDevice_human = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM human_detect`, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

exports.addDevice = (Device_num, IP, Latitude, Longitude, Location, Active) => {
    new Promise((resolve, reject) => {
        db.query(`INSERT INTO display VALUES(?,?,?,?,?)`,[Device_num, Latitude, Longitude, Location, IP], (err, result) => {
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

exports.updateDevice = (Device_num, New_Device_num, New_Latitude, New_Longitude, Location, IP) => {
    new Promise((resolve, reject) => {
        db.query(`UPDATE display SET device_num =?, latitude = ?, longitude = ?,
         location = ?, device_ip_address = ? WHERE device_num = ?`, 
         [New_Device_num, New_Latitude, New_Longitude, Location, IP, Device_num], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

exports.updateHuman = (Device_num, New_Device_num, Active) => {
    console.log(Active);
    new Promise((resolve, reject) => {
        db.query(`UPDATE human_detect SET device_num =?, on_off =? WHERE device_num = ?`, [New_Device_num, Active, Device_num], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

exports.deleteDevice = (deviceId) => {
    new Promise((resolve, reject) => {
        db.query(`DELETE FROM display WHERE device_num = ?`, deviceId, (err, result) => {
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