import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  entity_sensor: [],
};
const entity_sensorSlice = createSlice({
  name: "sliceEntity_Sensor",
  initialState,
  reducers: {
    insertEntity: (state, action) => {
      state.entity_sensor.push(action.payload);
    },
  },
});

export const entity_sensorActions = entity_sensorSlice.actions;
export default entity_sensorSlice.reducer;