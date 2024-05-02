import React, { createContext, useContext, useState } from "react";

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [devices, setDevices] = useState([]);
  const [devices_human, setdevices_human] = useState([]);

  const getDevices = (devices) => {
    setDevices(devices);
  };

  const getdevices_human = (devices_human) => {
    setdevices_human(devices_human);
  };

  return (
    <DeviceContext.Provider
      value={{ getDevices, devices, getdevices_human, devices_human }}
    >
      {children}
    </DeviceContext.Provider>
  );
};


export const useDevice = () => {
if (!useContext(DeviceContext)) {
    throw new Error("useDevice must be used within a DeviceProvider");
    }
  return useContext(DeviceContext);
};
