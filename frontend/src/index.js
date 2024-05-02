import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Loader from "./layouts/Loader";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Suspense fallback={<Loader />}>
    <App />
  </Suspense>
);
