import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  entity_error: [],
};
const entity_errorSlice = createSlice({
  name: "sliceEntity_Error",
  initialState,
  reducers: {
    insertEntity: (state, action) => {
      state.entity_error.push(action.payload);
    },
  },
});

export const entity_errorActions = entity_errorSlice.actions;
export default entity_errorSlice.reducer;