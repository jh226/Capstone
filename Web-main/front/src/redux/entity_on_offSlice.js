import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  entity_on_off: [],
};
const entity_on_offSlice = createSlice({
  name: "sliceEntity_OnOff",
  initialState,
  reducers: {
    insertEntity: (state, action) => {
      state.entity_on_off.push(action.payload);
    },
    updateEntity: (state, action) => {
      const { device_num, new_device_num, current_on_off } = action.payload;
      const entity = state.entity_on_off.find(
        (entity) => entity.device_num === device_num
      );
      if (entity) {
        entity.device_num = new_device_num;
        entity.current_on_off = current_on_off;
      }
    },
    deleteEntity: (state, action) => {
      const device_num = action.payload;
      state.entity_on_off = state.entity_on_off.filter(
        (entity) => entity.device_num !== device_num
      );
    },
    switchOnOff: (state, action) => {
      const {device_num} = action.payload;
      console.log(device_num)
      const entity = state.entity_on_off.find(
        (entity) => entity.device_num === device_num
      )
      if(entity){    
        entity.current_on_off = entity.current_on_off === 0 ? 1 : 0
      }
    }
  },
});

export const entity_on_offActions = entity_on_offSlice.actions;
export default entity_on_offSlice.reducer;
