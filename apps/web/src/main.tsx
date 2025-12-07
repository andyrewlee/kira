import React from "react";
import ReactDOM from "react-dom/client";
import { MeetingApp } from "./app/MeetingApp";
import "./webrtc/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MeetingApp />
  </React.StrictMode>
);
