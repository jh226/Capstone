import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Loader from "./layouts/Loader";
import { Provider } from "react-redux";
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Suspense fallback={<Loader />}>
      <App />
    </Suspense>
  </Provider>
);
