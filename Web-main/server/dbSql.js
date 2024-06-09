const db = require("./db");

//사용자 정보 (이름, 이메일...)
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

exports.updateUserInfo = (userID, new_name, new_phone, new_email) => {
  new Promise((resolve, reject) => {
    db.query(
      `UPDATE account SET name =?, phone = ?, email = ? WHERE id = ?`,
      [new_name, new_phone, new_email, userID],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
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

//기기 정보 (충돌 감지)
exports.getDevice_error = () => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM error`, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

//기기 정보 (on/ off)
exports.getDevice_on_off = () => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM device_on_off`, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

//수정(디바이스 정보)
exports.updateDevice = (
  Device_num,
  New_Device_num,
  New_Latitude,
  New_Longitude,
  Location,
  IP
) => {
  new Promise((resolve, reject) => {
    db.query(
      `UPDATE device SET device_num =?, latitude = ?, longitude = ?,
       location = ?, device_ip_address = ? WHERE device_num = ?`,
      [New_Device_num, New_Latitude, New_Longitude, Location, IP, Device_num],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

//수정(on_off)
exports.update_on_off = (Device_num, New_Device_num, Active) => {
  new Promise((resolve, reject) => {
    db.query(
      `UPDATE device_on_off SET device_num =?, current_on_off =? WHERE device_num = ?`,
      [New_Device_num, Active, Device_num],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

exports.updateUser = (UserId, Msg, Log) => {
  var today = new Date();

  var year = today.getFullYear();
  var month = ("0" + (today.getMonth() + 1)).slice(-2);
  var day = ("0" + today.getDate()).slice(-2);

  var hours = ("0" + today.getHours()).slice(-2);
  var minutes = ("0" + today.getMinutes()).slice(-2);
  var seconds = ("0" + today.getSeconds()).slice(-2);
  var dateString =
    year +
    "-" +
    month +
    "-" +
    day +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;

  switch (Msg) {
    case "ControlDate":
      new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO user(id, ControlDate, Log) VALUES(?,?,?)`,
          [UserId, dateString, Log],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
      break;
    case "LoginDate":
      new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO user(id, LoginDate) VALUES(?,?)`,
          [UserId, dateString],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
      break;
  }
};

// 추가(디바이스)
exports.addDevice = (Device_num, IP, Latitude, Longitude, Location, Active) => {
  new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO device VALUES(?,?,?,?,?)`,
      [Device_num, Latitude, Longitude, Location, IP],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });

  new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO device_on_off(device_num, current_on_off) VALUES(?,?)`,
      [Device_num, Active],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

//삭제(디바이스)
exports.deleteDevice = (deviceId) => {
  new Promise((resolve, reject) => {
    db.query(
      `DELETE FROM device WHERE device_num = ?`,
      deviceId,
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });

  new Promise((resolve, reject) => {

    db.query(
      `DELETE FROM device_on_off WHERE device_num = ?`,
      deviceId,
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

//차양막 On_OFF
exports.change_On_Off = (device_num, current_on_off) => {
  changeValue = current_on_off === 1 ? 0 : 1;
  new Promise((resolve, reject) => {
    db.query(
      `UPDATE device_on_off SET current_on_off = ? WHERE device_num = ?`,
      [changeValue, device_num],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}

exports.getTemHumData = (date) => {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT 
        HOUR(\`current_time\`) AS hour, 
        location, 
        AVG(temp) AS avg_tem, 
        AVG(humi) AS avg_hum, 
        \`current_date\` 
    FROM 
        device_data
    WHERE  
        \`current_date\` = ? 
    GROUP BY 
        HOUR(\`current_time\`), 
        location, 
        \`current_date\`;`;
    db.query(
      query,
      [date],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}

