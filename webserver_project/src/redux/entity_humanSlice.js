import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  entity_human: [],
};
const entity_humanSlice = createSlice({
  name: "sliceEntity_Human",
  initialState,
  reducers: {
    insertEntity: (state, action) => {
      state.entity_human.push(action.payload);
    },
  },
});

export const entity_humanActions = entity_humanSlice.actions;
export default entity_humanSlice.reducer;
