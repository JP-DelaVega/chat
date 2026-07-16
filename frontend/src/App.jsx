import React from "react";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import Layout from "./components/Layout";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

export default function App() {
  return (
    <>
      {/* If logged out: Show the custom fullscreen login */}
      <SignedOut>
        <SignInPage />
      </SignedOut>

      {/* If logged in: Show the layout with the Sidebar and Homepage */}
      <SignedIn>
        <Layout>
          <HomePage />
        </Layout>
      </SignedIn>
    </>
  );
}