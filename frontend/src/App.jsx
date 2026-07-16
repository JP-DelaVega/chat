import React from "react";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import Layout from "./components/Layout";
import { Provider } from 'react-redux';
import { store } from './store';
import { SignedIn, SignedOut } from "@clerk/clerk-react";

export default function App() {
  return (
    <Provider store={store}> {/* 👈 Wrap everything here */}
      <SignedOut>
        <SignInPage />
      </SignedOut>

      <SignedIn>
        <Layout>
          <HomePage />
        </Layout>
      </SignedIn>
    </Provider>
  );
}