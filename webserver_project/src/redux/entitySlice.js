import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  entity: [],
};
const entitySlice = createSlice({
  name: "sliceEntity",
  initialState,
  reducers: {
    insertEntity: (state, action) => {
      state.entity.push(action.payload);
    },
    updateEntity: (state, action) => {
      const {
        device_num,
        new_device_num,
        latitude,
        longitude,
        location,
        device_ip_address,
      } = action.payload;
      const entity = state.entity.find(
        (entity) => entity.device_num === device_num
      );
      if (entity) {
        entity.device_num = new_device_num;
        entity.latitude = latitude;
        entity.longitude = longitude;
        entity.location = location;
        entity.device_ip_address = device_ip_address;
      }
    },
    deleteEntity: (state, action) => {
      const { device_num } = action.payload;
      state.entity = state.entity.filter(
        (entity) => entity.device_num !== device_num
      );
    },
  },
});

export const entityActions = entitySlice.actions;
export default entitySlice.reducer;
