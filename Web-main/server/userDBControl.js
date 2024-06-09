const bcrypt = require("bcrypt");
const userDB = require("./dbSql");

//로그인
exports.loginCheck = async (req, res) => {
  const { userID, userPW } = req.body;
  try {
    const getUser = await userDB.getUser(userID);
    const getUserInfo = await userDB.getUserInfo(userID);

    if (!getUser.length) {
      return res
        .status(401)
        .json({ success: false, message: "존재하지 않는 아이디입니다." });
    }

    bcrypt.compare(userPW, getUser[0].password, (err, same) => {
      console.log(same);
      if (!same) {
        return res
          .status(401)
          .json({ success: false, message: "비밀번호가 일치하지 않습니다." });
      }
      //userDB.updateUser(userID, "LoginDate", "");

      res.status(200).json({
        success: true,
        message: "로그인 성공",
        user: getUser,
        userinfo: getUserInfo,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
};
exports.getDevice = async (req, res) => {
  try {
    const getdevice = await userDB.getDevice();

    if (!getdevice.length) {
      return res
        .status(401)
        .json({ success: false, message: "존재하지 않는 정보입니다." });
    }

    res
      .status(200)
      .json({ success: true, message: "불러오기 성공", deviceinfo: getdevice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
};

//기기 정보 (충돌 감지)
exports.getDevice_error = async (req, res) => {
  try {
    const getdevice_error = await userDB.getDevice_error();

    if (!getdevice_error.length) {
      return res
        .status(401)
        .json({ success: false, message: "존재하지 않는 정보입니다." });
    }

    res.status(200).json({
      success: true,
      message: "불러오기 성공",
      deviceinfo_error: getdevice_error,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
};

//기기 정보 (on/off)
exports.getDevice_on_off = async (req, res) => {
  try {
    const getdevice_on_off = await userDB.getDevice_on_off();

    if (!getdevice_on_off.length) {
      return res
        .status(401)
        .json({ success: false, message: "존재하지 않는 정보입니다." });
    }
    res.status(200).json({
      success: true,
      message: "불러오기 성공",
      deviceinfo_on_off: getdevice_on_off,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
};

exports.getUserInfo = async (req, res) => {
  const { userID } = req.body;

  try {
    console.log(userID);
    const getUserInfo = await userDB.getUserInfo(userID);

    if (!getUserInfo.length) {
      return res
        .status(401)
        .json({ success: false, message: "존재하지 않는 정보입니다." });
    }

    res
      .status(200)
      .json({ success: true, message: "불러오기 성공", userinfo: getUserInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
};

exports.getUserAcc = async (req, res) => {
  const { userID } = req.body;

  try {
    const getUser = await userDB.getUser(userID);

    if (!getUser.length) {
      return res
        .status(401)
        .json({ success: false, message: "존재하지 않는 아이디입니다." });
    }

    res
      .status(200)
      .json({ success: true, message: "불러오기 성공", user: getUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
};

exports.updateUserInfo = async (req, res) => {
  const { userID, new_name, new_phone, new_email } = req.body;
  try {
    await userDB.updateUserInfo(userID, new_name, new_phone, new_email);

    res.status(200).json({ success: true, message: "updateUserInfo 성공" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
};

exports.UpdateDevice = async (req, res) => {
  const {
    UserId,
    Msg,
    Log,
    Device_num,
    New_Device_num,
    New_Latitude,
    New_Longitude,
    Location,
    IP,
    Active,
  } = req.body;
  try {
    await userDB.updateDevice(
      Device_num,
      New_Device_num,
      New_Latitude,
      New_Longitude,
      Location,
      IP
    );
    await userDB.update_on_off(Device_num, New_Device_num, Active);
    await userDB.updateUser(UserId, Msg, Log);

    res.status(200).json({ success: true, message: "Update 성공" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
};

exports.addDevice = async (req, res) => {
  const {
    UserId,
    Msg,
    Log,
    Device_num,
    IP,
    Latitude,
    Longitude,
    Location,
    Active,
  } = req.body;
  try {
    await userDB.addDevice(
      Device_num,
      IP,
      Latitude,
      Longitude,
      Location,
      Active
    );
    await userDB.updateUser(UserId, Msg, Log);

    res.status(200).json({ success: true, message: "INSERT 성공" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
};

exports.deleteDevice = async (req, res) => {
  const { UserId, Msg, Log, deviceId } = req.body;
  try {
    await userDB.deleteDevice(deviceId);
    await userDB.updateUser(UserId, Msg, Log);

    res.status(200).json({ success: true, message: "DELETE 성공" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
};

exports.change_Device_on_off = async (req,res) => {
  const { device_num, current_on_off } = req.body;
  try {
    await userDB.change_On_Off(device_num, current_on_off);
    res.status(200).json({ success: true, message: "전원 변경" });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
};

exports.getTemHum = async(req,res) => {
  const { date } = req.body;
  try {
    const getTemHumData = await userDB.getTemHumData(date);
    console.log(getTemHumData)
    res.status(200).json({ success: true, message: "온습도 데이터" , tem_hum: getTemHumData});
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
}

