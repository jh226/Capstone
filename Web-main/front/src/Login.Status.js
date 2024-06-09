import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [IsAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState("");
  const [phone, setPhone] = useState("");
  const [joinDate, setjoinDate] = useState("");
  const [loginDate, setloginDate] = useState("");
  const [controlDate, setcontrolDate] = useState("");
  const [log, setlog] = useState("");

  const login = (username, password, users, userInfo) => {
    setIsLoggedIn(true);
    setUsername(username);
    setPassword(password);
    setIsAdmin(users[0].isAdmin);
    setName(users[0].name);
    setEmail(users[0].email);
    setDept(users[0].dept);
    setPhone(users[0].phone);
    info(userInfo);
  };

  const updateUserInfo = (user) => {
    setName(user[0].name);
    setEmail(user[0].email);
    setPhone(user[0].phone);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  //사용자 정보(조작내역..) 저장
  const info = (userInfo) => {
    const joinDates = [];
    const loginDates = [];
    const controlDates = [];
    const logs = [];
    for (let i = 0; i < userInfo.length; i++) {
      const user = userInfo[i];
      if (user.JoinDate !== null) {
        joinDates.push(user.JoinDate);
      }
      if (user.LoginDate !== null) {
        loginDates.push(user.LoginDate);
      }
      if (user.ControlDate !== null) {
        controlDates.push(user.ControlDate);
        logs.push(user.Log);
      }
    }
    setjoinDate(joinDates);
    setloginDate(loginDates);
    setcontrolDate(controlDates);
    setlog(logs);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        updateUserInfo,
        logout,
        info,
        username,
        password,
        IsAdmin,
        name,
        email,
        dept,
        phone,
        joinDate,
        loginDate,
        controlDate,
        log,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
