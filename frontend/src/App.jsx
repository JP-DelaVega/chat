import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

import SignInPage from "./pages/SignInPage";
import MainMenu from "./pages/MainMenu";
import ResumePage from "./pages/ResumePage";
import HomePage from "./pages/HomePage"

export default function App() {
  return (
    <>
      <SignedOut>
        <Routes>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
          <Route path="*" element={<Navigate to="/sign-in" replace />} />
        </Routes>
      </SignedOut>

      <SignedIn>
        <Routes>
          <Route path="/" element={<MainMenu />} />

          <Route path="/homepage" element={<HomePage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SignedIn>
    </>
  );
}