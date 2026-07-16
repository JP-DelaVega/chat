import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Added missing router imports
import { ClerkProvider, AuthenticateWithRedirectCallback } from '@clerk/clerk-react'; // Corrected package & added AuthenticateWithRedirectCallback
import App from "./App.jsx";
import "./index.css";
import SignInPage from "./pages/SignInPage";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
        <Routes>
          {/* Main App Routes */}
          <Route path="/" element={<App />} />

          {/* Custom Arcade Sign In */}
          <Route path="/sign-in" element={<SignInPage />} />

          {/* Essential Clerk SSO Callback Route */}
          <Route
            path="/sso-callback"
            element={<AuthenticateWithRedirectCallback />}
          />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);