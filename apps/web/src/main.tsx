import React from "react";
import ReactDOM from "react-dom/client";
import { WebRTCDemo } from "./webrtc/App";
import "./webrtc/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WebRTCDemo />
  </React.StrictMode>
);
