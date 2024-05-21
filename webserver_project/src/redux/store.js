import { configureStore } from "@reduxjs/toolkit";
import entityReducer from "./entitySlice";
import entity_humanReducer from "./entity_humanSlice";
import entity_on_offReducer from "./entity_on_offSlice";
import entity_sensor from "./entity_sensorSlice";
import entity_error from "./entity_errorSlice";

const store = configureStore({
  reducer: {
    entity: entityReducer,
    entity_human: entity_humanReducer,
    entity_on_off: entity_on_offReducer,
    entity_sensor: entity_sensor,
    entity_error: entity_error
  },
});

export default store;
