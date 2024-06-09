import { configureStore } from "@reduxjs/toolkit";
import entityReducer from "./entitySlice";
import entity_errorReducer from "./entity_errorSlice";
import entity_on_offReducer from "./entity_on_offSlice";

const store = configureStore({
  reducer: {
    entity: entityReducer,
    entity_error: entity_errorReducer,
    entity_on_off: entity_on_offReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  })
});

export default store;
