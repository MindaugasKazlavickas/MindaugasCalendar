import React from "react";
import ReactDOM from "react-dom/client";
import "./styling/index.css";
import "./styling/reset.css";
import "./styling/style.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
