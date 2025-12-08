import React from "react";
import ReactDOM from "react-dom/client";
import { MeetingApp } from "./app/MeetingApp";
import "./webrtc/index.css";
import { ClerkProvider, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const DEV_MODE = import.meta.env.VITE_DEV_MODE === "1";

if (!clerkPublishableKey) {
  console.warn("VITE_CLERK_PUBLISHABLE_KEY not set – Clerk UI will not render");
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {clerkPublishableKey ? (
      <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl="/">
        <SignedIn>
          <MeetingApp />
        </SignedIn>
        <SignedOut>
          <div style={{ display: "grid", placeItems: "center", minHeight: "100vh", background: "#0f172a", color: "#e2e8f0" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ marginBottom: "1rem" }}>Sign in to continue to Kira.</p>
              <SignInButton mode="modal" />
            </div>
          </div>
        </SignedOut>
      </ClerkProvider>
    ) : DEV_MODE ? (
      <MeetingApp />
    ) : (
      <div style={{ display: "grid", placeItems: "center", minHeight: "100vh", background: "#0f172a", color: "#e2e8f0", textAlign: "center", padding: "2rem" }}>
        <div>
          <p style={{ marginBottom: "0.75rem", fontSize: "16px" }}>Clerk is required in production.</p>
          <p style={{ marginBottom: "0.5rem", color: "#94a3b8" }}>
            Set <code>VITE_CLERK_PUBLISHABLE_KEY</code> and restart the app, or enable <code>VITE_DEV_MODE=1</code> for local development.
          </p>
        </div>
      </div>
    )}
  </React.StrictMode>
);
